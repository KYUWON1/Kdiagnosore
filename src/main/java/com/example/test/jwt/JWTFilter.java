package com.example.test.jwt;

import com.example.test.domain.UserDomain;
import com.example.test.dto.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    //인증을 위해 jwtUtil 주입
    public JWTFilter(JWTUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // request에서 인증 헤더 찾기
        String authorization = request.getHeader("Authorization");
        //System.out.println("Authorization Header: " + authorization);

        // 헤더 검증 부분
        if(authorization == null || !authorization.startsWith("Bearer ")){
            System.out.println("No valid Authorization header found or token does not start with 'Bearer '");
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰 부분만 획득
        String token = authorization.split(" ")[1];
        //System.out.println("Token extracted: " + token);

        // 토큰 시간 검증
        if(jwtUtil.isExpired(token)){
            System.out.println("Token is expired");
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        System.out.println("Username and role from token: " + username + " : " + role);

        // 유저 도메인 객체 생성 및 값 설정
        UserDomain userDomain = new UserDomain();
        userDomain.setUserName(username);
        userDomain.setPassword("temppassword");
        userDomain.setRole(role);

        // CustomUserDetails 객체 생성
        CustomUserDetails customUserDetails = new CustomUserDetails(userDomain);

        // 스프링 시큐리티 인증 토큰 생성 및 설정
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("Authentication successful, security context updated");

        // 토큰 검증 완료 후 요청 처리 계속
        filterChain.doFilter(request, response);
    }
}
