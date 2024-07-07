package com.example.test.repository;

import com.example.test.domain.ChatDomain;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRepository extends MongoRepository<ChatDomain,String> {

}
