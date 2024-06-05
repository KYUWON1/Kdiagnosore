package com.example.test.Service;

import com.example.test.domain.UserDomain;
import com.example.test.dto.CustomUserDetails;
import com.example.test.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    //데이터베이스 의존성 연동
    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 데이터베이스에서 사용자 정보 조회
        UserDomain userDomain = userRepository.findByUserName(username);

        // 사용자 정보가 없으면 UsernameNotFoundException 예외 발생
        if (userDomain == null) {
            throw new UsernameNotFoundException("No user found with username: " + username);
        }

        // 사용자 정보가 있으면 CustomUserDetails 객체를 반환
        return new CustomUserDetails(userDomain);
    }
}
