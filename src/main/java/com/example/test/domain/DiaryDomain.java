package com.example.test.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.UUID;

@Document(collection = "diary")
@Getter
@Setter
public class DiaryDomain {
    @Id
    private String diaryId = UUID.randomUUID().toString();

    private String userId;
    private String content;
    private LocalDate date;
}
