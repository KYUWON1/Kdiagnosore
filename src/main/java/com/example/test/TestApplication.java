package com.example.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class TestApplication {

	public static void main(String[] args) {
//		final Dotenv dotenv = Dotenv.load();
//
//		String apiKey = dotenv.get("API_KEY");
//		System.out.println(apiKey);
		SpringApplication.run(TestApplication.class, args);
	}

}
