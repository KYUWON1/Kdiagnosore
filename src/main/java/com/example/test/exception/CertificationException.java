package com.example.test.exception;

import com.example.test.type.ErrorCode;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class CertificationException extends RuntimeException{
    private ErrorCode errorCode;
    // 기본 생성자에 errorCode와 메시지를 전달
    public CertificationException(ErrorCode errorCode) {
        super(errorCode.getDescription());  // RuntimeException의 message 필드 설정
        this.errorCode = errorCode;
    }
}
