package com.example.test.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JoinDTO {
    private String userId;
    private String userName;
    private String email;
    private String password;
    private String phoneNum;
    private String protectorNum;
    private String protectorName;

    public static JoinDTO fromProtectorJoinDto(ProtectorJoinDto dto){
        return JoinDTO.builder()
                .userId(dto.getUserId())
                .userName(dto.getUserName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .phoneNum(dto.getPhoneNum())
                .build();
    }

}
