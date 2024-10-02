package com.example.test.dto;

import com.example.test.domain.DiaryDomain;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class createDiaryResponse {
    private String diaryId;
    private String userId;
    private LocalDate createAt;

    public static createDiaryResponse fromEntity(DiaryDomain data){
        return createDiaryResponse.builder()
                .userId(data.getUserId())
                .diaryId(data.getDiaryId())
                .createAt(data.getDate())
                .build();
    }
}
