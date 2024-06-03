package com.example.test.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GPTRequestDTO {
    private String model;
    private List<GPTMessageDTO> messages;

    public GPTRequestDTO(String model, String prompt) {
        this.model = model;
        this.messages =  new ArrayList<>();
        this.messages.add(new GPTMessageDTO("user", prompt));
    }
}
