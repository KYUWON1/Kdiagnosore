package com.example.test.Controller;

import com.example.test.Service.CognitiveTestService;
import com.example.test.domain.TestDomain;
import com.example.test.dto.CognitiveAnswerRequest;
import com.example.test.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class CognitiveTestController {
    private final CognitiveTestService cognitiveTestService;

    @GetMapping("/test/getlist")
    public List<TestDomain> getCognitiveTest(){
        String userId = getUserIdFromToken();
        List<TestDomain> test = cognitiveTestService.getTestList(userId);
        return test;
    }

    @GetMapping("/test/getlist/{date}")
    public List<TestDomain> getCognitiveTestByDate(
            @PathVariable String date
    ){
        String userId = getUserIdFromToken();
        List<TestDomain> test = cognitiveTestService.getTestListbyDate(userId
                ,date);
        return test;
    }

    @PostMapping("/test/answer")
    public TestDomain answerCognitiveTest(
            @RequestBody CognitiveAnswerRequest request
    ){
        String userId = getUserIdFromToken();
        return cognitiveTestService.setCognitiveTestAnswer(request.getAnswer(),
                request.getTestId(), userId);
    }

    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
    }
}
