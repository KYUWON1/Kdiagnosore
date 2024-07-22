package com.example.test.Controller;

import com.example.test.Service.SmsCertificationService;
import com.example.test.dto.SmsCertificate;
import com.example.test.dto.SmsSend;
import com.example.test.type.CertificateResponse;
import jakarta.servlet.http.HttpSession;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

import static com.example.test.type.CertificateResponse.FAIL;
import static com.example.test.type.CertificateResponse.OK;

@RestController
public class SmsCertificateController {

    @Autowired
    private final SmsCertificationService smsCertificationService;

    public SmsCertificateController(SmsCertificationService smsCertificationService) {
        this.smsCertificationService = smsCertificationService;
    }

    @PostMapping("/check/sendSMS")
    public SmsSend.Response sendSMS(
            HttpSession httpSession,
         @RequestBody SmsSend.Request request
    ){
        String certificateNum = getNumStr();
        httpSession.setAttribute("phoneNumber",request.getPhoneNumber());
        httpSession.setAttribute("certificateCode",certificateNum);
        httpSession.setAttribute("verifyTime", LocalDateTime.now());

        System.out.println("receiver Num:"+request.getPhoneNumber());
        System.out.println("인증번호"+certificateNum);
        smsCertificationService.sendMessage(request.getPhoneNumber(),certificateNum);

        return SmsSend.Response.builder()
                .phoneNumber(request.getPhoneNumber())
                .certNumber(certificateNum)
                .build();
    }

    @PostMapping("/check/verify")
    public SmsCertificate.Response verifySMS(
            HttpSession httpSession,
            @RequestBody SmsCertificate.Request request
    ){
        String sessionPhoneNumber = (String) httpSession.getAttribute("phoneNumber");
        String sessionCertNumber = (String) httpSession.getAttribute(
                "certificateCode");
        // 인증번호 다름
        if(!request.getCertNum().equals(sessionCertNumber)){
            return SmsCertificate.Response.builder()
                    .certificateResponse(FAIL)
                    .build();
        }
        // 시간 초과
        LocalDateTime verifyTime = (LocalDateTime) httpSession.getAttribute("verifyTime");
        Duration duration = Duration.between(verifyTime, LocalDateTime.now());
        if(duration.toMinutes() >= 5){
            httpSession.invalidate();
            return SmsCertificate.Response.builder()
                    .certificateResponse(FAIL)
                    .build();
        }
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
}
