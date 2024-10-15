package com.example.test.Service;

import com.example.test.Controller.GetQuestionResultDto;
import com.example.test.domain.QuestionDomain;
import com.example.test.domain.UserDomain;
import com.example.test.dto.*;
import com.example.test.exception.UserException;
import com.example.test.repository.QuestionRepository;
import com.example.test.repository.UserRepository;
import com.example.test.type.ErrorCode;
import com.example.test.type.QuestionType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public void createTest() {
        // 문항들을 배열에 저장
        String[] questions = {
                "오늘이 몇 월이고, 무슨 요일인지를 잘 모른다",
                "자기가 놔둔 물건을 찾지 못한다",
                "같은 질문을 반복해서 한다",
                "약속을 하고서 잊어버린다",
                "물건을 가지러 갔다가 잊어버리고 그냥 온다",
                "물건이나, 사람의 이름을 대기가 힘들어 머뭇거린다",
                "대화 중 내용이 이해되지 않아 반복해서 물어본다",
                "길을 잃거나 헤맨 적이 있다",
                "예전에 비해서 계산능력이 떨어졌다",
                "예전에 비해 성격이 변했다",
                "이전에 잘 다루던 기구의 사용이 서툴러졌다",
                "예전에 비해 방이나 집안의 정리 정돈을 하지 못한다",
                "상황에 맞게 스스로 옷을 선택하여 입지 못한다",
                "혼자 대중교통 수단을 이용하여 목적지에 가기 힘들다",
                "내복이나 옷이 더러워져도 갈아입지 않으려고 한다"
        };



        // 각 문항을 QuestionDomain 객체로 생성하고 저장
        for (String questionText : questions) {
            QuestionDomain question = new QuestionDomain();
            question.setQuestion(questionText);
            question.setType(QuestionType.KDSQ);  // 적절한 QuestionType 설정
            questionRepository.save(question);
        }
    }

    // 랜덤으로 섞은 후, 15개만 반환 , SDQ는 32개의 문항지가있음
    public GetQuestionResultDto getQuestion(QuestionType type, String userId) {
        UserDomain user = userRepository.findByUserId(userId);
        if(user.getLastTestDate() != null &&!user.getLastTestDate().isBefore(LocalDate.now().minusDays(30))){
            throw new UserException(ErrorCode.TEST_ALREADY_FINISH);
        }
        List<QuestionDomain> findByType =
                questionRepository.findAllByType(type);
        Collections.shuffle(findByType);
        List<GetQuestionDto> result =
                findByType.stream().limit(15).map(GetQuestionDto::fromEntity).toList();
        Map<String,Integer> testMap = new HashMap<>();
        for(GetQuestionDto dto : result){
            testMap.put(dto.getQuestion(),0);
        }
        QuestionDomain testSet = new QuestionDomain();
        testSet.setUserId(userId);
        testSet.setTest(testMap);
        testSet.setTestCreateAt(LocalDate.now());
        user.setLastTestDate(LocalDate.now());
        //userRepository.save(user);
        QuestionDomain save = questionRepository.save(testSet);
        return new GetQuestionResultDto(save.getQuestionId(),result);
    }


    public QuestionResultResponse setQuestionAnswer(String testId, Map<String, Integer> result) {
        QuestionDomain test = questionRepository.findById(testId)
                .orElseThrow(()-> new UserException(ErrorCode.INVALID_ARGUMENT));
        test.setTest(result);

        int totalScore =
                result.values().stream().mapToInt(Integer::intValue).sum();
        test.setResult(totalScore);
        String comment;
        if (totalScore <= 3) {
            comment =  "인지기능 저하 없음";
        } else if (totalScore <= 5) {
            comment =  "경미한 인지기능 저하";
        } else if (totalScore <= 7) {
            comment =  "중간 정도의 인지기능 저하";
        } else {
            comment =  "중증 인지기능 저하 가능성";
        }
        test.setDescription(comment);
        questionRepository.save(test);

        return new QuestionResultResponse(totalScore,comment);
    }

    public List<GetResultDto> getResultList(String userId) {
        List<QuestionDomain> results = questionRepository.findAllByUserId(userId);

        return results.stream()
                .map(GetResultDto::fromEntity)
                .sorted(Comparator.comparing(GetResultDto::getDate).reversed())
                .toList();
    }

    public GetResultDetailDto getResultDetail(String userId, LocalDate date) {
        return GetResultDetailDto.fromEntity(questionRepository.findByUserIdAndTestCreateAt(userId, date));
    }
}
