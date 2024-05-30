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

        UserDomain userDomain = userRepository.findByUserName(username);
        if(userDomain != null){
            return new CustomUserDetails(userDomain);
        }
        return null;
    }
}
