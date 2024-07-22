package com.example.test.dto;

import lombok.*;



public class SmsSend {
    @Getter
    @Setter
    public static class Request {
        private String phoneNumber;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String phoneNumber;
        private String certNumber;
    }
}
