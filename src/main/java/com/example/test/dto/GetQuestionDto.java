package com.example.test.dto;

import com.example.test.domain.QuestionDomain;
import com.example.test.type.QuestionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetQuestionDto {
    private String story;
    private String question;

    public static GetQuestionDto fromEntity(QuestionDomain data){
        return GetQuestionDto.builder()
                .story(data.getExplain())
                .question(data.getQuestion())
                .build();
    }
}
