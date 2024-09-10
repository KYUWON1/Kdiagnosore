package com.example.test.Controller;

import com.example.test.Service.JoinService;
import com.example.test.dto.JoinDTO;
import com.example.test.dto.ProtectorJoinDto;
import com.example.test.dto.UserExist;
import com.example.test.exception.JoinException;
import com.example.test.type.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping("/join/user")
    public ResponseEntity<?> userJoinProcess(@RequestBody JoinDTO joinDTO){
        try{
            JoinDTO data = joinService.userJoinProcess(joinDTO);
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

    @PostMapping("/join/protector")
    public ResponseEntity<?> protectorJoinProcess(
            @RequestBody ProtectorJoinDto protectorJoinDto
    ){
        try{
            JoinDTO data = joinService.protectorJoinProcess(protectorJoinDto);
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

    @GetMapping("/join/check-user")
    public UserExist.Response checkUserExist(
            @RequestParam String userName,
            @RequestParam String phoneNumber
            ){
        joinService.findUser(userName,phoneNumber);
        return new UserExist.Response(userName,
                phoneNumber);
    }

}
