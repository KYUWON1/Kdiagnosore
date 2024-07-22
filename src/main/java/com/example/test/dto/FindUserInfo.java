package com.example.test.dto;

import lombok.*;

public class FindUserInfo {

    @Getter
    @Setter
    public static class Request{
        private String userName;
        private String phoneNumber;
        private String userId;
        private String email;
        private String certNum;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private String userId;
        private String password;

        public static Response idFrom(UserProfileDTO user){
            return Response.builder()
                    .userId(user.getUserId())
                    .build();
        }

        public static Response passwordFrom(UserProfileDTO user){
            return Response.builder()
                    .userId(user.getUserId())
                    .password(user.getPassword())
                    .build();
        }
    }
}
