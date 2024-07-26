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
    private LocalDate date;
    private LocalTime time;
    private String _class;

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
