package com.example.test.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AlarmListResponse {
    private String userId;
    private List<String> times;
}
