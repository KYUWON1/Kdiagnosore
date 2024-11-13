package com.example.test.controller;

import com.example.test.Service.ChatService;
import com.example.test.Service.UserService;
import com.example.test.dto.ChatDTO;
import com.example.test.dto.ChatForUserDto;
import com.example.test.dto.CustomUserDetails;
import com.example.test.jwt.UserIdHolder;
import com.example.test.type.ChatFrom;
import com.example.test.type.ChatSaveResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.example.test.jwt.UserIdHolder.getUserIdFromToken;

@Controller
@ResponseBody
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    public ChatController(ChatService chatService,UserService userService){
        this.chatService = chatService;
        this.userService = userService;
    }

    @PostMapping()
    public ChatDTO getPrediction(@RequestBody ChatDTO chatDTO) {
        ChatSaveResponse chatResponse = chatService.saveChat(chatDTO);
        ChatDTO answer = chatService.getPrediction(chatDTO);
        if(chatResponse == ChatSaveResponse.SAVE_SUCCESS){
            chatService.saveBotChat(answer);
        }
        return answer;
    }

    @GetMapping("/list")
    public List<ChatForUserDto> getChatList(){
        List<ChatForUserDto> chatList = chatService.getChatList(getUserIdFromToken());
        return chatList;
    }

    @GetMapping("/today")
    public List<ChatForUserDto> getChatListToday(){
        List<ChatForUserDto> chatList =
                chatService.getChatListByDate(getUserIdFromToken(),
                        LocalDate.now().toString());
        return chatList;
    }

    @GetMapping("/list/{date}")
    public List<ChatForUserDto> getChatListByDate(
            @PathVariable String date
    ){
        List<ChatForUserDto> chatList =
                chatService.getChatListByDate(getUserIdFromToken(),date);
        return chatList;
    }

}
