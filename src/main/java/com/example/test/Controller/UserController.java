package com.example.test.Controller;

import com.example.test.Service.SmsCertificationService;
import com.example.test.Service.UserService;
import com.example.test.dto.CustomUserDetails;
import com.example.test.dto.DefaultDTO;
import com.example.test.dto.ProfileUpdate;
import com.example.test.dto.UserProfileDTO;
import com.example.test.type.BaseResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;


@Controller
@ResponseBody
public class UserController {

    private final UserService userService;
    private final SmsCertificationService smsCertificationService;

    public UserController(UserService userService, SmsCertificationService smsCertificationService){
        this.userService = userService;
        this.smsCertificationService = smsCertificationService;
    }

    @GetMapping("/user/profile")
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

    @PostMapping("/user/profile/update")
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

    @PostMapping("/user/profile/update/phoneNumber")
    public ProfileUpdate.Response updatePhoneNumber(
            @RequestBody ProfileUpdate.Request request
    ) {
        String userId = getUserIdFromToken();
        String certNum = getNumStr();
        request.setUserId(userId);
        smsCertificationService.sendMessage(request.getPhoneNumber(),certNum);
        userService.updateUserInfo(request);
        return ProfileUpdate.Response.builder()
                .userId(userId)
                .status(BaseResponse.OK)
                .description("update profile.")
                .build();
    }

    @PostMapping("/user/profile/update/password")
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

    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
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
