package com.example.test.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

public class UserExist {
    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private String userName;
        private String phoneNumber;
    }

}
