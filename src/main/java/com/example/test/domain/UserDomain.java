package com.example.test.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="user") //user 컬렉션 사용
@Getter
@Setter
public class UserDomain {
    @Id
    private String id;

    private String userId;
    private String userName;
    private String email;
    private String password;

    private String phoneNum;
    private String protectorName;
    private String protectorNum;

    private String role;

    public UserDomain(){

    }

    public UserDomain(String userName, String email, String password, String phone_num, String protector_name, String protector_num,String role) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.phoneNum = phone_num;
        this.protectorName = protector_name;
        this.protectorNum = protector_num;
        this.role = role;
    }
}
