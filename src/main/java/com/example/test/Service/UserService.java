package com.example.test.Service;

import com.example.test.Controller.SmsCertificateController;
import com.example.test.domain.UserDomain;
import com.example.test.dto.UserProfileDTO;
import com.example.test.exception.UserException;
import com.example.test.repository.UserRepository;
import com.example.test.type.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, SmsCertificateController smsCertificateController){
        this.userRepository = userRepository;
    }

    public UserProfileDTO getUserProfile(String username){
        UserDomain data = userRepository.findByUserName(username);

        UserProfileDTO userInfoDTO = new UserProfileDTO();
        userInfoDTO.setUserId(data.getUserId());
        userInfoDTO.setUserName(data.getUserName());
        userInfoDTO.setEmail(data.getEmail());
        userInfoDTO.setPhoneNum(data.getPhoneNum());
        userInfoDTO.setProtectorName(data.getProtectorName());
        userInfoDTO.setProtectorNum(data.getProtectorNum());

        return userInfoDTO;
    }

    public UserProfileDTO findId(String userName, String email) {
        System.out.println(userName+" "+email);
        UserDomain user = userRepository.findByUserNameAndEmail(userName,email);
        if(user == null){
            throw new UserException(ErrorCode.USER_NOT_FOUND);
        }
        return new UserProfileDTO().idFromEntity(user);
    }

    public UserProfileDTO findPassword(String userId) {
        UserDomain user = userRepository.findByUserId(userId);
        if(user == null){
            throw new UserException(ErrorCode.USER_NOT_FOUND);
        }
        return new UserProfileDTO().passwordFromEntity(user);
    }
}
