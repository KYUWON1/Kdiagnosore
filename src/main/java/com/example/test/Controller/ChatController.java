package com.example.test.Controller;

import com.example.test.Service.ChatService;
import com.example.test.dto.ChatDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService){
        this.chatService = chatService;
    }

    @PostMapping("/sendchat")
    public ResponseEntity<?> postChatting(ChatDTO chatDTO){
        // 메세지 보내는사람 메세지타입 받아야함
        ChatDTO data = chatService.saveChat(chatDTO);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/chat/question")
    public ChatDTO getPrediction(@RequestBody ChatDTO chatDTO) {
        System.out.println(chatDTO);
        return chatService.getPrediction(chatDTO);
    }
}
