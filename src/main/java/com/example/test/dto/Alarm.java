package com.example.test.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Alarm {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Request{
        private String userId;
        private String time;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response{
        private String userId;
        private String time;
    }
}
