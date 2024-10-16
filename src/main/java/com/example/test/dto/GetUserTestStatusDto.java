package com.example.test.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetUserTestStatusDto {
    private boolean canTest;
    private Integer dDay;
}
