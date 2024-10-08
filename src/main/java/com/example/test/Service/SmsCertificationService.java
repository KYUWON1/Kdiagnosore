package com.example.test.Service;

import io.github.cdimascio.dotenv.Dotenv;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.model.MessageStatusType;
import net.nurigo.sdk.message.service.DefaultMessageService;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class SmsCertificationService {
    private final Dotenv dotenv = Dotenv.load();

    private String smsApiKey = dotenv.get("SMS_API_KEY");
    private String smsApiSecret = dotenv.get("SMS_API_SECRET");
    private String numFrom = dotenv.get("SMS_PHONE_NUMBER");

    DefaultMessageService messageService =  NurigoApp.INSTANCE.initialize(smsApiKey, smsApiSecret, "https://api.coolsms.co.kr");



    public void sendMessage(String toNumber, String randomNumber) {
        // Message 패키지가 중복될 경우 net.nurigo.sdk.message.model.Message로 치환하여 주세요
        Message message = new Message();
        message.setFrom(numFrom);
        message.setTo(toNumber);
        message.setText("(K-Diagnosore) 휴대폰 인증번호: "+randomNumber);

        try {
            // send 메소드로 ArrayList<Message> 객체를 넣어도 동작합니다!
            messageService.send(message);
        } catch (NurigoMessageNotReceivedException exception) {
            // 발송에 실패한 메시지 목록을 확인할 수 있습니다!
            System.out.println(exception.getFailedMessageList());
            System.out.println(exception.getMessage());
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
        }
    }
}
