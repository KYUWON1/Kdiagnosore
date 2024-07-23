package com.example.test.repository;

import com.example.test.domain.UserDomain;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<UserDomain, String> {

    UserDomain findByEmail(String email);

    UserDomain findByUserId(String userId);

    UserDomain findByUserNameAndEmail(String userName,String email);

    Boolean existsByUserId(String userId);

    UserDomain findByUserName(String userName);

}
