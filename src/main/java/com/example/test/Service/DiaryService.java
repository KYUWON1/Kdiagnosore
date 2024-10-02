package com.example.test.Service;

import com.example.test.domain.DiaryDomain;
import com.example.test.dto.CreateDiaryRequest;
import com.example.test.dto.GetDiaryListDto;
import com.example.test.dto.createDiaryResponse;
import com.example.test.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;

    @Transactional
    public createDiaryResponse createDiary(String userId, CreateDiaryRequest request) {
        DiaryDomain diary = new DiaryDomain();
        diary.setUserId(userId);
        diary.setContent(request.getContent());
        diary.setDate(request.getDate());


        return createDiaryResponse.fromEntity(diaryRepository.save(diary));
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
    public String getYesterdayDiaryData(String userId){
        DiaryDomain data = diaryRepository.findByUserIdAndDate(userId,
                LocalDate.now().minusDays(1));
        return data.getContent();
    }
}
