package com.example.test.repository;

import com.example.test.domain.ExpoTokenDomain;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface PushTokenRepository extends MongoRepository<ExpoTokenDomain,
        String> {
}
