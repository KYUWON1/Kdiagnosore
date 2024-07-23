package com.example.test.dto;

import com.example.test.type.BaseResponse;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DefaultDTO {
    private String description;
    private BaseResponse baseResponse;
}
