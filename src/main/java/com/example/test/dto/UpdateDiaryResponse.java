package com.example.test.dto;

import com.example.test.domain.DiaryDomain;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class UpdateDiaryResponse {
    private String diaryId;
    private String userId;
    private LocalDate createAt;

    public static UpdateDiaryResponse fromEntity(DiaryDomain data){
        return UpdateDiaryResponse.builder()
                .userId(data.getUserId())
                .diaryId(data.getDiaryId())
                .createAt(data.getDate())
                .build();
    }
}
