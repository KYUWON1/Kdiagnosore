package com.example.test.Controller;

import com.example.test.Service.QuestionService;
import com.example.test.dto.*;
import com.example.test.type.QuestionType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/question")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

//    @PostMapping("/testtest")
//    public void createQuestion(){
//        questionService.createTest();
//    }

    @GetMapping
    public GetQuestionResultDto getQuestion(
            @RequestParam QuestionType type
    ){
        return questionService.getQuestion(type, getUserIdFromToken());
    }

    @PostMapping
    public QuestionResultResponse questionAnswer(
            @RequestParam String testId,
            @RequestBody Map<String,Integer> result
    ){
        return questionService.setQuestionAnswer(testId,result);
    }

    @GetMapping("/result")
    public List<GetResultDto> getResultList(){
        return questionService.getResultList(getUserIdFromToken());
    }

    @GetMapping("/result/{date}")
    public GetResultDetailDto getResultDetail(
            @PathVariable LocalDate date
            ){
        return questionService.getResultDetail(getUserIdFromToken(),date);
    }


    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
    }
}
