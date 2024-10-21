package com.example.test.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetQuestionResultDto {
    private String testId;
    private List<GetQuestionDto> testList;
}
