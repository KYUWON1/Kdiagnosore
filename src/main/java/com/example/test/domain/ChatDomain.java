package com.example.test.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.sql.Date;
import java.sql.Time;

@Document(collection="chat")
@Getter
@Setter
public class ChatDomain {
    @Id
    private String userId;

    // user, chatbot
    private String chatFrom;
    // normal, test, answer
    private String chatType;

    private String message;

    @Field("chat_number")
    private int chatNum;
    private Date date;
    private Time time;

    @Transient
    private static int sequence;

    public ChatDomain(){
        this.chatNum = getNextSequence();
    }

    public static synchronized int getNextSequence(){
        return ++sequence;
    }

}
