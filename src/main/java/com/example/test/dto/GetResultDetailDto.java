package com.example.test.dto;

import com.example.test.domain.QuestionDomain;
import lombok.*;

import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetResultDetailDto {
    private String userId;
    private LocalDate testCreateAt;
    private Map<String,Integer> test;
    private Integer result;
    private String description;

    public static GetResultDetailDto fromEntity(QuestionDomain data){
        return new GetResultDetailDto(data.getUserId(),data.getTestCreateAt()
                ,data.getTest(), data.getResult(),data.getDescription());
    }
}
