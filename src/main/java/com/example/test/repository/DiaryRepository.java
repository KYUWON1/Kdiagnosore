package com.example.test.repository;

import com.example.test.domain.DiaryDomain;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepository extends MongoRepository<DiaryDomain,String> {
    List<DiaryDomain> findByUserIdOrderByDateDesc(String userId);
    DiaryDomain findByUserIdAndDate(String userId, LocalDate date);
}
