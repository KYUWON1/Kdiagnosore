package com.example.test.controller;

import com.example.test.Service.ChatService;
import com.example.test.Service.CognitiveTestService;
import com.example.test.Service.DiaryService;
import com.example.test.Service.UserService;
import com.example.test.dto.GPTRequestDTO;
import com.example.test.dto.GPTResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/gpt")
@Slf4j
public class GptTestController {

    private final ChatService chatService;
    private final CognitiveTestService cognitiveTestService;
    private final UserService userService;
    private final DiaryService diaryService;

    public GptTestController(ChatService chatService, CognitiveTestService cognitiveTestService, UserService userService, DiaryService diaryService){
        this.chatService = chatService;
        this.cognitiveTestService = cognitiveTestService;
        this.userService = userService;
        this.diaryService = diaryService;
    }

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate template;

    // todo : 다른 ID에 대해서도 테스트가 생김
                  
    @GetMapping("/createTest/jugwan")
    public String createTestJugwanByChat(){
        List<String> allUserId = userService.findAllUserId();
        for(String userId : allUserId){
            String chatMessages = chatService.getChatMessage(userId,
                    LocalDate.now().minusDays(0).format(DateTimeFormatter.ISO_LOCAL_DATE));
//            String chatMessages = chatService.getChatMessage(userId,
//                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            if(chatMessages.equals("No Data")){
                continue;
            }
            String prompt = """
                너는 이제부터 일상 정보 기반 질문 생성 AI야.
                모든 문장의 끝에는 @ 를 항상 붙여주고, 줄 바꿈은 하지 말아줘.
                아래는 사용자와 챗봇이 어제 나눈 대화내용이야.
                Date와 Time은 해당 채팅을 입력한 날짜와 시간이야.
                
                """;
            String add = """
                
                위에 대화 내용을 바탕으로 질문과 예상 답변과 근거을 생성해줘.
                질문과 예상 답변 그리고 근거를 생성하는 방법을 차례대로 설명해줄께.
                
                질문은 사용자가 자신이 했던 일을 잘 기억하고 있는지 확인하는 목적이어야해.
                질문은 반드시 제공해준 어제 대화 내용에 관한 질문이여야해.
                질문은 어떤 단어를 대답할 수 있는 형태인 질문이여야해.
                질문에서 "오늘은 어떤가요?" 같은 현재에 대해 묻는 질문은 없어야해.
                질문은 "정답"을 말할 수 있는 질문이야해.
                질문은 "응 맞아" 같은 대답을 하는 질문이 아니야. 
                질문은 사용자가 답변할 수 있는 형태의 질문이여야해.
                질문은 반드시 과거에 대한 질문이여야해.
                질문은 존댓말을 사용해줘.
                ex)"어제 점심엔 무엇을 하셨나요?"
                
                예상 답변은 해당 질문에 대한 예상 답변이야.
                예상 답변은 제공해준 대화 내용을 기반으로 만들어줘.
                예상 답변은 중요한 단어는 들어가되, 가능한 간단하게 만들어줘.
                예상 답변은 사용자가 대답하는 듯한 말투를 사용해줘.
                예상 답변은 전부 반말을 사용해줘.
                ex)"어제 점심엔 머리가 아파서 집에서 쉬었어."
                
                근거는 예상 답변을 생성하게 된 근거가 되는 채팅이야.
                근거는 사용자가 입력한 채팅을 함께 제공해줘.
                근거에는 근거가 발생한 시간을 함께 제공해줘.
                근거가 발생한 시간은 가장 마지막에 작성해줘.
                근거에는 존댓말을 사용하는 친절한 말투로 제공해줘.
                ex)"사용자가 날씨가 더워서 머리가 좀 아프네 라고 언급했습니다. 2024-09-10 17:32:33.673532400"
                
                지금부터는 데이터 제공 방식에 대해서 설명해줄께.
                질문,예상답변,근거의 순으로 총 2개의 세트를 제공해줘.
                Q 질문@
                A 예상답변@
                R 근거@
                데이터 파싱을 위해서 반드시 위에 제공해준 예시처럼 데이터를 전달해줘.
                근거에도 마지막에 @를 붙여줘.
                줄바꿈은 하지 말아줘.
                """;
            prompt += chatMessages + add;
            System.out.println("userId: "+userId);
            System.out.println(prompt);
            GPTRequestDTO request = new GPTRequestDTO(model, prompt);
            GPTResponseDTO response =  template.postForObject(apiURL, request, GPTResponseDTO.class);
            String createdTest = response.getChoices().get(0).getMessage().getContent();
            System.out.println(createdTest);
            chatService.saveTestChat(userId,createdTest);
            log.info("Test Created {}.",userId);
        }

        log.info("Test Created End.");
        return "Create Test Question!";
    }

    @GetMapping("/createTest/gaggwan")
    public String createTestGaggwanByChat(){
        List<String> allUserId = userService.findAllUserId();
        for(String userId : allUserId) {

            String chatMessages = chatService.getChatMessage(userId,
                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
//            String chatMessages = chatService.getChatMessage(userId,
//                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            if (chatMessages.equals("No Data")) {
                continue;
            }
            String prompt = """
                    너는 이제부터 일상 정보 기반 질문 생성 AI야.
                    줄 바꿈은 하지 말아줘.
                    아래는 사용자와 챗봇이 어제 나눈 대화내용이야.

                    Date와 Time은 해당 채팅을 입력한 날짜와 시간이야.
                                    
                    """;
            String add = """
                                    
                    위에 대화 내용을 바탕으로 객관식 문제를 생성해줘.
                    객관식은 사용자가 어제의 일을 잘 기억하고있나 체크하기위한 객관식이야.
                    객관식 문항은 총 4가지로 되어있고, 정답은 오직 하나야.
                    객관식의 문항은 단어로 구성되어야만해.
                    문제가 너무 쉽지 않도록, 정답과 유사성이 있는 단어로 문항을 구성해줘.
                    질문은 반드시 제공해준 어제 대화 내용에 관한 질문이여야해.
                    질문은 반드시 과거에 대한 질문이여야해.
                    사용자가 라는 단어는 사용하지말고 질문해줘.
                    질문을 제공할때 존댓말을 사용해줘.
                    질문의 형태는 공손한 대화형 질문체를 사용해줘.
                                    
                    내가 제공해준 내용을 바탕으로 3개의 객관식 문제를 제공해줘.
                    문제와 문항, 정답 총 3가지를 제공해줘.
                    정답의 이유도 제공해줘.
                    정답의 이유는 제공해준 대화 내용에 근거해야해.
                    추측성 근거는 제시하지말아줘.
                    추측성 문제는 제시하지말아줘.
                                    
                    예시 형태를 제공해줄게.
                    ex)Q 질문입니다! 어제 점심에 무었을 드셨나요?@
                    1 삼겹살@
                    2 라면@
                    3 비빔밥@ 
                    4 소고기@
                    A 4@
                    R 어제 점심에 라면을 드시러 간다고 하셨습니다.@
                                    
                    줄바꿈은 하지 말아줘.
                    Q1,A1 같은 번호는 따로 지정해주지않아도되.
                    데이터를 파싱해서 저장할 수 있도록 예시 형태를 잘 유지해줘.
                                   
                    """;
            prompt += chatMessages + add;
            System.out.println("userId: " + userId);
            System.out.println(prompt);
            GPTRequestDTO request = new GPTRequestDTO(model, prompt);
            GPTResponseDTO response = template.postForObject(apiURL, request, GPTResponseDTO.class);
            String createdTest = response.getChoices().get(0).getMessage().getContent();
            System.out.println(createdTest);
            cognitiveTestService.saveTestGaggwan(userId,createdTest);
        }
        log.info("Test Created End.");
        return "Create Test Question!";
    }

    @GetMapping("/createTestFromDiary/jugwan")
    public String createTestJugwanByDiary(){
        List<String> allUserId = userService.findAllUserId();
        for(String userId : allUserId){
            String prompt = """
                너는 이제부터 일상 정보 기반 질문 생성 AI야.
                모든 문장의 끝에는 @ 를 항상 붙여주고, 줄 바꿈은 하지 말아줘.
                아래는 사용자가 하루동안 있었던 일들을 기록한 텍스트야.
                위의 내용을 바탕으로 질문과 예상 답변과 근거를 생성해줘.
                질문과 예상 답변 그리고 근거를 생성하는 방법을 차례대로 설명해줄게.
                Date와 Time은 해당 채팅을 입력한 날짜와 시간이야.
                
                """;

            String add = """
                
                질문은 사용자가 자신이 했던 일을 잘 기억하고 있는지 확인하는 목적이어야해.
                질문은 반드시 제공해준 어제 기록 내용에 관한 질문이여야해.
                질문은 정확한 단어로 대답할 수 있는 형태인 질문이여야해.
                질문에서 "오늘은 어떤가요?" 같은 현재에 대해 묻는 질문은 없어야해.
                질문은 사용자가 답변할 수 있는 형태의 질문이여야해.
                질문은 반드시 과거 있었던 일에 대한 질문이여야해.
                질문에 느꼈던 감정에 대해서는 묻는 질문은 제외해.
                질문은 존댓말을 사용해줘.
                ex)"어제 점심엔 무엇을 하셨나요?"
                
                예상 답변은 해당 질문에 대한 예상 답변이야.
                예상 답변은 제공해준 기록 내용을 기반으로 만들어줘.
                예상 답변은 중요한 단어는 들어가되, 가능한 간단하게 만들어줘.
                예상 답변은 사용자가 대답하는 듯한 말투를 사용해줘.
                예상 답변은 전부 반말을 사용해줘.
                ex)"어제 점심엔 머리가 아파서 집에서 쉬었어."
                
                근거는 예상 답변을 생성하게 된 근거가 되는 기록 안에 포함된 문장이야.
                근거는 사용자가 이전 기록에 입력한 문장을 함께 제공해줘.
                근거에 몇월 몇일 기록인지 포함시켜 제공해줘.
                근거에는 존댓말을 사용하는 친절한 말투로 제공해줘.
                ex)"사용자가 9월 30일 일기 기록에 "날씨가 더워서 머리가 좀 아프네" 라고 작성했습니다.
                
                지금부터는 데이터 제공 방식에 대해서 설명해줄께.
                질문,예상답변,근거의 순으로 총 2개의 세트를 제공해줘.
                Q 질문@
                A 예상답변@
                R 근거@
                데이터 파싱을 위해서 반드시 위에 제공해준 예시처럼 데이터를 전달해줘.
                근거에도 마지막에 @를 붙여줘.
                줄바꿈은 하지 말아줘.
                """;
            String diaryMessages = diaryService.getYesterdayDiaryData(userId);
//            String chatMessages = chatService.getChatMessage(userId,
//                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            if(diaryMessages.equals("No Data")){
                continue;
            }
//            String chatMessages = """
//                    오늘 아침에는 일어나서 혼자 밥을 먹었다. 조금 외로웠던거 같다. 설거지를 마치고 점심에는 강아지 초코와 함께 산책을 나갔다.
//                    옆집 할머니가 마침 나와계셔서 수다를 떨다가 들어왔다. 저녁에는 나물을 넣어서 비빔밥을 만들어 먹었다. 고추장을 너무 많이 넣어서 맵더라.
//                    밤에는 아들내미가 웬일로 먼저 전화를 했다. 목소리 들으니까 좋더라. 곧 추석때 온다고 하니까 명절음식 많이 해놓아야겠다.
//                    """;
            prompt += diaryMessages + add;
            System.out.println("userId: "+ userId);
            System.out.println(prompt);
            GPTRequestDTO request = new GPTRequestDTO(model, prompt);
            GPTResponseDTO response = template.postForObject(apiURL, request, GPTResponseDTO.class);
            String createdTest = response.getChoices().get(0).getMessage().getContent();
            System.out.println(createdTest);
            // 저장을 시도하고 실패하면 재시도
            boolean saveSuccess = chatService.saveTestChat(userId, createdTest);
            if(!saveSuccess){
                log.info("Test Created Fail..retry {}",userId);

            }
            log.info("Test Created {}.",userId);
        }

        return "Create Test Question!";
    }

    @GetMapping("/createTestFromDiary/gaggwan")
    public String createTestGaggwanByDiary(){
        List<String> allUserId = userService.findAllUserId();
        for(String userId : allUserId){
            String prompt = """
                너는 이제부터 일상 정보 기반 질문 생성 AI야.
                모든 문장의 끝에는 @ 를 항상 붙여주고, 줄 바꿈은 하지 말아줘.
                아래는 사용자가 하루동안 있었던 일들을 기록한 텍스트야.
                위의 내용을 바탕으로 질문과 예상 답변과 근거를 생성해줘.
                질문과 예상 답변 그리고 근거를 생성하는 방법을 차례대로 설명해줄께.
                Date와 Time은 해당 채팅을 입력한 날짜와 시간이야.
                
                """;

            String add = """
                
                위에 대화 내용을 바탕으로 객관식 문제를 생성해줘.
                    객관식은 사용자가 어제의 일을 잘 기억하고있나 체크하기위한 객관식이야.
                    객관식 문항은 총 4가지로 되어있고, 정답은 오직 하나야.
                    객관식의 문항은 단어로 구성되어야만해.
                    문제가 너무 쉽지 않도록, 정답과 유사성이 있는 단어로 문항을 구성해줘.
                    질문은 반드시 제공해준 어제 대화 내용에 관한 질문이여야해.
                    질문은 반드시 과거에 대한 질문이여야해.
                    사용자가 라는 단어는 사용하지말고, 질문해줘.
                    질문을 제공할때 존댓말을 사용해줘.
                    질문의 형태는 공손한 대화형 질문체를 사용해줘.
                                    
                    내가 제공해준 내용을 바탕으로 3개의 객관식 문제를 제공해줘.
                    문제와 문항, 정답 총 3가지를 제공해줘.
                    정답의 이유도 제공해줘.
                    정답의 이유는 제공해준 대화내용에 근거해야해.
                    추측성 근거는 제시하지말아줘.
                                    
                    예시 형태를 제공해줄게.
                    ex)질문: 질문입니다! 어제 점심에 무었을 드셨나요?@
                    1. 삼겹살 2. 라면 3. 비빔밥 4. 소고기@
                    정답 : 4@
                    이유 : 어제 점심에 라면을 드시러 간다고 하셨습니다.@
                                    
                    데이터를 파싱해서 저장할 수 있도록 예시 형태를 잘 유지해줘.
                """;
            String diaryMessages = diaryService.getYesterdayDiaryData(userId);
//            String chatMessages = chatService.getChatMessage(userId,
//                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            if(diaryMessages.equals("No Data")){
                continue;
            }
//            String chatMessages = """
//                    오늘 아침에는 일어나서 혼자 밥을 먹었다. 조금 외로웠던거 같다. 설거지를 마치고 점심에는 강아지 초코와 함께 산책을 나갔다.
//                    옆집 할머니가 마침 나와계셔서 수다를 떨다가 들어왔다. 저녁에는 나물을 넣어서 비빔밥을 만들어 먹었다. 고추장을 너무 많이 넣어서 맵더라.
//                    밤에는 아들내미가 웬일로 먼저 전화를 했다. 목소리 들으니까 좋더라. 곧 추석때 온다고 하니까 명절음식 많이 해놓아야겠다.
//                    """;
            prompt += diaryMessages + add;
            System.out.println("userId: "+ userId);
            System.out.println(prompt);
            GPTRequestDTO request = new GPTRequestDTO(model, prompt);
            GPTResponseDTO response = template.postForObject(apiURL, request, GPTResponseDTO.class);
            String createdTest = response.getChoices().get(0).getMessage().getContent();
            System.out.println(createdTest);
            cognitiveTestService.saveTestGaggwan(userId,createdTest);
            log.info("Test Created {}.",userId);
        }

        log.info("Test Created End.");
        return "Create Test Question!";
    }
}
