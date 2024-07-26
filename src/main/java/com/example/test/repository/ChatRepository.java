package com.example.test.repository;

import com.example.test.domain.ChatDomain;
import com.example.test.dto.ChatDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ChatRepository extends MongoRepository<ChatDomain,String> {
    List<ChatDTO> findByUserId(String userId);
    List<ChatDTO> findByUserIdAndDate(String userId, String date);
}
