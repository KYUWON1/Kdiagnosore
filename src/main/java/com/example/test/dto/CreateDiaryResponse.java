package com.example.test.dto;

import com.example.test.domain.DiaryDomain;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class CreateDiaryResponse {
    private String diaryId;
    private String userId;
    private LocalDate createAt;

    public static CreateDiaryResponse fromEntity(DiaryDomain data){
        return CreateDiaryResponse.builder()
                .userId(data.getUserId())
                .diaryId(data.getDiaryId())
                .createAt(data.getDate())
                .build();
    }
}
