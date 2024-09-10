package com.example.test.Controller;

import com.example.test.Service.UserService;
import com.example.test.dto.*;
import com.example.test.exception.CertificationException;
import com.example.test.exception.UserException;
import com.example.test.type.BaseResponse;
import com.example.test.type.CertificateResponse;
import com.example.test.type.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.swing.text.html.HTML;

@Controller
@ResponseBody
public class MainController {
    private final UserService userService;

    private final SmsCertificateController smsCertificateController;
    private final HttpSession httpSession;

    public MainController(UserService userService, SmsCertificateController smsCertificateController, HttpSession httpSession) {
        this.userService = userService;
        this.smsCertificateController = smsCertificateController;
        this.httpSession = httpSession;
    }

    // 사용자 이름, 이메일주소로 찾기
    // -> 아이디 제공
    @PostMapping("/getId/request")
    public SmsSend.Response findIdRequest(
            HttpSession session,
        @RequestBody FindUserInfo.Request request
    ){
        UserProfileDTO user = userService.findId(request.getUserName(), request.getEmail());
        if(!user.getPhoneNum().equals(request.getPhoneNumber())){
            throw new UserException(ErrorCode.USER_NOT_MATCH);
        }
        SmsSend.Response response = smsCertificateController.sendSMS(new SmsSend.Request(request.getPhoneNumber()));
        return response;
    }

    // 비밀번호 찾기 -> 인증번호 확인
    @PostMapping("/getId/verify")
    public FindUserInfo.Response findIdVerify(
            @RequestBody FindUserInfo.Request request
    ){
        System.out.println(request.getUserName()+" "+request.getEmail());
        UserProfileDTO user = userService.findId(request.getUserName(), request.getEmail());

        SmsCertificate.Request certReq = new SmsCertificate.Request();
        certReq.setCertNum(request.getCertNum());
        SmsCertificate.Response response =
                smsCertificateController.verifySMS(certReq);
        if(response.getCertificateResponse() != CertificateResponse.OK){
            throw new CertificationException(ErrorCode.VERIFY_CODE_NOT_MATCH);
        }

        return new FindUserInfo.Response().builder()
                .userId(user.getUserId())
                .certificateResponse(response.getCertificateResponse())
                .build();
    }

    // 비밀번호 찾기 -> 인증메세지 전송
    @PostMapping("/getPassword/request")
    public SmsSend.Response findPasswordRequest(
            HttpSession session,
            @RequestBody FindUserInfo.Request request
    ){
        userService.findUserbyUserId(request.getUserId());
        // sms컨트롤러를 통해서 인증
        SmsSend.Response response = smsCertificateController.sendSMS(
                new SmsSend.Request(request.getPhoneNumber()));
        return response;
    }

    // 비밀번호 찾기 -> 인증번호 확인
    @PostMapping("/getPassword/verify")
    public FindUserInfo.Response findPasswordVerify(
            HttpSession session,
            @RequestBody FindUserInfo.Request request
    ){
        SmsCertificate.Request certReq = new SmsCertificate.Request();
        certReq.setCertNum(request.getCertNum());
        SmsCertificate.Response response =
                smsCertificateController.verifySMS(certReq);

        return new FindUserInfo.Response().builder()
                .certificateResponse(response.getCertificateResponse())
                .build();
    }

    // 비밀번호 찾기 -> 비밀번호 수정
    @PostMapping("/getPassword/reset")
    public ResetPassword.Response passwordReset(
            HttpSession session,
            @RequestBody ResetPassword.Request request
    ){
        return ResetPassword.Response.from(userService.updatePassword(request, session));
    }

    /* 메인페이지 로그아웃 */
    @GetMapping("/logout.do")
    public ResponseEntity<?> logoutMainGET(HttpServletRequest request) throws Exception{
        HttpSession session = request.getSession();
        session.invalidate();

        return ResponseEntity.ok("로그아웃 성공");

    }

}
