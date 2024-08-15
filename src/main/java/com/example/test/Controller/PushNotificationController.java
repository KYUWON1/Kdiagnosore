package com.example.test.Controller;

import com.example.test.Service.PushNotificationService;
import com.example.test.dto.PushNotificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class PushNotificationController {

    @Autowired
    private PushNotificationService pushNotificationService;

    @PostMapping("/send")
    public String sendNotification(@RequestBody PushNotificationRequest request) {
        pushNotificationService.sendPushNotification(request);
        return "Notification sent successfully!";
    }
}
