package com.example.test.exception;

import com.example.test.type.ErrorCode;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CertificationException extends RuntimeException{
    private ErrorCode errorCode;
    private String errorMessage;

    public CertificationException(ErrorCode errorCode){
        this.errorCode = errorCode;
        this.errorMessage = errorCode.getDescription();
    }
}
