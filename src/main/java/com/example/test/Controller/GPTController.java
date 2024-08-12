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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/gpt")
@Slf4j
public class GPTController {

    private final ChatService chatService;
    private final UserService userService;

    public GPTController(ChatService chatService, UserService userService){
        this.chatService = chatService;
        this.userService = userService;
    }

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate template;

    @GetMapping("/createTest")
    public String chat(){
        String prompt = """
                너는 이제부터 일상 정보 기반 질문 생성 AI야.
                내가 아래에 보여주는 데이터는 어제의 채팅 데이터인데 B의 답변을 기반으로 참과 거짓을 판별할 수 있는 질문을 만들면 돼.
                오직 B의 답변 내용만으로 참거짓을 판단할 수 있어야 해.
                
                """;
        String add = """
                
                예시처럼 B가 자신이 했던 일을 잘 기억하고 있는지 확인하는 목적의 질문이야.
                B에게 있었던 일에 대해서 물어보는 듯한 질문을 하나 만들어줘. 말투는 존댓말이야
                
                예시) 어제 오후에는 어디 가셨다고 하셨죠?
                """;
        String chatMessages = chatService.getChatMessage(chatService.getUserId(), LocalDate.now().minusDays(13).format(DateTimeFormatter.ISO_LOCAL_DATE));
        prompt += chatMessages + add;
        GPTRequestDTO request = new GPTRequestDTO(model, prompt);
        GPTResponseDTO response =  template.postForObject(apiURL, request, GPTResponseDTO.class);
        String createdTest = response.getChoices().get(0).getMessage().getContent();
        chatService.saveTestChat(createdTest);
        return createdTest;
    }
}
