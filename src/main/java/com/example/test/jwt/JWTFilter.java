package com.example.test.jwt;

import com.example.test.domain.UserDomain;
import com.example.test.dto.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    //인증을 위해 jwtUtil 주입
    public JWTFilter(JWTUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // 토큰 부부만 파싱해서 가져옴
            String token = authorization.split(" ")[1];

            // 토큰만료시 예외 처리
            if (jwtUtil.isExpired(token)) {
                throw new ExpiredJwtException(null, null, "Token is expired");
            }

            String userId = jwtUtil.getUserId(token);
            String role = jwtUtil.getRole(token);

            UserDomain userDomain = new UserDomain();
            userDomain.setUserId(userId);
            userDomain.setPassword("temppassword");
            userDomain.setRole(role);

            CustomUserDetails customUserDetails = new CustomUserDetails(userDomain);
            Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            // 토큰 만료 에러처리
            sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Expired JWT Token: " + e.getMessage());
            return;
        } catch (Exception e) {
            // 잘못된 토큰 에러처리
            sendJsonErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal Server Error: " + e.getMessage());
            return;
        }
    }

    private void sendJsonErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("success", "false");
        errorDetails.put("message", message);

        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(errorDetails));
    }
}
