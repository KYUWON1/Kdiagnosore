package com.example.test.Service;

import com.example.test.domain.ExpoTokenDomain;
import com.example.test.domain.TestDomain;
import com.example.test.domain.UserDomain;
import com.example.test.dto.PushNotificationRequest;
import com.example.test.exception.UserException;
import com.example.test.repository.PushTokenRepository;
import com.example.test.repository.TestRepository;
import com.example.test.repository.UserRepository;
import com.example.test.type.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {

    private static final String EXPO_PUSH_NOTIFICATION_URL = "https://exp.host/--/api/v2/push/send";
    private final PushTokenRepository pushTokenRepository;
    private final TestRepository testRepository;
    private final UserRepository userRepository;

    @Scheduled(cron = "0 * * * * *") // 매 분마다 실행
    public void checkAndSendNotification(){
        String currentTime = LocalTime.now().toString().substring(0,5);
        List<UserDomain> PushUserList =
                userRepository.findByAlarmTime(currentTime);
        System.out.println(currentTime);
        for(UserDomain user : PushUserList){
            String userId = user.getUserId();
            ExpoTokenDomain byId =
                    pushTokenRepository.findById(userId).orElseThrow(
                            ()-> new UserException(ErrorCode.USER_NOT_FOUND)
                    );
            System.out.println(byId.getPushToken());
            if(byId.getPushToken() != null){
                log.info("Send PushAlarm to {}",userId);
                List<TestDomain> test =
                        testRepository.findByUserIdAndDate(userId,
                        LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
                sendPushNotification(PushNotificationRequest.builder()
                        .title("오늘의 질문")
                        .message(test.get(0).getQuestion())
                        .token(byId.getPushToken())
                        .build());
            }
        }
    }

    public void sendPushNotification(PushNotificationRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            // 알림 전송을 위한 요청 본문 생성
            var payload = new HashMap<String, Object>();
            payload.put("to", request.getToken());
            payload.put("title", request.getTitle());
            payload.put("body", request.getMessage());
            payload.put("sound", "default");

            // 알림 전송
            var response = restTemplate.postForObject(EXPO_PUSH_NOTIFICATION_URL, payload, String.class);
            System.out.println("Push notification response: " + response);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error sending push notification: " + e.getMessage());
        }
    }

    public void savePushToken(String userId, String pushToken) {
        Optional<ExpoTokenDomain> user = pushTokenRepository.findById(userId);
        if(user.isEmpty()){
            ExpoTokenDomain data = new ExpoTokenDomain();
            data.setUserId(userId);
            data.setPushToken(pushToken);
            pushTokenRepository.save(data);
        }else{
            user.get().setPushToken(pushToken);
            pushTokenRepository.save(user.get());
        }

    }
}
