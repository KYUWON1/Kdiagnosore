package com.example.test.Service;

import com.example.test.dto.PushNotificationRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

@Service
public class PushNotificationService {

    private static final String EXPO_PUSH_NOTIFICATION_URL = "https://exp.host/--/api/v2/push/send";

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
}
