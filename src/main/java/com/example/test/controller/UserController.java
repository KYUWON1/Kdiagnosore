package com.example.test.controller;

import com.example.test.Service.SmsCertificationService;
import com.example.test.Service.UserService;
import com.example.test.dto.CustomUserDetails;
import com.example.test.dto.ProfileUpdate;
import com.example.test.dto.UserProfileDTO;
import com.example.test.exception.CertificationException;
import com.example.test.type.BaseResponse;
import com.example.test.type.ErrorCode;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import static com.example.test.jwt.UserIdHolder.getUserIdFromToken;


@Controller
@ResponseBody
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;
    private final SmsCertificationService smsCertificationService;

    public UserController(UserService userService, SmsCertificationService smsCertificationService){
        this.userService = userService;
        this.smsCertificationService = smsCertificationService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 이름 가져옴
        String username = userDetails.getUsername();
        UserProfileDTO uDto = userService.getUserProfile(username);
        if(uDto == null){
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("success", false);
            errorDetails.put("message", "Profile not found for user: " + username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDetails);
        }
        return ResponseEntity.ok(uDto);
    }

    @PostMapping("/profile/update")
    public ProfileUpdate.Response updateProfile(
            @RequestBody ProfileUpdate.Request request
            ) {
        String userId = getUserIdFromToken();
        request.setUserId(userId);
        userService.updateUserInfo(request);
        return ProfileUpdate.Response.builder()
                .userId(userId)
                .status(BaseResponse.OK)
                .description("update profile.")
                .build();
    }

    @PostMapping("/profile/update/phoneNumber/request")
    public ProfileUpdate.Response updatePhoneNumberRequest(
            HttpSession session,
            @RequestBody ProfileUpdate.Request request
    ) {
        String certNum = getNumStr();
        session.setAttribute("CertNum",certNum);
        if(request.getPhoneNumber() != null ){
            smsCertificationService.sendMessage(request.getPhoneNumber(),certNum);
        }else if(request.getProtectorNumber() != null){
            smsCertificationService.sendMessage(request.getProtectorNumber(),
                    certNum);
        }

        return ProfileUpdate.Response.builder()
                .status(BaseResponse.OK)
                .description("send SMS success.")
                .build();
    }
    @PostMapping("/profile/update/phoneNumber/verify")
    public ProfileUpdate.Response updatePhoneNumber(
            HttpSession session,
            @RequestBody ProfileUpdate.Request request
    ) {
        System.out.println(request.getCertNum()+session.getAttribute("CertNum"));
        if(!request.getCertNum().equals(session.getAttribute("CertNum")) || session.getAttribute("CertNum").equals(null)){
            session.setAttribute("CertNum",null);
            throw new CertificationException(ErrorCode.VERIFY_CODE_NOT_MATCH);
        }
        String userId = getUserIdFromToken();
        request.setUserId(userId);

        userService.updatePhoneNumber(request);
        session.setAttribute("CertNum",null);
        return ProfileUpdate.Response.builder()
                .userId(userId)
                .status(BaseResponse.OK)
                .description("update phoneNumber success.")
                .build();
    }


    @PostMapping("/profile/update/password")
    public ProfileUpdate.Response updatePassword(
            @RequestBody ProfileUpdate.Request request
    ) {
        String userId = getUserIdFromToken();
        request.setUserId(userId);
        userService.updateUserPassword(request);
        return ProfileUpdate.Response.builder()
                .userId(userId)
                .status(BaseResponse.OK)
                .description("update password.")
                .build();
    }

    private static String getNumStr() {
        Random rand = new Random();
        String numStr = "";
        for (int i = 0; i < 4; i++) {
            String ran = Integer.toString(rand.nextInt(10));
            numStr += ran;
        }
        return numStr;
    }
}
