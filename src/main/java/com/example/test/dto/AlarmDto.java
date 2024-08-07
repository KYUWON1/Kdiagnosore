package com.example.test.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlarmDto {
    private String userId;
    private String time;
}
