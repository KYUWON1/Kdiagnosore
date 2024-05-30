package com.example.test.Service;

import com.example.test.domain.UserDomain;
import com.example.test.dto.JoinDTO;
import com.example.test.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    //의존성 주입으로 repo, 암호 인코더 받기
    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void joinProcess(JoinDTO joinDTO) {
        String userName = joinDTO.getUserName();
        String email = joinDTO.getEmail();
        String password = joinDTO.getPassword();
        String phoneNum = joinDTO.getPhoneNum();
        String protectorName = joinDTO.getProtectorName();
        String protectorNum = joinDTO.getProtectorNum();

        //해당 아이디가 존재하는지 확인
        Boolean isExist = userRepository.existsByUserName(userName);

        if(isExist){
            throw new RuntimeException("해당 아이디는 이미 존재합니다.");
        }

        UserDomain data = new UserDomain();

        data.setUserName(userName);
        data.setEmail(email);
        data.setRole("user");
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setPhoneNum(phoneNum); // 선택적으로 처리
        data.setProtectorName(protectorName); // 선택적으로 처리
        data.setProtectorNum(protectorNum); // 선택적으로 처리

        userRepository.save(data);
    }
}
