package com.example.test.Controller;

import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MainControllerTest {
    @Autowired
    private MockMvc mockMvc;

    private MockHttpSession session;

    @BeforeEach
    public void setup() {
        session = new MockHttpSession();
        session.setAttribute("user", "testUser"); // 세션에 임의의 속성 추가
    }

    @Test
    public void testLogout() throws Exception {
        // 로그아웃 요청을 보내고 세션이 무효화되었는지 확인
        MvcResult result = mockMvc.perform(get("/logout.do")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn();

        HttpSession invalidatedSession = result.getRequest().getSession(false); // 세션이 무효화되었는지 확인

        // 세션이 무효화되었으므로 null이어야 함
        assert invalidatedSession == null;
    }
}