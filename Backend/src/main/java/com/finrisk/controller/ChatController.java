package com.finrisk.controller;

import com.finrisk.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @RequestBody Map<String, String> request,
            @RequestParam(required = false) String userId) {
        String message = request.get("message");
        String uid = request.get("userId") != null ? request.get("userId") : userId;
        return ResponseEntity.ok(chatService.processMessage(uid, message));
    }
}