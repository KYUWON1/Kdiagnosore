package com.example.test.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PushNotificationRequest {
    private String token;
    private String title;
    private String message;
}
