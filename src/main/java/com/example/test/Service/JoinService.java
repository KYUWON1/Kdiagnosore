package com.example.test.Service;

import com.example.test.domain.UserDomain;
import com.example.test.dto.JoinDTO;
import com.example.test.dto.ProtectorJoinDto;
import com.example.test.exception.JoinException;
import com.example.test.repository.UserRepository;
import com.example.test.type.ErrorCode;
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

    public JoinDTO  userJoinProcess(JoinDTO joinDTO) {
        checkJoinValidation(joinDTO);
        // User 도메인 객체 생성
        UserDomain user = setDefaultUser(joinDTO);
        user.setProtectorName(joinDTO.getProtectorName());
        user.setProtectorNum(joinDTO.getProtectorNum());
        user.setRole("user");
        user.setProtector(false);
        userRepository.save(user);

        return joinDTO;
    }

    public JoinDTO protectorJoinProcess(ProtectorJoinDto protectorJoinDto) {
        JoinDTO joinDTO = JoinDTO.fromProtectorJoinDto(protectorJoinDto);
        // 검증
        checkJoinValidation(joinDTO);

        // User 조회 및 데이터 수정
        UserDomain user = userRepository.findByUserNameAndPhoneNum(
                        protectorJoinDto.getWardName(), protectorJoinDto.getWardPhoneNumber());
        if (user == null) {
            throw new JoinException(ErrorCode.NO_PROTECTOR); // 사용자 찾지 못할 경우 예외 처리
        }

        user.setProtector(true);
        user.setProtectorNum(joinDTO.getPhoneNum());
        user.setProtectorName(joinDTO.getUserName());
        user.setProtectorId(joinDTO.getUserId());
        userRepository.save(user);

        // Protector 도메인 객체 생성
        UserDomain protector = setDefaultUser(joinDTO);
        protector.setProtectorName(protector.getProtectorName());
        protector.setProtectorNum(protector.getProtectorNum());
        protector.setProtectorId(user.getUserId());
        protector.setRole("protector");
        userRepository.save(protector);

        return joinDTO;
    }

    public boolean findUser(String userName,String phoneNumber) {
        UserDomain user = userRepository.findByUserNameAndPhoneNum(userName,
                phoneNumber);
        if(user == null){
            throw new JoinException(ErrorCode.USER_NOT_FOUND);
        }
        return true;
    }

    private void checkJoinValidation(JoinDTO joinDTO){
        if (!StringUtils.hasText(joinDTO.getUserId())) {
            throw new JoinException(ErrorCode.INVALID_ARGUMENT);
        }

        if (!StringUtils.hasText(joinDTO.getPassword())) {
            throw new JoinException(ErrorCode.INVALID_ARGUMENT);
        }

        // 중복 아이디 확인
        if (userRepository.existsByUserId(joinDTO.getUserId())) {
            throw new JoinException(ErrorCode.USER_ALREADY_EXITS);
        }
    }

    // 아이디 비밀번호 이름 이메일 전화번호 저장
    private UserDomain setDefaultUser(JoinDTO joinDTO){
        UserDomain user = new UserDomain();
        user.setUserId(joinDTO.getUserId());
        user.setUserName(joinDTO.getUserName());
        user.setEmail(joinDTO.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword()));
        user.setPhoneNum(joinDTO.getPhoneNum());

        return user;
    }
}
