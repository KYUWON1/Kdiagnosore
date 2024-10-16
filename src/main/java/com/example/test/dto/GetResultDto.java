package com.example.test.dto;

import com.example.test.domain.QuestionDomain;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class GetResultDto {
    private Integer totalScore;
    private LocalDate date;

    public static GetResultDto fromEntity(QuestionDomain data){
        return new GetResultDto(data.getResult(), data.getTestCreateAt());
    }
}
