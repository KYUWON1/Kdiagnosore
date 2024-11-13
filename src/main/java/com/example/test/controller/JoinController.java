package com.example.test.controller;

import com.example.test.Service.JoinService;
import com.example.test.dto.JoinDTO;
import com.example.test.dto.ProtectorJoinDto;
import com.example.test.dto.UserExist;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@ResponseBody
@RequestMapping("/api/v1/join")
public class JoinController {

    private final JoinService joinService;

    //생성자 주입 방식 사용
    public JoinController(JoinService joinService){
        this.joinService = joinService;
    }

    @PostMapping("/user")
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

    @PostMapping("/protector")
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

    @GetMapping("/check-user")
    public UserExist.Response checkUserExist(
            @RequestParam String userName,
            @RequestParam String phoneNumber
            ){
        joinService.findUser(userName,phoneNumber);
        return new UserExist.Response(userName,
                phoneNumber);
    }

}
