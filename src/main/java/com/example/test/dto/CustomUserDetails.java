package com.example.test.dto;

import com.example.test.domain.UserDomain;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final UserDomain userDomain;

    //UserDomain을 의존성 주입
    public CustomUserDetails(UserDomain userDomain){
        this.userDomain = userDomain;
    }

    @Override // role 값을 반환
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userDomain.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getPassword() {
        return userDomain.getPassword();
    }

    @Override
    public String getUsername() {
        return userDomain.getUserName();
    }

    // 나머지는 계정 활성화 되도록 true로 설정
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
