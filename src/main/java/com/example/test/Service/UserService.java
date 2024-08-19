package com.example.test.Service;

import com.example.test.Controller.SmsCertificateController;
import com.example.test.domain.UserDomain;
import com.example.test.dto.DefaultDTO;
import com.example.test.dto.ProfileUpdate;
import com.example.test.dto.ResetPassword;
import com.example.test.dto.UserProfileDTO;
import com.example.test.exception.CertificationException;
import com.example.test.exception.UserException;
import com.example.test.repository.UserRepository;
import com.example.test.type.BaseResponse;
import com.example.test.type.ErrorCode;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, SmsCertificateController smsCertificateController, BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public UserProfileDTO getUserProfile(String userId){
        UserDomain data = userRepository.findByUserId(userId);

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

    public DefaultDTO findUserbyUserId(String userId){
        UserDomain user = userRepository.findByUserId(userId);
        if(user == null){
            throw new UserException(ErrorCode.USER_NOT_FOUND);
        }
        return DefaultDTO.builder()
                .description("유저 확인완료.")
                .baseResponse(BaseResponse.OK)
                .build();
    }

    public DefaultDTO updatePassword(ResetPassword.Request request,
                                     HttpSession session) {
        String userId = (String)session.getAttribute("userId");
        if(!request.getPassword().equals(request.getPasswordCheck())){
            throw new CertificationException(ErrorCode.PASSWORD_CHECK_UN_MATCH);
        }
        if(userId == null){
            throw new UserException(ErrorCode.USER_NOT_FOUND);
        }
        UserDomain user = userRepository.findByUserId(userId);
        String encodePassword =
                bCryptPasswordEncoder.encode(request.getPassword());
        user.setPassword(encodePassword);
        userRepository.save(user);

        session.setAttribute("userId",null);
        return DefaultDTO.builder()
                .description("success update password.")
                .baseResponse(BaseResponse.OK)
                .build();
    }

    public DefaultDTO updateUserInfo(ProfileUpdate.Request request) {
        UserDomain user = userRepository.findByUserId(request.getUserId());
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setProtectorName(request.getProtectorName());
        userRepository.save(user);
        return DefaultDTO.builder()
                .description("success update profile.")
                .baseResponse(BaseResponse.OK)
                .build();
    }

    public DefaultDTO updateUserPassword(ProfileUpdate.Request request) {
        UserDomain user = userRepository.findByUserId(request.getUserId());
        if(!bCryptPasswordEncoder.matches(request.getPasswordBefore(),
                user.getPassword())){
            throw new UserException(ErrorCode.PASSWORD_UN_MATCH);
        }
        if(!request.getPasswordAfter().equals(request.getPasswordCheck())){
            throw new UserException(ErrorCode.PASSWORD_CHECK_UN_MATCH);
        }
        String encodedPassword =
                bCryptPasswordEncoder.encode(request.getPasswordAfter());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return DefaultDTO.builder()
                .description("success update password.")
                .baseResponse(BaseResponse.OK)
                .build();
    }

    public DefaultDTO updatePhoneNumber(ProfileUpdate.Request request) {
        UserDomain user = userRepository.findByUserId(request.getUserId());

        if(request.getPhoneNumber() != null){
            user.setPhoneNum(request.getPhoneNumber());
        }else if(request.getProtectorNumber() != null){
            user.setProtectorNum(request.getProtectorNumber());
        }

        userRepository.save(user);
        return DefaultDTO.builder()
                .description("success update PhoneNumber.")
                .baseResponse(BaseResponse.OK)
                .build();
    }
    
    public List<String> findAllUserId(){
        List<UserDomain> allUser = userRepository.findAll();
        return allUser.stream()
                .map(user -> user.getUserId())
                .collect(Collectors.toList());
    }

}
