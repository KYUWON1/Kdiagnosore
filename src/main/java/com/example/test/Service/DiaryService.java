package com.example.test.Service;

import com.example.test.domain.DiaryDomain;
import com.example.test.dto.*;
import com.example.test.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;

    @Transactional
    public CreateDiaryResponse createDiary(String userId, CreateDiaryRequest request) {
        DiaryDomain diary = new DiaryDomain();
        diary.setUserId(userId);
        diary.setContent(request.getContent());
        diary.setDate(request.getDate());


        return CreateDiaryResponse.fromEntity(diaryRepository.save(diary));
    }

    @Transactional
    public UpdateDiaryResponse updateDiary(String userId,
                                     String date,
                            UpdateDiaryRequest request) {
        DiaryDomain diary = diaryRepository.findByUserIdAndDate(userId,
                date);
        diary.setContent(request.getContent());
        return UpdateDiaryResponse.fromEntity(diaryRepository.save(diary));
    }
    @Transactional
    public List<GetDiaryListDto> getDiaryList(String userId) {
        return diaryRepository.findByUserIdOrderByDateDesc(userId)
                        .stream().map(GetDiaryListDto::fromEntity).toList();
    }

    @Transactional
    public GetDiaryListDto getDiaryDetail(String userId, String date) {
        return GetDiaryListDto.fromEntityAllContent(diaryRepository.findByUserIdAndDate(userId, date));
    }

    @Transactional
    public String getYesterdayDiaryData(String userId) {
        // UTC 기준으로 오늘 날짜 가져오기
        System.out.println(userId);

        // yyyy-MM-dd 형식으로 날짜를 변환
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = LocalDate.now().format(formatter);

        System.out.println("Formatted Date: " + formattedDate);

        // DiaryDomain에서 yyyy-MM-dd로 저장된 날짜를 기반으로 쿼리 수행
        // 이 부분은 날짜 형식에 따라 다를 수 있음
        DiaryDomain data = diaryRepository.findByUserIdAndDate(userId, formattedDate);

        System.out.println(data);

        if (data == null) {
            return "No Data";
        } else {
            if (!data.getContent().isEmpty()) {
                return data.getContent();
            } else {
                return "No Data";
            }
        }
    }
}
