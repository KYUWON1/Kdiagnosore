package com.example.test.dto;

import com.example.test.type.BaseResponse;
import lombok.*;
import org.jetbrains.annotations.NotNull;

public class ResetPassword {
    @Getter
    @Setter
    public static class Request{
        @NotNull
        private String password;
        @NotNull
        private String passwordCheck;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String description;
        private BaseResponse baseResponse;

        public static Response from(DefaultDTO data){
            return Response.builder()
                    .description(data.getDescription())
                    .baseResponse(data.getBaseResponse())
                    .build();
        }
    }
}
