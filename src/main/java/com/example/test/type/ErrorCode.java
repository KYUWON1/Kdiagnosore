package com.example.test.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND("사용자가 없습니다."),
    VERIFY_CODE_NOT_MATCH("인증코드가 옳바르지 않습니다"),
    PASSWORD_CHECK_UN_MATCH("설정하실 비밀번호를 한번 더 확인해주세요"),
    PASSWORD_UN_MATCH("비밀번호가 잘못되었습니다."),
    USER_NOT_MATCH("사용자가 일치하지 않습니다."),
    ALARM_EMPTY("알람이 존재하지않습니다");
    private final String description;
}
