package com.example.test.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ScheduleConfig {
    private final RestTemplate restTemplate = new RestTemplate();

    //@Scheduled(cron = "0 * * * * *") // 매 분마다 실행
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정에 실행
    public void scheduleFixedRateTask() {
        String url = "http://localhost:8080/gpt/createTest";
        String response = restTemplate.getForObject(url, String.class);
        System.out.println("Scheduled task executed: " + response);
    }

}
