package com.example.test.Service;

import com.example.test.domain.ChatDomain;
import com.example.test.domain.TestDomain;
import com.example.test.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CognitiveTestService {
    private final TestRepository testRepository;

    public List<TestDomain> getTestList(String userId) {
        // 해당 userId로 TestDomain 리스트를 조회
        List<TestDomain> testList = testRepository.findByUserId(userId);

        // LocalDate별로 가장 최근 시간을 가진 TestDomain을 그룹화
        Map<LocalDate, TestDomain> lastTestPerDate = testList.stream()
                .collect(Collectors.groupingBy(
                        TestDomain::getDate,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparing(TestDomain::getTime)),
                                Optional::get
                        )
                ));

        // 그룹화된 결과에서 필요한 작업을 처리 후 반환할 수도 있고, 원하는 대로 가공
        return new ArrayList<>(lastTestPerDate.values()); // 가장 최근의 TestDomain들을 리스트로 반환
    }

    public List<TestDomain> getTestListbyDate(String userId, String date) {
        List<TestDomain> testList = testRepository.findByUserIdAndDate(userId,
                date);
        return testList;
    }

    public TestDomain setCognitiveTestAnswer(String answer, String testId,
                                       String userId) {
        TestDomain test = testRepository.findByUserIdAndTestId(userId,
                testId);
        test.setAnswer(answer);
        TestDomain save = testRepository.save(test);
        return save;
    }


}
