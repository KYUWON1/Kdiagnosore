package com.example.test.Service;

import com.example.test.domain.ChatDomain;
import com.example.test.dto.ChatDTO;
import com.example.test.dto.CustomUserDetails;
import com.example.test.repository.ChatRepository;
import com.example.test.response.PredictResponse;
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
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.sql.Time;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final RestTemplate restTemplate;

    public ChatService(ChatRepository chatRepository,RestTemplate chatRestTemplate){
        this.chatRepository = chatRepository;
        this.restTemplate = chatRestTemplate;
    }

    public ChatDTO getPrediction(ChatDTO chatDTO) {
        //요청 전송
        String url = "http://localhost:5000/api/predict";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("application/json; charset=UTF-8"));

        String jsonBody = "{\"question\": \"" + chatDTO.getMessage() + "\"}";
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        //요청 처리 
        ResponseEntity<PredictResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, PredictResponse.class);
        String answer = response.getBody().getAnswer(); // JSON 응답에서 "answer" 필드 추출
        String decodedResponse = StringEscapeUtils.unescapeJava(answer);
        chatDTO.setMessage(decodedResponse);

        return chatDTO;
    }

    public ChatDTO saveChat(ChatDTO chatDto){
        if(!StringUtils.hasText(chatDto.getMessage())){
            throw new IllegalArgumentException("메세지를 입력해주세요");
        }
        // 토큰으로부터 유저 이름 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String userId = userDetails.getUsername();


        ChatDomain chatDomain = new ChatDomain();
        chatDomain.setUserId(userId);
        chatDomain.setChatFrom(chatDto.getChatFrom());
        chatDomain.setChatType(chatDto.getChatType());
        chatDomain.setMessage(chatDomain.getMessage());
        chatDomain.setDate(new Date(System.currentTimeMillis()));
        chatDomain.setTime(new Time(System.currentTimeMillis()));

        chatRepository.save(chatDomain);

        return chatDto;
    }
}
