package com.example.test.Controller;

import com.example.test.Service.DiaryService;
import com.example.test.dto.CreateDiaryRequest;
import com.example.test.dto.CustomUserDetails;
import com.example.test.dto.GetDiaryListDto;
import com.example.test.dto.createDiaryResponse;
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
    public createDiaryResponse createDiary(@RequestBody CreateDiaryRequest request){
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

    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
    }
}
