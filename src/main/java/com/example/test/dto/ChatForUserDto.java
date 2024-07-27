package com.example.test.dto;

import com.example.test.domain.ChatDomain;
import com.example.test.type.ChatFrom;
import com.example.test.type.ChatType;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatForUserDto {
    private String userId;
    private String message;
    private ChatFrom chatFrom;
    private ChatType chatType;
    private String date;
    private String time;

    public static ChatForUserDto fromEntity(ChatDomain chat){
        return ChatForUserDto.builder()
                .userId(chat.getUserId())
                .message(chat.getMessage())
                .chatFrom(chat.getChatFrom())
                .chatType(chat.getChatType())
                .date(String.valueOf(chat.getDate()))
                .time(String.valueOf(chat.getTime()))
                .build();
    }
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
