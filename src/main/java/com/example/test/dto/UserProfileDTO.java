package com.example.test.dto;

import com.example.test.domain.UserDomain;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDTO {
    private String userId;
    private String userName;
    private String email;
    private String password;
    private String phoneNum;
    private String protectorName;
    private String protectorNum;

    public UserProfileDTO idFromEntity(UserDomain userDomain){
        return UserProfileDTO.builder()
                .userId(userDomain.getUserId())
                .userName(userDomain.getUserName())
                .phoneNum(userDomain.getPhoneNum())
                .email(userDomain.getEmail())
                .build();
    }

    public UserProfileDTO passwordFromEntity(UserDomain userDomain){
        return UserProfileDTO.builder()
                .userId(userDomain.getUserId())
                .password(userDomain.getPassword())
                .build();
    }
}
