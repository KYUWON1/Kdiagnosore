package com.example.test.controller;

import com.example.test.Service.ChatService;
import com.example.test.Service.UserService;
import com.example.test.dto.ChatDTO;
import com.example.test.dto.ChatForUserDto;
import com.example.test.dto.CustomUserDetails;
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

    @GetMapping("/chat")
    public List<ChatDTO> getChatsByUserId(@RequestParam String userId,
                                          @RequestParam String date) {
        return chatService.getChatsByUserIdAndDate(userId, date);
    }

    @GetMapping("/chat/getlist")
    public List<ChatForUserDto> getChatList(){
        List<ChatForUserDto> chatList = chatService.getChatList(getUserIdFromToken());
        return chatList;
    }

    @GetMapping("/chat/today")
    public List<ChatForUserDto> getChatListToday(){
        List<ChatForUserDto> chatList =
                chatService.getChatListByDate(getUserIdFromToken(),
                        LocalDate.now().toString());
        return chatList;
    }

    @GetMapping("/chat/getlist/{date}")
    public List<ChatForUserDto> getChatListByDate(
            @PathVariable String date
    ){
        List<ChatForUserDto> chatList =
                chatService.getChatListByDate(getUserIdFromToken(),date);
        return chatList;
    }


    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
    }

    // 결과 test용 api
    @GetMapping("/chat/createTest")
    public String getNewTest() {
        List<ChatDTO> chatList = chatService.getChatsByUserIdAndDate("admin2", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));

        String chatMessages = "";
        for(ChatDTO chat : chatList){
            if(chat.getChatFrom() == ChatFrom.CHAT_BOT){
                chatMessages += "A : " + chat.getMessage() + "\n";
            }
            else{
                chatMessages += "B : " + chat.getMessage() + "\n";
            }
        }
        return chatMessages;
    }
}
