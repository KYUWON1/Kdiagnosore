package com.example.test.domain;

import com.example.test.type.ChatFrom;
import com.example.test.type.ChatType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
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

    private LocalDate date;
    private LocalTime time;
}
