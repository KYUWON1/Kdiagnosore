package com.example.test.domain;

import com.example.test.type.ChatFrom;
import com.example.test.type.ChatType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Document(collection="test")
@Getter
@Setter
public class TestDomain {
    @Id
    private String testId = UUID.randomUUID().toString(); // 각 채팅에 고유 ID 할당

    private String userId;
    private String question;

    private String answer;
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
