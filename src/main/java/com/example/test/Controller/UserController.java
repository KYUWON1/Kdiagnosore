package com.example.test.Controller;

import com.example.test.Service.UserService;
import com.example.test.dto.CustomUserDetails;
import com.example.test.dto.UserProfileDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 이름 가져옴
        String username = userDetails.getUsername();
        UserProfileDTO uDto = userService.getUserProfile(username);
        if(uDto == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(uDto);
    }
}
