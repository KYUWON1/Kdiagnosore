package com.example.test.Service;

import com.example.test.domain.UserDomain;
import com.example.test.dto.JoinDTO;
import com.example.test.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    //의존성 주입으로 repo, 암호 인코더 받기
    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public JoinDTO joinProcess(JoinDTO joinDTO) {
        // 필수 입력 값 검증
        System.out.println(joinDTO);
        if (!StringUtils.hasText(joinDTO.getUserName())) {
            System.out.println(joinDTO.getUserName());
            throw new IllegalArgumentException("아이디를 입력해야 합니다.");
        }
        if (!StringUtils.hasText(joinDTO.getPassword())) {
            throw new IllegalArgumentException("비밀번호를 입력해야 합니다.");
        }

        // 중복 아이디 확인
        if (userRepository.existsByUserName(joinDTO.getUserName())) {
            throw new RuntimeException("해당 아이디는 이미 존재합니다.");
        }

        // User 도메인 객체 생성
        UserDomain data = new UserDomain();
        data.setUserName(joinDTO.getUserName());
        data.setEmail(joinDTO.getEmail());
        data.setRole("user");
        data.setPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword()));
        data.setPhoneNum(joinDTO.getPhoneNum()); // 선택적으로 처리
        data.setProtectorName(joinDTO.getProtectorName()); // 선택적으로 처리
        data.setProtectorNum(joinDTO.getProtectorNum()); // 선택적으로 처리

        userRepository.save(data);

        return joinDTO;
    }
}
