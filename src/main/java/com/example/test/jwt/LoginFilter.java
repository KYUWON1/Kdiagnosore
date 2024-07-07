package com.example.test.jwt;

import com.example.test.dto.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

//Security config 에 등록해주어야함
public class LoginFilter extends UsernamePasswordAuthenticationFilter { // filter를 상속받아 사용

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    // 매니져 의존성 주입
    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = null;
        String password = null;

        // App의 JSON 값이랑, 포스트맨에서 날리는 JSON값이 다른것같음
        // 그래서 그냥 2개로 바꿈. 에뮬레이터랑 포스트맨에서 동작 테스트 완료함
        try {
            if (request.getContentType().equals(MediaType.APPLICATION_JSON_VALUE)) {
                // JSON 요청 처리
                Map<String, String> requestBody = new ObjectMapper().readValue(request.getInputStream(), Map.class);
                username = requestBody.get("username");
                password = requestBody.get("password");
            } else {
                // URL 인코딩된 폼 데이터 요청 처리
                username = obtainUsername(request);
                password = obtainPassword(request);
            }

            System.out.println(username + " : " + password);

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
            System.out.println(authToken);

            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    //인증성공시 동작 부분, JWT 발급
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,Authentication authentication) throws IOException {

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends  GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();

        String role = auth.getAuthority();

        //JWT 토큰 생성
        String token = jwtUtil.createJwt(username,role,60*60*10L);

        // 헤더에 토큰을 담아서 전달
        response.addHeader("Authorization","Bearer "+token);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"success\": true, \"message\": \"Authentication successful\"}");
    }
    
    //인증실패시 동작 부분
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"success\": false, \"message\": \"" + "User Not Found" + "\"}");
        response.setStatus(401);
    }
}
