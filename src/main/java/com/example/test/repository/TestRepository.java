package com.example.test.repository;

import com.example.test.domain.TestDomain;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TestRepository extends MongoRepository<TestDomain,String> {
    List<TestDomain> findByUserId(String userId);
    List<TestDomain> findByUserIdAndDate(String userId, String date);
}
