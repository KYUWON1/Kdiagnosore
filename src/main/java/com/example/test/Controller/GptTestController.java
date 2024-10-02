package com.example.test.Controller;

import com.example.test.Service.ChatService;
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
    private final UserService userService;

    public GptTestController(ChatService chatService, UserService userService){
        this.chatService = chatService;
        this.userService = userService;
    }

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate template;

    // todo : 다른 ID에 대해서도 테스트가 생김
                  
    @GetMapping("/createTest")
    public String chat(){
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
        List<String> allUserId = userService.findAllUserId();
        for(String userId : allUserId){
            String chatMessages = chatService.getChatMessage(userId,
                    LocalDate.now().minusDays(0).format(DateTimeFormatter.ISO_LOCAL_DATE));
//            String chatMessages = chatService.getChatMessage(userId,
//                    LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            if(chatMessages.equals("No Data")){
                continue;
            }
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
}
