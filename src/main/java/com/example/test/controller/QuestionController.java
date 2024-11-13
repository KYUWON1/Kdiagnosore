package com.example.test.controller;

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

import static com.example.test.jwt.UserIdHolder.getUserIdFromToken;

@RestController
@RequestMapping("/api/v1/question")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public GetQuestionResultDto createQuestion(
            @RequestParam QuestionType type
    ){
        return questionService.createQuestion(type, getUserIdFromToken());
    }

    @PostMapping
    public QuestionResultResponse questionAnswer(
            @RequestParam String testId,
            @RequestBody Map<String,Integer> result
    ){
        return questionService.setQuestionAnswer(testId,result);
    }

    @GetMapping("/list")
    public List<GetResultDto> getResultList(){
        return questionService.getResultList(getUserIdFromToken());
    }

    @GetMapping("/list/{date}")
    public GetResultDetailDto getResultDetail(
            @PathVariable LocalDate date
            ){
        return questionService.getResultDetail(getUserIdFromToken(),date);
    }

    @GetMapping("/status")
    public GetUserTestStatusDto getUserStatus(){
        return questionService.getUserStatus(getUserIdFromToken());
    }

}
