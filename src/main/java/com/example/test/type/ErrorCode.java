package com.example.test.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND("사용자가 없습니다."),
    VERIFY_CODE_NOT_MATCH("인증코드가 옳바르지 않습니다"),
    PASSWORD_CHECK_UN_MATCH("설정하실 비밀번호를 한번더 확인해주세요");
    private final String description;
}
