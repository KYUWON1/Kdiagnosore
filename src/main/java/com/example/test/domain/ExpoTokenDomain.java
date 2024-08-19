package com.example.test.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="push_token")
@Getter
@Setter
public class ExpoTokenDomain {
    @Id
    private String userId;

    private String pushToken;
}
