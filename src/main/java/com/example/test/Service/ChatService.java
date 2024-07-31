package com.example.test.Service;

import com.example.test.domain.ChatDomain;
import com.example.test.dto.ChatDTO;
import com.example.test.dto.ChatForUserDto;
import com.example.test.dto.CustomUserDetails;
import com.example.test.repository.ChatRepository;
import com.example.test.response.PredictResponse;
import com.example.test.type.ChatFrom;
import com.example.test.type.ChatSaveResponse;
import com.example.test.type.ChatType;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final RestTemplate restTemplate;
    private final String PREDICTION_URL = "http://localhost:5000/api/predict";

    public ChatService(ChatRepository chatRepository,RestTemplate chatRestTemplate){
        this.chatRepository = chatRepository;
        this.restTemplate = chatRestTemplate;
    }

    public PredictResponse sendRequest(String url,String jsonBody){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("application/json; charset=UTF-8"));
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
        //요청 처리
        ResponseEntity<PredictResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, PredictResponse.class);
        return response.getBody();
    }

    public ChatDTO getPrediction(ChatDTO chatDTO) {
        validateMessage(chatDTO.getMessage());

        String jsonBody = "{\"question\": \"" + chatDTO.getMessage() + "\"}";
        PredictResponse response = sendRequest(PREDICTION_URL,jsonBody); // JSON 응답에서 "answer" 필드 추출
        String decodedResponse = StringEscapeUtils.unescapeJava(response.getAnswer());
        chatDTO = setChatDtoContent(decodedResponse);
        return chatDTO;
    }

    public ChatSaveResponse saveChat(ChatDTO chatDto){
        try{
            validateMessage(chatDto.getMessage());
            String userId = getUserId();
            ChatDomain chatDomain = setChatContent(userId, chatDto.getMessage(), ChatFrom.USER, ChatType.NORMAL);
            chatRepository.save(chatDomain);
            return ChatSaveResponse.SAVE_SUCCESS;
        }catch (Exception e){
            return ChatSaveResponse.SAVE_FAIL;
        }
    }

    public ChatSaveResponse saveBotChat(ChatDTO chatDto){
        try{
            validateMessage(chatDto.getMessage());
            String userId = getUserId();
            ChatDomain chatDomain = setChatContent(userId, chatDto.getMessage(), ChatFrom.CHAT_BOT, ChatType.NORMAL);
            chatRepository.save(chatDomain);
            return ChatSaveResponse.SAVE_SUCCESS;
        }catch (Exception e){
            return ChatSaveResponse.SAVE_FAIL;
        }

    }

    public ChatDomain setChatContent(String userId,String message, ChatFrom chatFrom,ChatType chatType){
        ChatDomain chatDomain = new ChatDomain();
        chatDomain.setUserId(userId);
        chatDomain.setChatFrom(chatFrom);
        chatDomain.setChatType(chatType);
        chatDomain.setMessage(message);
        chatDomain.setDate(LocalDate.now());
        chatDomain.setTime(LocalTime.now());
        return chatDomain;
    }

    public ChatDTO setChatDtoContent(String message){
        ChatDTO chatDTO = new ChatDTO();
        String userId = getUserId();
        chatDTO.setUserId(userId);
        chatDTO.setChatFrom(ChatFrom.CHAT_BOT);
        chatDTO.setChatType(ChatType.NORMAL);
        chatDTO.setMessage(message);
        chatDTO.setDate(LocalDate.now());
        chatDTO.setTime(LocalTime.now());
        return chatDTO;
    }

    public String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
            return userDetails.getUsername();
        } else if (principal instanceof String) {
            return (String) principal;
        } else {
            throw new IllegalStateException("Unexpected principal type: " + principal.getClass().getName());
        }
    }

    public void validateMessage(String message){
        if(!StringUtils.hasText(message)){
            throw new IllegalArgumentException("메세지를 입력해주세요");
        }
    }

    public List<ChatDTO> getChatsByUserId(String userId) {
        List<ChatDomain> chatList = chatRepository.findByUserId(userId);
        return chatList.stream()
                .map(chat -> ChatDTO.fromEntity(chat))
                .collect(Collectors.toList());

    }

    public List<ChatDTO> getChatsByUserIdAndDate(String userId, String date) {
        List<ChatDomain> chatList = chatRepository.findByUserIdAndDate(userId, date);
        return chatList.stream()
                .map(chat -> ChatDTO.fromEntity(chat))
                .collect(Collectors.toList());
    }

    public List<ChatForUserDto> getChatList(String userId) {
        List<ChatDomain> chatList = chatRepository.findByUserId(userId);

        return chatList.stream()
                .map(chat -> ChatForUserDto.fromEntity(chat))
                .collect(Collectors.toList());
    }

    public String getChatMessage(String userId, String date) {
        List<ChatDTO> chatList = getChatsByUserIdAndDate(userId, date);
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
