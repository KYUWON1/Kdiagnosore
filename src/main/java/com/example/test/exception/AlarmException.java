package com.example.test.exception;

import com.example.test.type.ErrorCode;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class AlarmException extends RuntimeException{
    private ErrorCode errorCode;
    // 기본 생성자에 errorCode와 메시지를 전달
    public AlarmException(ErrorCode errorCode) {
        super(errorCode.getDescription());  // RuntimeException의 message 필드 설정
        this.errorCode = errorCode;
    }
}
