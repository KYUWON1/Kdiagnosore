package com.example.test.Controller;

import com.example.test.Service.JoinService;
import com.example.test.dto.JoinDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@Controller
@ResponseBody
public class JoinController {

    private final JoinService joinService;

    //생성자 주입 방식 사용
    public JoinController(JoinService joinService){
        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinProcess(@RequestBody JoinDTO joinDTO){
        try{
            JoinDTO data = joinService.joinProcess(joinDTO);
            return ResponseEntity.ok(data);
        }catch(IllegalArgumentException ex){
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("success", false);
            errorDetails.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(errorDetails);
        }catch(RuntimeException ex){
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("success", false);
            errorDetails.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(errorDetails);
        }

    }

    // 예외 처리 핸들러를 별도로 정의할 수 있습니다.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex, WebRequest request) {
        // 전역적 예외 처리를 위한 메시지
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
    }
}
