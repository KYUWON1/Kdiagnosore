package com.example.test.dto;

import com.example.test.type.BaseResponse;
import lombok.*;

public class ProfileUpdate {
    @Getter
    @Setter
    public static class Request{
        private String userName;
        private String userId;
        private String protectorName;
        private String protectorNumber;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        public String userId;
        public String description;
        public BaseResponse status;
    }
}