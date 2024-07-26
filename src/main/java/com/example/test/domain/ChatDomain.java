package com.example.test.domain;

import com.example.test.type.ChatFrom;
import com.example.test.type.ChatType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Document(collection="chat")
@Getter
@Setter
public class ChatDomain {
    @Id
    private String chatId = UUID.randomUUID().toString(); // 각 채팅에 고유 ID 할당

    private String userId;
    private ChatFrom chatFrom;
    private ChatType chatType;
    private String message;

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
