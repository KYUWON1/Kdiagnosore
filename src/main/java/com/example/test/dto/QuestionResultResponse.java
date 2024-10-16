package com.example.test.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionResultResponse {
    private Integer totalScore;
    private String description;
}
