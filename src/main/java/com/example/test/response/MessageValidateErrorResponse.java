package com.example.test.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class MessageValidateErrorResponse {
    public String errorCode;
    public String message;
}
