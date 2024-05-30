package com.example.test.jwt;

import com.example.test.dto.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Collection;
import java.util.Iterator;

//Security config 에 등록해주어야함
public class LoginFilter extends UsernamePasswordAuthenticationFilter { // filter를 상속받아 사용

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    // 매니져 의존성 주입
    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override // 해당 Authentication 오버라이드 해주어야 사용가능.
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response){
        // request로 받은 id와 password
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        // 받은 유저 정보를 통해 인증 토큰 생성, 원래 마지막 값에 role 같은 것을 전달해주어야함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username,password,null);

        // authenticationManager에서 해당 유저 정보 검증하고 return 해줌
        return authenticationManager.authenticate(authToken);
    }

    //인증성공시 동작 부분, JWT 발급
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,Authentication authentication){

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
    }

    //인증실패시 동작 부분
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed){

        response.setStatus(401);
    }
}
