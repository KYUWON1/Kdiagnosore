package com.example.test.domain;

import com.example.test.type.QuestionType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Document(collection = "question")
@Setter
@Getter
public class QuestionDomain {
    @Id
    private String questionId = UUID.randomUUID().toString();
    private String story;
    private String question;
    private QuestionType type;

    // 생성된 인지기능 질문
    private String userId;
    private LocalDate testCreateAt;
    private Map<String,Integer> test;
    private Integer result;
    private String description;

}
