package com.example.test.Controller;

import com.example.test.Service.AlarmService;
import com.example.test.dto.Alarm;
import com.example.test.dto.AlarmDto;
import com.example.test.dto.AlarmListResponse;
import com.example.test.dto.CustomUserDetails;
import com.example.test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AlarmController {
    private final AlarmService alarmService;

    @PostMapping("/join/setalarm")
    public Alarm.Response setAlarm(
            @RequestBody Alarm.Request request
    ){
        AlarmDto result = alarmService.setAndAddAlarm(request.getUserId(), request.getTime());
        return Alarm.Response.builder()
                .userId(result.getUserId())
                .time(result.getTime())
                .build();
    }

    @PostMapping("/user/alarm/add")
    public Alarm.Response addAlarm(
            @RequestBody Alarm.Request request
    ){
        AlarmDto result = alarmService.setAndAddAlarm(getUserIdFromToken(),
                request.getTime());
        return Alarm.Response.builder()
                .userId(result.getUserId())
                .time(result.getTime())
                .build();
    }

    @GetMapping("/user/alarm")
    public AlarmListResponse getAlarmList() {
        String userId = getUserIdFromToken();
        List<String> alarmList =
                alarmService.getAlarmList(userId);
        return AlarmListResponse.builder()
                .userId(userId)
                .times(alarmList)
                .build();
    }

    @DeleteMapping("/user/alarm/delete")
    public Alarm.Response deleteAlarm(
            @RequestBody Alarm.Request request
    ){
        AlarmDto result = alarmService.deleteAlarm(getUserIdFromToken(),
                request.getTime());
        return Alarm.Response.builder()
                .userId(result.getUserId())
                .time(result.getTime())
                .build();
    }

    private String getUserIdFromToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 토큰으로부터 유저 아이디 가져옴
        String userId = userDetails.getUsername();
        return userId;
    }
}
