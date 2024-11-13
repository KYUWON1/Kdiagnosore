package com.example.test.jwt;

import com.example.test.dto.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserIdHolder {
    public static String getUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        return userDetails.getUsername();
    }
}
