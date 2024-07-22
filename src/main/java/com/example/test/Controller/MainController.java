package com.example.test.Controller;

import com.example.test.Service.UserService;
import com.example.test.dto.FindUserInfo;
import com.example.test.dto.SmsCertificate;
import com.example.test.dto.SmsSend;
import com.example.test.dto.UserProfileDTO;
import com.example.test.exception.UserException;
import com.example.test.type.CertificateResponse;
import com.example.test.type.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.Iterator;

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
    @PostMapping("/getId")
    public FindUserInfo.Response findId(
        @RequestBody FindUserInfo.Request request
    ){
        System.out.println(request.getUserName()+" "+request.getEmail());
        UserProfileDTO user
                = userService.findId(request.getUserName(), request.getEmail());
        return new FindUserInfo.Response().idFrom(user);
    }

    // 사용자아아디, 휴대폰인증으로 비밀번호 찾기
    // -> 비밀번호 제공 및 수정
    @PostMapping("/getPassword/request")
    public SmsSend.Response findPasswordRequest(
            HttpSession session,
            @RequestBody FindUserInfo.Request request
    ){
        UserProfileDTO user
                = userService.findPassword(request.getUserId());
        // sms컨트롤러를 통해서 인증
        SmsSend.Response response = smsCertificateController.sendSMS(session,
                new SmsSend.Request(request.getPhoneNumber()));

        return response;
    }

    // 사용자아아디, 휴대폰인증으로 비밀번호 찾기
    // -> 비밀번호 제공 및 수정
    @PostMapping("/getPassword/verify")
    public FindUserInfo.Response findPasswordVerify(
            HttpSession session,
            @RequestBody FindUserInfo.Request request
    ){
        SmsCertificate.Request certReq = new SmsCertificate.Request();
        certReq.setCertNum(request.getCertNum());
        SmsCertificate.Response response =
                smsCertificateController.verifySMS(
                        session,certReq);
        if(response.getCertificateResponse() == CertificateResponse.FAIL){
           throw new UserException(ErrorCode.VERIFY_CODE_NOT_MATCH);
        }
        UserProfileDTO user
                = userService.findPassword(request.getUserId());
        return new FindUserInfo.Response().builder()
                .userId(user.getUserId())
                .password(user.getPassword())
                .build();
    }

    /* 메인페이지 로그아웃 */
    @GetMapping("/logout.do")
    public ResponseEntity<?> logoutMainGET(HttpServletRequest request) throws Exception{
        HttpSession session = request.getSession();
        session.invalidate();

        return ResponseEntity.ok("로그아웃 성공");

    }

}
