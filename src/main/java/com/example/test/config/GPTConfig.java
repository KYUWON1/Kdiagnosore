package com.example.test.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
<<<<<<< HEAD
import org.springframework.context.annotation.Primary;
=======
>>>>>>> 23f102c4 (24-06-03 GPT-API Controller)
import org.springframework.web.client.RestTemplate;

@Configuration
public class GPTConfig {

    @Value("${gpt.api.key}")
    private String apiKey;

    @Bean
<<<<<<< HEAD
    @Primary
=======
>>>>>>> 23f102c4 (24-06-03 GPT-API Controller)
    public RestTemplate restTemplate(){
        RestTemplate template = new RestTemplate();
        template.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add(
                    "Authorization"
                    ,"Bearer "+apiKey);
            return execution.execute(request,body);
        });

        return template;
    }
}
