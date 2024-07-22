package com.example.test.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND("사용자가 없습니다."),
    VERIFY_CODE_NOT_MATCH("인증코드가 옳바르지 않습니다");
    private final String description;
}
