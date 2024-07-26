package com.example.test.dto;

import com.example.test.type.ChatFrom;
import com.example.test.type.ChatType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Getter
@Setter
@Document(collection = "chat")
public class ChatDTO {
    @Id
    private String id;
    private String userId;
    private String message;
    private ChatFrom chatFrom;
    private ChatType chatType;
    private String date;
    private String time;
    private String _class;

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

    @Override
    public String toString() {
        return "ChatDTO{" +
                "userId='" + userId + '\'' +
                ", message='" + message + '\'' +
                ", chatFrom='" + chatFrom + '\'' +
                ", chatType='" + chatType + '\'' +
                '}';
    }
}
