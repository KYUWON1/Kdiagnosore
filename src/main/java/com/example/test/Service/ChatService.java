package com.example.test.Service;

import com.example.test.domain.ChatDomain;
import com.example.test.domain.TestDomain;
import com.example.test.dto.ChatDTO;
import com.example.test.dto.ChatForUserDto;
import com.example.test.dto.CustomUserDetails;
import com.example.test.exception.UserException;
import com.example.test.repository.ChatRepository;
import com.example.test.repository.TestRepository;
import com.example.test.repository.UserRepository;
import com.example.test.response.PredictResponse;
import com.example.test.type.ChatFrom;
import com.example.test.type.ChatSaveResponse;
import com.example.test.type.ChatType;
import com.example.test.type.ErrorCode;
import jakarta.annotation.PostConstruct;
import org.apache.commons.text.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final RestTemplate restTemplate;
    @Value("${server.address.flask}")
    private String serverAddress;
    private String PREDICTION_URL;
    private final TestRepository testRepository;

    public ChatService(ChatRepository chatRepository, RestTemplate chatRestTemplate, TestRepository testRepository){
        this.chatRepository = chatRepository;
        this.restTemplate = chatRestTemplate;
        this.testRepository = testRepository;
    }

    @PostConstruct
    public void init() {
        // PREDICTION_URL을 @PostConstruct로 초기화
        PREDICTION_URL = "http://" + serverAddress + ":5000/api/predict";
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

        Map<LocalDate,ChatDomain> lastCharPerDate = chatList.stream()
                .collect(Collectors.groupingBy(
                        chatDomain -> chatDomain.getDate(),
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparing(ChatDomain::getTime)),
                                Optional::get
                        )
                ));

        return lastCharPerDate.values().stream()
                .sorted(Comparator.comparing(ChatDomain::getDate))
                .map(ChatForUserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ChatForUserDto> getChatListByDate(String userId,String date) {
        List<ChatDomain> chatList = chatRepository.findByUserIdAndDate(userId
                ,date);
        if(chatList.isEmpty()){
            throw new UserException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        return chatList.stream()
                .map(ChatForUserDto::fromEntity)
                .collect(Collectors.toList());
    }

    public String getChatMessage(String userId, String date) {
        List<ChatDTO> chatList = getChatsByUserIdAndDate(userId, date);
        if(chatList.isEmpty()){
            return "No Data";
        }

        String chatMessages = "";
        for(ChatDTO chat : chatList){

            if(chat.getChatFrom() == ChatFrom.CHAT_BOT){
                chatMessages += "챗봇 : " + chat.getMessage() + "\n";
                chatMessages += "Date :" + chat.getDate() + "\n";
                chatMessages += "Time :" + chat.getTime() + "\n";
            }
            else{
                chatMessages += "사용자 : " + chat.getMessage() + "\n";
                chatMessages += "Date :" + chat.getDate() + "\n";
                chatMessages += "Time :" + chat.getTime() + "\n";
            }
        }
        return chatMessages;
    }

    public void saveTestChat(String userId, String test) {
        parsingCreatedTestAndSave(userId, test);
    }

    public void saveTestChatByDiary(String userId, String test) {
        parsingCreatedTestAndSaveByDiary(userId, test);
    }


    private void parsingCreatedTestAndSave(String userId, String test) {
        // 패턴에서 timeStamp를 따로 그룹화하여 추출
        Pattern pattern = Pattern.compile("Q (.*?)@\\s*A (.*?)@\\s*R (.*?)\\s*(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d+)@");
        Matcher matcher = pattern.matcher(test);

        while (matcher.find()) {
            System.out.println("매칭성공");
            String question = matcher.group(1);
            System.out.println("question = " + question);
            String predictAnswer = matcher.group(2);
            System.out.println("predictAnswer = " + predictAnswer);
            String reason = matcher.group(3);
            System.out.println("reason = " + reason);
            String timeStamp = matcher.group(4);
            System.out.println("timeStamp = " + timeStamp);

            TestDomain newTest = setTestContent(userId, question, predictAnswer, reason, timeStamp);
            newTest.setDate(LocalDate.now());
            newTest.setTime(LocalTime.now());
            newTest.setGaggwan(false);

            testRepository.save(newTest);
            System.out.println(userId + " jugwan save");
        }
    }

    private void parsingCreatedTestAndSaveByDiary(String userId, String test) {
        Pattern pattern = Pattern.compile("Q (.*?)@\\s*A (.*?)@\\s*R (.*?)" +
                "@\\s*");
        Matcher matcher = pattern.matcher(test);

        while (matcher.find()) {
            System.out.println("매칭성공");
            String question = matcher.group(1).trim();
            System.out.println("question = " + question);
            String predictAnswer = matcher.group(2).trim();
            System.out.println("predictAnswer = " + predictAnswer);
            String reason = matcher.group(3).trim();
            System.out.println("reason = " + reason);

            TestDomain newTest = setTestContent(userId, question, predictAnswer, reason);
            newTest.setDate(LocalDate.now());
            newTest.setTime(LocalTime.now());
            newTest.setGaggwan(false);


            testRepository.save(newTest);
            System.out.println(userId + "jugwan save");
        }

        // 파싱이 완료되었으나 매칭되지 않을 경우 로그 출력
        if (!matcher.find()) {
            System.out.println("매칭되지 않았습니다. 입력된 데이터 형식을 확인해주세요.");
        }
    }

    public TestDomain setTestContent(String userId,String question,
                                     String predictAnswer,String reason,
                                     String timeStamp){
        TestDomain testDomain = new TestDomain();
        testDomain.setUserId(userId);
        testDomain.setQuestion(question);
        testDomain.setPredictAnswer(predictAnswer);
        testDomain.setReason(reason);
        testDomain.setReasonAt(timeStamp);
        testDomain.setDate(LocalDate.now());
        testDomain.setTime(LocalTime.now());
        return testDomain;
    }

    public TestDomain setTestContent(String userId,String question,
                                     String predictAnswer,String reason){
        TestDomain testDomain = new TestDomain();
        testDomain.setUserId(userId);
        testDomain.setQuestion(question);
        testDomain.setPredictAnswer(predictAnswer);
        testDomain.setReason(reason);
        testDomain.setDate(LocalDate.now());
        testDomain.setTime(LocalTime.now());
        return testDomain;
    }
}

