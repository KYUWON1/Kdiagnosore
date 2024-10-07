package com.example.test.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Document(collection="test")
@Getter
@Setter
public class TestDomain {
    @Id
    private String testId = UUID.randomUUID().toString(); // 각 채팅에 고유 ID 할당

    private String userId;
    // 주관식 질문
    private String question;
    private String answer; // 사용자 정답
    private String predictAnswer;
    private String reason;
    private String reasonAt;

    // 객관식 질문
    private boolean isGaggwan;
    private Map<Integer,String> gaggawnList;
    private Integer gaggawnAnswer;
    private String gaggawnReason;

    private String date;
    private String time;

    public void setDate(LocalDate date) {
        this.date = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    public void setTime(LocalTime time) {
        this.time = time.format(DateTimeFormatter.ISO_LOCAL_TIME);
    }

    public LocalDate getDate() {
        return LocalDate.parse(this.date, DateTimeFormatter.ISO_LOCAL_DATE);
    }

    public LocalTime getTime() {
        return LocalTime.parse(this.time, DateTimeFormatter.ISO_LOCAL_TIME);
    }
}
