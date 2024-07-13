package com.example.test.Controller;

import com.example.test.Service.ChatService;
import com.example.test.Service.UserService;
import com.example.test.dto.ChatDTO;
import com.example.test.type.ChatSaveResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    public ChatController(ChatService chatService,UserService userService){
        this.chatService = chatService;
        this.userService = userService;
    }

    @PostMapping("/sendchat")
    public ResponseEntity<?> postChatting(ChatDTO chatDTO){
        // 메세지 보내는사람 메세지타입 받아야함
        ChatSaveResponse response = chatService.saveChat(chatDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat/question")
    public ChatDTO getPrediction(@RequestBody ChatDTO chatDTO) {
        ChatSaveResponse chatResponse = chatService.saveChat(chatDTO);
        ChatDTO answer = chatService.getPrediction(chatDTO);
        if(chatResponse == ChatSaveResponse.SAVE_SUCCESS){
            chatService.saveBotChat(answer);
        }
        return answer;
    }

    @GetMapping("/chat/{userId}")
    public List<ChatDTO> getChatsByUserId(@PathVariable String userId) {
        return chatService.getChatsByUserId(userId);
    }
}
