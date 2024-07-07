package com.example.test.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.web.client.RestTemplate;
import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class GPTConfig {
    private final Dotenv dotenv = Dotenv.load();

    private String apiKey = dotenv.get("API_KEY");

    @Bean
    @Primary
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
