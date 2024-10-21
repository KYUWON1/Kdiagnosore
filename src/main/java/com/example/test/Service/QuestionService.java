package com.example.test.Service;

import com.example.test.dto.GetQuestionResultDto;
import com.example.test.domain.QuestionDomain;
import com.example.test.domain.UserDomain;
import com.example.test.dto.*;
import com.example.test.exception.UserException;
import com.example.test.repository.QuestionRepository;
import com.example.test.repository.UserRepository;
import com.example.test.type.ErrorCode;
import com.example.test.type.QuestionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public void createTest() {
        // 문항들을 배열에 저장
//        String[] questions = {
//                "전화번호나 사람 이름을 기억하기 힘들다",
//                "어떤 일이 언제 일어났는지 기억하지 못할 때가 있다",
//                "며칠 전에 들었던 이야기를 잊는다",
//                "오래 전부터 해오던 일은 잘 하나 새로운 것을 배우기가 힘들다",
//                "반복되는 일상 생활에 변화가 생겼을 때 금방 적응하기가 힘들다",
//                "본인에게 중요한 사항을 잊을 때가 있다 (예를 들어 배우자 생일, 결혼 기념일 등)",
//                "다른 사람에게 같은 이야기를 반복할 때가 있다",
//                "어떤 일을 해놓고 잊어버려 다시 반복한 적이 있다",
//                "약속을 해놓고 까먹을 때가 있다",
//                "이야기 도중 방금 자기가 무슨 이야기를 하고 있었는지를 잊을 때가 있다",
//                "약 먹는 시간을 놓치기도 한다",
//                "여러 가지 물건을 사러 갔다가 한 두 가지를 빠뜨리기도 한다",
//                "가스 불을 끄는 것을 잊어버린 적이 있다 또는 음식을 태운 적이 있다",
//                "남에게 같은 질문을 반복한다",
//                "어떤 일을 해놓고 했는지 안 했는지 몰라 다시 확인해야 한다",
//                "물건을 두고 다니거나 또는 가지고 갈 물건을 놓고 간다",
//                "하고싶은 말이나 표현이 금방 떠오르지 않는다",
//                "물건 이름이 금방 생각나지 않는다",
//                "개인적인 편지나 사무적인 편지를 쓰기 힘들다",
//                "갈수록 말 수가 감소되는 경향이 있다",
//                "신문이나 잡지를 읽을 때 이야기 줄거리를 파악하지 못한다",
//                "책을 읽을 때 같은 문장을 여러 번 읽어야 이해가 된다",
//                "텔레비전에 나오는 이야기를 따라 가기 힘들다",
//                "자주 보는 친구나 친척을 바로 알아보지 못한다",
//                "물건을 어디에 두고 나중에 어디에 두었는지 몰라 찾게 된다",
//                "전에 가본 장소를 기억하지 못한다",
//                "방향감각이 떨어졌다",
//                "길을 잃거나 헤맨 적이 있다",
//                "물건을 항상 두는 장소를 망각하고 엉뚱한 곳을 찾는다",
//                "계산 능력이 떨어졌다",
//                "돈 관리를 하는데 실 수가 있다",
//                "과거에 쓰던 기구 사용이 서툴러졌다"
//        };
//
//        String[] explain = {
//                "친구와 이야기를 하다가 갑자기 그의 전화번호가 생각나지 않아서 휴대폰을 뒤적거린다. “분명히 자주 연락하는 번호인데, 왜 기억이 나질 않는 거지?”라고 생각하며 답답함을 느낀다",
//                "며칠 전 친구와 점심을 먹었다고 생각했는데, 친구가 “그건 지난주였잖아”라고 말한다. 순간, 그때가 정확히 언제였는지 헷갈려서 “벌써 그렇게 됐나?” 하고 속으로 되뇐다",
//                "가족이 했던 이야기 중에 중요한 내용을 기억하지 못해 “네가 뭐라고 했었지?”라고 물어본다. 같은 대답을 들으면서도 어딘가 익숙하지 않아, 이 내용을 처음 듣는 기분이 든다",
//                "TV 리모컨을 사용하던 주인공이 새로 설치된 스마트 TV에서 메뉴를 찾으려는데, 어떻게 해야 할지 몰라 한참을 헤맨다. “예전 것만큼 쉽게 다뤄지지 않네…”라고 중얼거리며 도움을 요청한다",
//                "매일 다니던 길이 공사 중이라 새로운 길로 돌아가야 하는데, 돌아가는 방향을 몰라 당황하게 된다. “어디로 가야 하지? 이 길이 맞나?”라고 속으로 되뇐다",
//                "아침에 배우자가 기념일에 대해 묻는데, “어? 오늘이 기념일이었어?”라며 전혀 기억하지 못한 자신에게 놀란다. 순간 자신이 놓친 걸 깨닫고 미안함이 몰려온다",
//                "“저번 주말에 산책을 나갔는데…”라고 이야기를 꺼내자, 상대방이 “이야기 들었어”라고 대답한다. 순간 당황스러워져서 “아, 내가 말했구나” 하고 말끝을 흐린다",
//                "방금 쓰레기를 버리러 나갔던 주인공은 또다시 쓰레기 봉투를 챙겨 들며 “쓰레기를 아직 안 버렸던가?” 하고 중얼거린다. 돌아와서 쓰레기를 이미 버렸다는 사실을 알게 되어 허탈해진다",
//                "친구와 약속이 있던 날, 우연히 친구로부터 “어디야?”라는 메시지를 받고 나서야 약속이 있음을 깨닫고 당황한다. “아, 잊고 있었어…”라며 부랴부랴 준비를 시작한다",
//                "이야기를 하다가 갑자기 무슨 말을 하려고 했는지 잊어버려 어리둥절해한다. “어, 무슨 얘기였지?” 하고 머리를 긁적이며 상대방의 힌트를 기다린다",
//                "약을 먹는 시간인데, 할 일을 하다 보니 잊어버리고 시간이 한참 지나 있다. “아, 약을 안 먹었네!”라고 말하며 시간을 보며 후회한다",
//                "마트에서 장을 보고 돌아와 물건을 정리하다가, 산다고 했던 물건이 빠져 있음을 발견한다. “분명히 기억하고 있었는데, 왜 사지 않았지?”라며 아쉬워한다",
//                "음식을 끓이던 중 잠시 다른 일을 보고 와보니 가스 불을 끄지 않아 물이 다 증발해 있다. “이런, 또 깜빡했네”라며 자책하게 된다",
//                "“언제 다시 만날 거라고 했지?”라며 물어보자, 상대방이 “아까도 말했잖아”라고 답한다. “아, 그래? 미안해” 하면서도 그 답이 익숙하지 않다",
//                "출근을 하려다가 문이 잠겼는지 기억이 안 나서 다시 집에 돌아와 문을 확인한다. “문은 잠갔겠지… 그래도 혹시 모르니까”라며 집으로 돌아간다",
//                "출발하고 나서 휴대폰을 안 가져왔다는 걸 깨닫고 되돌아가며 “분명히 챙겼다고 생각했는데, 왜 집에 있지?”라며 혼란스러워 한다",
//                "사람들과 대화 중에 하려고 했던 말을 떠올리지 못해 “저기… 그 뭐더라…” 하며 한참을 머뭇거린다",
//                "“저기, 그거 좀 가져다줄래?” 하며 물건을 가리키지만, 상대방이 물으면 “아니, 그거 말고… 뭐더라…” 하며 물건 이름이 떠오르지 않아 당황한다",
//                "누군가에게 메일을 쓰려고 하는데 문장이 잘 떠오르지 않아, 마침내 한 문장을 작성하는 데에도 한참이 걸린다. “이렇게 쓰면 좀 이상하려나?” 고민하며 시간을 보낸다",
//                "사람들과 대화할 때 말을 이어가기가 부담스러워져 듣는 역할로만 남아있는 자신을 발견하고, “내가 요즘은 말을 잘 안 하네…”라고 느낀다",
//                "신문을 읽고 나서 기사 내용을 설명하려고 하지만, 내용을 이해하지 못해 어색한 웃음을 지으며 “아… 뭐, 중요한 얘기였어”라고 얼버무린다",
//                "같은 문장을 여러 번 읽고서야 내용을 이해한다. “왜 이렇게 어려운 문장이지?”라며 책을 넘기기가 힘들어진다",
//                "드라마를 보며 이야기가 어디쯤인지 헷갈려서 중간에 몇 번이고 상대방에게 질문하게 된다. “얘가 왜 저기 있는 거야?” 하고 이해되지 않아 답답해한다",
//                "마주친 친척이 인사를 건네지만, 순간적으로 “누구였지?” 하고 머릿속이 하얘져서 당황한다",
//                "안경을 찾으려고 방을 헤매며 “도대체 어디다 두었을까?” 하고 계속 뒤지며 집 안을 돌아다닌다",
//                "전에 갔던 식당이 어딘지 기억이 나지 않아 길을 잃고 주위를 둘러보며 “분명히 이 근처였는데”라고 혼잣말을 한다",
//                "길을 잘 찾아다니던 주인공은 자주 가는 동네에서도 갑자기 방향이 헷갈린다. “이쪽이 맞나?”라며 생각해보지만, 머릿속이 복잡해져 엉뚱한 방향으로 걷기 시작한다. 자꾸만 자신이 길을 헤매는 걸 느끼며, “내가 이렇게까지 헷갈렸었나?”라고 생각하게 된다",
//                "집으로 돌아가는 길인데 갑자기 눈앞의 길이 낯설게 느껴져 멈춰 선다. “이 길이 맞는 건가?” 하며 주변을 둘러보지만, 어디로 가야 할지 감이 오지 않는다. 한참 동안 그 자리에 서 있다가 결국 사람들에게 길을 물어보며, “예전엔 이런 적이 없었는데…”라고 혼란스러워한다",
//                "평소에 열쇠를 두는 테이블을 지나쳐 다른 방을 돌아다니며 열쇠를 찾는다. “내가 분명히 여기에 두었을텐데…”라며 엉뚱한 곳을 뒤적거린다. 그러다 열쇠를 보통 두는 자리에 놓아둔 것을 발견하고, “왜 여긴 안 떠올랐지?”라며 어리둥절해 한다",
//                "물건을 계산하려고 지갑에서 돈을 꺼내면서 잔돈을 얼마나 받아야 하는지 혼자서 계산해 보려 한다. 하지만 머릿속에서 자꾸 헷갈려 정확한 금액이 떠오르지 않아, 계산원에게 물어보며 “이렇게 간단한 것도 이제는 어렵네…”라고 한숨을 쉰다",
//                "매달 납부하는 고지서 금액이 정확히 얼마였는지 기억이 나지 않아, 통장에서 돈을 이체하는 중에 잘못된 금액을 입력해버린다. 나중에 다시 확인하면서 “아, 너무 많이 보냈네…”라며 실수를 깨닫고 당황한다",
//                "오래된 믹서기를 꺼내 사용하려고 하니, 어느 버튼을 눌러야 작동하는지 혼란스러워져서 한참을 헤맨다. “이걸 어떻게 사용하더라?”라며 고개를 갸웃거리고, 결국 사용법을 다시 찾아보며, “이게 이렇게 낯설었나?”라고 중얼거린다"
//        };

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

        String[] explain = {
                "아침에 일어나서 “오늘이 10월 맞지?”라며 주위 사람들에게 물어본다. 같은 날 저녁에도 다시 요일이나 월을 확인하려고 한다.",
                "집에 들어와서 열쇠를 탁자 위에 놓았지만, 잠시 후 열쇠가 어디 있는지 기억하지 못해 온 집안을 돌아다니며 찾는다.",
                "가족과 함께 식사하는 자리에서 “내일 외출해야 하나?”라고 묻고, 잠시 후에 또 같은 질문을 한다.",
                "친구와 약속을 잡아놓고, 약속 날짜에 전혀 기억하지 못해 다른 일정을 잡아버린다.",
                "주방에 물 한 잔 가지러 갔다가, 그 목적을 잊고 빈손으로 돌아온다.",
                "가족과 대화 중에 자주 가던 카페의 이름이 생각나지 않아 “거기, 그 뭐였더라…” 하며 말을 이어가지 못한다.",
                "친구가 주말 계획에 대해 설명하면, 방금 들었는데도 “그래서, 그게 언제라고?”라고 다시 물어본다.",
                "평소 자주 가던 마트에서 집으로 돌아오는 길에 방향이 헷갈려 다른 길로 가버린다.",
                "물건을 사려고 지갑에서 돈을 꺼내다가 거스름돈을 잘못 주거나, 간단한 계산이 머릿속에서 헷갈린다.",
                "사소한 일에도 화를 내거나, 전보다 훨씬 감정적으로 행동하는 일이 잦아졌다.",
                "예전에는 문제없이 사용하던 리모컨이나 커피 머신이 갑자기 낯설게 느껴져 어떻게 사용하는지 헤매게 된다.",
                "집안에 있는 물건들을 제자리에 두지 않고, 사용 후 그대로 두는 경우가 많아져서 집이 어수선해진다.",
                "날씨가 더운데도 겨울옷을 꺼내 입으려고 하거나, 외출할 때 입기에는 어울리지 않는 잠옷을 입으려고 한다.",
                "버스를 타고 나서 목적지에 도착할 때까지 내릴 곳을 놓쳐서 계속 버스에 타고 있는 경우가 있다.",
                "옷에 음식물이 묻어도 갈아입을 생각을 하지 않고, 그냥 그대로 입고 다니려 한다."


        };
        System.out.println(explain.length);
        System.out.println(questions.length);

        // 각 문항을 QuestionDomain 객체로 생성하고 저장
        for (int i =0;i < explain.length; i++) {
            QuestionDomain question = new QuestionDomain();
            question.setQuestion(questions[i]);
            question.setExplain(explain[i]);
            question.setType(QuestionType.KDSQ);  // 적절한 QuestionType 설정
            questionRepository.save(question);
        }
    }

    // 랜덤으로 섞은 후, 15개만 반환 , SDQ는 32개의 문항지가있음
    public GetQuestionResultDto createQuestion(QuestionType type, String userId) {
        UserDomain user = userRepository.findByUserId(userId);
        if(user.getLastTestDate() != null &&!user.getLastTestDate().isBefore(LocalDate.now().minusDays(30))){
            throw new UserException(ErrorCode.TEST_ALREADY_FINISH);
        }
        List<QuestionDomain> findByType =
                questionRepository.findAllByType(type);
        Collections.shuffle(findByType);
        List<GetQuestionDto> result =
                findByType.stream().limit(15).map(GetQuestionDto::fromEntity).toList();
        Map<String,Integer> savaMap = new HashMap<>();
        for(GetQuestionDto dto : result){
            savaMap.put(dto.getQuestion(),0);
        }
        QuestionDomain testSet = new QuestionDomain();
        testSet.setUserId(userId);
        testSet.setTest(savaMap);
        testSet.setTestCreateAt(LocalDate.now());
        user.setLastTestDate(LocalDate.now());
        userRepository.save(user);
        QuestionDomain save = questionRepository.save(testSet);
        return new GetQuestionResultDto(save.getQuestionId(),result);
    }


    public QuestionResultResponse setQuestionAnswer(String testId, Map<String,
            Integer> result) {
        QuestionDomain test = questionRepository.findById(testId)
                .orElseThrow(()-> new UserException(ErrorCode.INVALID_ARGUMENT));
        test.setTest(result);

        int totalScore =
                result.values().stream().mapToInt(Integer::intValue).sum();
        test.setResult(totalScore);
        String comment;
        if (totalScore <= 3) {
            comment =  "훌륭하네요. 인지기능이 건강합니다! ";
        } else if (totalScore <= 5) {
            comment =  "경미한 인지기능의 저하가 보이지만, 괜찮습니다!";
        } else if (totalScore <= 7) {
            comment =  "주의가 필요한 인지기능의 저하가 보입니다. 인지기능 향상을 위해 노력해주세요.";
        } else {
            comment =  "중증 인지기능 저하가 보입니다. 주변 가족, 병원과 상담해보시길 권장드립니다.";
        }
        test.setDescription(comment);
        questionRepository.save(test);

        return new QuestionResultResponse(totalScore,comment);
    }

    public List<GetResultDto> getResultList(String userId) {
        UserDomain user = userRepository.findByUserId(userId);
        List<QuestionDomain> results = new ArrayList<>();
        if(user.getRole().equals("user")){
            results = questionRepository.findAllByUserId(userId);
        }else if(user.getRole().equals("protector")){
            results = questionRepository.findAllByUserId(user.getProtectorId());
        }

        return results.stream()
                .map(GetResultDto::fromEntity)
                .sorted(Comparator.comparing(GetResultDto::getDate).reversed())
                .toList();
    }

    public GetResultDetailDto getResultDetail(String userId, LocalDate date) {
        UserDomain user = userRepository.findByUserId(userId);
        if(user.getRole().equals("user")){
            return GetResultDetailDto.fromEntity(questionRepository.findByUserIdAndTestCreateAt(userId, date)
                    .orElseThrow(()-> new UserException(ErrorCode.INVALID_ARGUMENT)));
        }else if(user.getRole().equals("protector")){
            return GetResultDetailDto.fromEntity(questionRepository.findByUserIdAndTestCreateAt(user.getProtectorId(), date)
                    .orElseThrow(()-> new UserException(ErrorCode.INVALID_ARGUMENT)));
        }else{
            throw new UserException(ErrorCode.INVALID_ARGUMENT);
        }
    }

    public GetUserTestStatusDto getUserStatus(String userId) {
        UserDomain user = userRepository.findByUserId(userId);
        LocalDate now= LocalDate.now();
        if(user.getLastTestDate() == null){
            return new GetUserTestStatusDto(true,0);
        }
        LocalDate lastTestDate = user.getLastTestDate();
        LocalDate eligibleDate = lastTestDate.plusDays(30);
        boolean canTest =
                now.isAfter(eligibleDate) || now.isEqual(eligibleDate);
        if(canTest){
            return new GetUserTestStatusDto(true,0);
        }else{
            int left = (int) ChronoUnit.DAYS.between(now,eligibleDate);
            return new GetUserTestStatusDto(false,left);
        }
    }
}
