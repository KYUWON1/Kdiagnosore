package com.example.test.Controller;

import com.example.test.dto.GPTRequestDTO;
import com.example.test.dto.GPTResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/gpt")
@Slf4j
public class GPTController {

    @Value("${gpt.model}")
    private String model;

    @Value("${gpt.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate template;

    @GetMapping("/chat")
    public String chat(@RequestParam(name = "prompt")String prompt){
        GPTRequestDTO request = new GPTRequestDTO(model, prompt);
        GPTResponseDTO response =  template.postForObject(apiURL, request, GPTResponseDTO.class);
        return response.getChoices().get(0).getMessage().getContent();
    }
}
