package com.example.test.exception;

import com.example.test.dto.ErrorResponse;
import com.example.test.type.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AlarmException.class)
    public ResponseEntity<ErrorResponse> handleAlarmException(AlarmException e) {
        log.error("AlarmException exception {} is occurred.", e.getMessage(), e);
        ErrorResponse response = new ErrorResponse(
                e.getErrorCode(),  // ErrorCode Enum 값 설정
                e.getMessage()  // 커스텀 메시지
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(JoinException.class)
    public ResponseEntity<ErrorResponse> handleJoinException(JoinException e) {
        log.error("JoinException exception {} is occurred.", e.getMessage(), e);
        ErrorResponse response = new ErrorResponse(
                e.getErrorCode(),  // ErrorCode Enum 값 설정
                e.getMessage()  // 커스텀 메시지
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorResponse> handleUserException(UserException e) {
        log.error("UserException exception {} is occurred.", e.getMessage(), e);
        ErrorResponse response = new ErrorResponse(
                e.getErrorCode(),  // UserException에 정의된 ErrorCode 사용
                e.getMessage()  // 사용자 정의 메시지
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(VerifyException.class)
    public ResponseEntity<ErrorResponse> handleVerifyException(VerifyException e) {
        log.error("VerifyException exception {} is occurred.", e.getMessage(), e);
        ErrorResponse response = new ErrorResponse(
                e.getErrorCode(),  // VerifyException에 정의된 ErrorCode 사용
                e.getMessage()  // 사용자 정의 메시지
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 모든 예외에 대한 최종 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Exception is occurred.", e);
        ErrorResponse response = new ErrorResponse(
                ErrorCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR.getDescription()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
