package com.example.test.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TestDataSet {
    private String question;
    private String predictAnswer;
    private String reason;
    private String timeStamp;
}
