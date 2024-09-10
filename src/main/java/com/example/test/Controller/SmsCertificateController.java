package com.example.test.Controller;

import com.example.test.Service.SmsCertificationService;
import com.example.test.dto.SmsCertificate;
import com.example.test.dto.SmsSend;
import com.example.test.dto.SmsVerify;
import com.example.test.exception.VerifyException;
import com.example.test.type.CertificateResponse;
import com.example.test.type.ErrorCode;
import jakarta.servlet.http.HttpSession;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import static com.example.test.type.CertificateResponse.FAIL;
import static com.example.test.type.CertificateResponse.OK;

@RestController
public class SmsCertificateController {

    @Autowired
    private final SmsCertificationService smsCertificationService;
    private final Map<String, SmsVerify> codeMatcher = new HashMap<>();

    public SmsCertificateController(SmsCertificationService smsCertificationService) {
        this.smsCertificationService = smsCertificationService;
    }

    @PostMapping("/check/sendSMS")
    public SmsSend.Response sendSMS(
         @RequestBody SmsSend.Request request
    ){
        String certificateNum = getNumStr();
        SmsVerify verify = new SmsVerify(request.getPhoneNumber(),LocalDateTime.now());
        codeMatcher.put(certificateNum,verify);
        smsCertificationService.sendMessage(request.getPhoneNumber(),certificateNum);

        return SmsSend.Response.builder()
                .phoneNumber(request.getPhoneNumber())
                .certNumber(certificateNum)
                .build();
    }

    @PostMapping("/check/verify")
    public SmsCertificate.Response verifySMS(
            @RequestBody SmsCertificate.Request request
    ){
        SmsVerify smsVerify = codeMatcher.get(request.getCertNum());
        String certNum = request.getCertNum();
        // 인증번호 없음
        if(codeMatcher.get(certNum) == null){
            throw new VerifyException(ErrorCode.VERIFY_CODE_NOT_EXIST);
        }
        // 인증번호 다름
        if(!request.getPhoneNumber().equals(smsVerify.getPhoneNumber())){
            throw new VerifyException(ErrorCode.VERIFY_CODE_NOT_MATCH);
        }
        // 시간 초과
        LocalDateTime verifyTime = smsVerify.getCreatedAt();
        Duration duration = Duration.between(verifyTime, LocalDateTime.now());
        if(duration.toMinutes() >= 5){
            throw new VerifyException(ErrorCode.VERIFY_CODE_NOT_MATCH);
        }
        // 모든 인증 성공시 map에 삭제
        codeMatcher.remove(certNum);

        return SmsCertificate.Response.builder()
                .certificateResponse(OK)
                .build();
    }

    private static String getNumStr() {
        Random rand = new Random();
        String numStr = "";
        for (int i = 0; i < 4; i++) {
            String ran = Integer.toString(rand.nextInt(10));
            numStr += ran;
        }
        return numStr;
    }

    // 맵에 남아있는 인증번호들 삭제.
    @Scheduled(fixedDelay = 600000) // 10분마다 실행
    public void cleanUpExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        codeMatcher.entrySet().removeIf(entry ->
                Duration.between(entry.getValue().getCreatedAt(), now).toMinutes() >= 5
        );
    }
}
