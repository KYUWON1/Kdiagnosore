package com.example.test.Service;

import com.example.test.domain.ChatDomain;
import com.example.test.domain.TestDomain;
import com.example.test.domain.UserDomain;
import com.example.test.repository.TestRepository;
import com.example.test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CognitiveTestService {
    private final TestRepository testRepository;
    private final UserRepository userRepository;

    // todo : 보호자아이디랑 피보호자 연동해야할듯 ID
    public List<TestDomain> getTestList(String userId) {
        // 보호자 아이디
        UserDomain user = userRepository.findByUserId(userId);
        List<TestDomain> testList = new ArrayList<>();
        if(user.getRole().equals("user")){
            // 해당 userId로 TestDomain 리스트를 조회
            testList = testRepository.findByUserId(userId);
        }else if(user.getRole().equals("protector")){
            UserDomain byProtector = userRepository.findByProtectorName(user.getUserName());
            testList = testRepository.findByUserId(byProtector.getUserId());
        }


        // LocalDate별로 가장 최근 시간을 가진 TestDomain을 그룹화
        Map<LocalDate, TestDomain> lastTestPerDate = testList.stream()
                .collect(Collectors.groupingBy(
                        TestDomain::getDate,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparing(TestDomain::getTime)),
                                Optional::get
                        )
                ));

        // 그룹화된 결과에서 필요한 작업을 처리 후 반환할 수도 있고, 원하는 대로 가공
        return new ArrayList<>(lastTestPerDate.values()); // 가장 최근의 TestDomain들을 리스트로 반환
    }

    public List<TestDomain> getTestListbyDate(String userId, String date) {
        UserDomain user = userRepository.findByUserId(userId);
        List<TestDomain> testList = new ArrayList<>();
        if(user.getRole().equals("user")){
            testList = testRepository.findByUserIdAndDate(userId, date);
        }else if(user.getRole().equals("protector")){
            UserDomain byProtector = userRepository.findByProtectorName(user.getUserName());
            testList = testRepository.findByUserIdAndDate(byProtector.getUserId(),date);
        }

        return testList;
    }

    @Transactional
    public TestDomain setCognitiveTestAnswer(String answer, String testId,
                                       String userId) {
        TestDomain test = testRepository.findByUserIdAndTestId(userId,
                testId);
        test.setAnswer(answer);
        TestDomain save = testRepository.save(test);
        return save;
    }

    @Transactional
    public void saveTestGaggwan(String userId,String createdTest) {
        String[] questions = createdTest.split("\n\n");
        for (int i = 0; i < questions.length; i++) {
            System.out.println("블록"+i+questions[i]);
        }

        for (String questionBlock : questions) {
            String[] parts = questionBlock.split("@");

            // parts 배열 길이 확인
            if (parts.length < 7) {
                System.out.println("형식 오류: 예상한 형식에 맞지 않는 데이터입니다.");
                continue;
            }
            TestDomain newTest = new TestDomain();
            newTest.setUserId(userId);
            // 질문 텍스트
            String question = parts[0].replace("Q 질문입니다! ", "").trim();
            System.out.println("question = " + question);
            newTest.setQuestion(question);
            // 보기 텍스트들
            Map<Integer,String> map = new HashMap<>();
            for (int i = 1; i <= 4; i++) {
                String answer = parts[i].replaceAll("^[0-9]+ ", "").trim();
                System.out.println("option " + i + " = " + answer);
                map.put(i,answer);
            }
            newTest.setGaggawnList(map);
            // 정답
            String answer = parts[5].replace("A ", "").trim();
            System.out.println("answer = " + answer);
            newTest.setGaggawnAnswer(Integer.parseInt(answer));

            // 이유
            String reason = parts[6].replace("R ", "").trim();
            System.out.println("reason = " + reason);
            newTest.setGaggawnReason(reason);
            newTest.setGaggwan(true);
            newTest.setDate(LocalDate.now());
            newTest.setTime(LocalTime.now());
            testRepository.save(newTest);
            System.out.println("---------------");
        }
    }

}
