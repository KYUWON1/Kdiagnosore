package com.example.test.Service;

import com.example.test.domain.ChatDomain;
import com.example.test.dto.ChatDTO;
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
        String jsonBody = "{\"question\": \"" + chatDTO.getMessage() + "\"}";
        PredictResponse response = sendRequest(PREDICTION_URL,jsonBody); // JSON 응답에서 "answer" 필드 추출
        String decodedResponse = StringEscapeUtils.unescapeJava(response.getAnswer());
        chatDTO.setMessage(decodedResponse);
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
        chatDomain.setChatFrom(ChatFrom.CHAT_BOT);
        chatDomain.setChatType(ChatType.NORMAL);
        chatDomain.setMessage(message);
        chatDomain.setDate(new Date(System.currentTimeMillis()));
        chatDomain.setTime(new Time(System.currentTimeMillis()));
        return chatDomain;
    }

    public String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return userDetails.getUsername();
    }

    public void validateMessage(String message){
        if(!StringUtils.hasText(message)){
            throw new IllegalArgumentException("메세지를 입력해주세요");
        }
    }
}
