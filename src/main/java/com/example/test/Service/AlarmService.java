package com.example.test.Service;

import com.example.test.domain.UserDomain;
import com.example.test.dto.Alarm;
import com.example.test.dto.AlarmDto;
import com.example.test.exception.UserException;
import com.example.test.repository.UserRepository;
import com.example.test.type.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlarmService {
    private final UserRepository userRepository;

    public AlarmDto setAndAddAlarm(
            String userId,
            String time
    ) {
        UserDomain user = userRepository.findByUserId(userId);

        String formatTime = changeTimeFormatKST(time);

        if(user.getAlarmTimes() == null){
            List<String> alarmList = new ArrayList<>();
            alarmList.add(formatTime);
            user.setAlarmTimes(alarmList);
        }else{
            user.getAlarmTimes().add(formatTime);
        }

        userRepository.save(user);

        return AlarmDto.builder()
                .userId(userId)
                .time(formatTime)
                .build();
    }

    public AlarmDto deleteAlarm(
            String userId,
            String time
    ) {
        UserDomain user = userRepository.findByUserId(userId);
        List<String> alarmList = user.getAlarmTimes();
        String formatTime = changeTimeFormatKST(time);

        if(alarmList == null || alarmList.isEmpty()){
            throw new UserException(ErrorCode.ALARM_EMPTY);
        }

        alarmList.remove(formatTime);
        user.setAlarmTimes(alarmList);
        userRepository.save(user);

        return AlarmDto.builder()
                .userId(userId)
                .time(time)
                .build();
    }

    private String changeTimeFormatKST(String time){
        // 입력된 시간을 파싱
        LocalTime inputTime = LocalTime.parse(time, DateTimeFormatter.ISO_LOCAL_TIME);

        String kstTimeString = inputTime.toString();

        return kstTimeString;
    }
}
