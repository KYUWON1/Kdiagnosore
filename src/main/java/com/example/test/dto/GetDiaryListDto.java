package com.example.test.dto;

import com.example.test.domain.DiaryDomain;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetDiaryListDto {
    private String content;
    private LocalDate date;

    public static GetDiaryListDto fromEntity(DiaryDomain data){
        GetDiaryListDto dto = new GetDiaryListDto();
        if(data.getContent().length() >= 20){
            dto.setContent(data.getContent().substring(0,20));
        }else{
            dto.setContent(data.getContent());
        }
        dto.setDate(data.getDate());
        return dto;
    }

    public static GetDiaryListDto fromEntityAllContent(DiaryDomain data){
        GetDiaryListDto dto = new GetDiaryListDto();
        dto.setContent(data.getContent());
        dto.setDate(data.getDate());
        return dto;
    }
}
