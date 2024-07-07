package com.example.test.Service;

import com.example.test.domain.UserDomain;
import com.example.test.dto.UserProfileDTO;
import com.example.test.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public UserProfileDTO getUserProfile(String username){
        UserDomain data = userRepository.findByUserName(username);

        UserProfileDTO userInfoDTO = new UserProfileDTO();
        userInfoDTO.setUserName(data.getUserName());
        userInfoDTO.setEmail(data.getEmail());
        userInfoDTO.setPhoneNum(data.getPhoneNum());
        userInfoDTO.setProtectorName(data.getProtectorName());
        userInfoDTO.setProtectorNum(data.getProtectorNum());

        return userInfoDTO;
    }
}
