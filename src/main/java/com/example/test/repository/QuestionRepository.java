package com.example.test.repository;

import com.example.test.domain.QuestionDomain;
import com.example.test.type.QuestionType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends MongoRepository<QuestionDomain,
        String> {

    List<QuestionDomain> findAllByType(QuestionType type);
    List<QuestionDomain> findAllByUserId(String userId);
    QuestionDomain findByUserIdAndTestCreateAt(String userId, LocalDate date);
    Optional<QuestionDomain> findByUserId(String userId);

}
