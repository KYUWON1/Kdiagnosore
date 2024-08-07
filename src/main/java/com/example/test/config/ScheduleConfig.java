package com.example.test.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ScheduleConfig {
    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(cron = "0 0 * * * ?") // 주기 설정 코드
    public void scheduleFixedRateTask() {
        String url = "http://localhost:8080/gpt/createTest";
        String response = restTemplate.getForObject(url, String.class);
        System.out.println("Scheduled task executed: " + response);
    }
}
