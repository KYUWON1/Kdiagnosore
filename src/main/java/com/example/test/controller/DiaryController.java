package com.example.test.controller;

import com.example.test.Service.DiaryService;
import com.example.test.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/diary")
public class DiaryController {
    private final DiaryService diaryService;

    @PostMapping
    public CreateDiaryResponse createDiary(@RequestBody CreateDiaryRequest request){
        String userId = getUserIdFromToken();
        return diaryService.createDiary(userId,request);
    }

    @GetMapping
    public List<GetDiaryListDto> getDiaryList(){
        String userId = getUserIdFromToken();
        return diaryService.getDiaryList(userId);
    }

    @GetMapping("/{date}")
    public GetDiaryListDto getDiaryDetail(
            @PathVariable LocalDate date
            ){
        String userId = getUserIdFromToken();
        return diaryService.getDiaryDetail(userId,date);
    }

    @PatchMapping("/{date}")
    public UpdateDiaryResponse updateDiary(
            @PathVariable LocalDate date,
            @RequestBody UpdateDiaryRequest request
    ){
        String userId = getUserIdFromToken();
        return diaryService.updateDiary(userId,date,request);
    }

    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
    }
}
