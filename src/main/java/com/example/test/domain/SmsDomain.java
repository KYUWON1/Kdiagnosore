package com.example.test.domain;

import lombok.*;
import net.nurigo.sdk.message.model.MessageStatusType;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "certificate_message")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SmsDomain {
    private String phoneNum;
    private String certNum;
    private LocalDateTime sendAt;
    private MessageStatusType messageStatusType;
}
