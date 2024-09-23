package com.example.test.repository;

import com.example.test.domain.UserDomain;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<UserDomain, String> {

    UserDomain findByEmail(String email);

    UserDomain findByUserId(String userId);

    UserDomain findByUserNameAndEmail(String userName,String email);

    UserDomain findByUserNameAndPhoneNum(String userName,String phoneNumber);

    Boolean existsByUserId(String userId);

    UserDomain findByUserName(String userName);

    UserDomain findByProtectorName(String protectorName);

    @Query("{'alarmTimes': ?0}")
    List<UserDomain> findByAlarmTime(String alarmTime);
}
