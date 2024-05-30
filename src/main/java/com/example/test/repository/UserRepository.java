package com.example.test.repository;

import com.example.test.domain.UserDomain;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserDomain, String> {

    UserDomain findByEmail(String email);

    Boolean existsByUserName(String userName);

    UserDomain findByUserName(String userName);

}
