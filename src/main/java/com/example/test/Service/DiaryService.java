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
                                     LocalDate date,
                            UpdateDiaryRequest request) {
        DiaryDomain diary = diaryRepository.findByUserIdAndDate(userId, date);
        diary.setContent(request.getContent());
        return UpdateDiaryResponse.fromEntity(diaryRepository.save(diary));
    }
    @Transactional
    public List<GetDiaryListDto> getDiaryList(String userId) {
        return diaryRepository.findByUserIdOrderByDateDesc(userId)
                        .stream().map(GetDiaryListDto::fromEntity).toList();
    }

    @Transactional
    public GetDiaryListDto getDiaryDetail(String userId, LocalDate date) {
        return GetDiaryListDto.fromEntityAllContent(diaryRepository.findByUserIdAndDate(userId, date));
    }

    @Transactional
    public String getYesterdayDiaryData(String userId) {
        // UTC 기준으로 오늘 날짜 가져오기
        LocalDate utcDate = LocalDate.now(ZoneOffset.UTC);

        // 날짜의 시작 (00:00:00)과 끝 (23:59:59)을 설정
        LocalDateTime startOfDay = utcDate.atStartOfDay();  // 2024-10-27 00:00:00
        LocalDateTime endOfDay = utcDate.atTime(23, 59, 59);  // 2024-10-27 23:59:59

        // 날짜 범위 쿼리 수행
        DiaryDomain data = diaryRepository.findByUserIdAndDateBetween(userId, startOfDay, endOfDay);
        System.out.println(data);

        if (data == null) {
            return "No Data";
        } else {
            if (!data.getContent().isEmpty())
                return data.getContent();
            else
                return "No Data";
        }
    }
}
