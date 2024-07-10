package com.example.test.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatDTO {
    private String userId;
    private String message;
    private String chatFrom;
    private String chatType;
}