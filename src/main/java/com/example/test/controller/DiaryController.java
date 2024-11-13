package com.example.test.controller;

import com.example.test.Service.DiaryService;
import com.example.test.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.test.jwt.UserIdHolder.getUserIdFromToken;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/diary")
public class DiaryController {
    private final DiaryService diaryService;

    @PostMapping
    public CreateDiaryResponse createDiary(@RequestBody CreateDiaryRequest request){
        String userId = getUserIdFromToken();
        return diaryService.createDiary(userId,request);
    }

    @GetMapping("/list")
    public List<GetDiaryListDto> getDiaryList(){
        String userId = getUserIdFromToken();
        return diaryService.getDiaryList(userId);
    }

    @GetMapping("/list/{date}")
    public GetDiaryListDto getDiaryDetail(
            @PathVariable String date
            ){
        String userId = getUserIdFromToken();
        return diaryService.getDiaryDetail(userId,date);
    }

    @PatchMapping("/{date}")
    public UpdateDiaryResponse updateDiary(
            @PathVariable String date,
            @RequestBody UpdateDiaryRequest request
    ){
        String userId = getUserIdFromToken();
        return diaryService.updateDiary(userId,date,request);
    }

}
