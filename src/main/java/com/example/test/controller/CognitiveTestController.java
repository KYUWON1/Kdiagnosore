package com.example.test.controller;

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

import static com.example.test.jwt.UserIdHolder.getUserIdFromToken;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/test")
public class CognitiveTestController {
    private final CognitiveTestService cognitiveTestService;

    @GetMapping("/list")
    public List<TestDomain> getCognitiveTest(){
        String userId = getUserIdFromToken();
        List<TestDomain> test = cognitiveTestService.getTestList(userId);
        return test;
    }

    @GetMapping("/list/{date}")
    public List<TestDomain> getCognitiveTestByDate(
            @PathVariable String date
    ){
        String userId = getUserIdFromToken();
        List<TestDomain> test = cognitiveTestService.getTestListbyDate(userId
                ,date);
        return test;
    }

    @PostMapping("/answer")
    public TestDomain answerCognitiveTest(
            @RequestBody CognitiveAnswerRequest request
    ){
        String userId = getUserIdFromToken();
        return cognitiveTestService.setCognitiveTestAnswer(request.getAnswer(),
                request.getTestId(), userId);
    }

}
