package com.finrisk.controller;

import com.finrisk.model.LoanApplication;
import com.finrisk.model.User;
import com.finrisk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(Authentication auth, @RequestBody User updates) {
        String userId = auth.getName();
        return ResponseEntity.ok(userService.updateProfile(userId, updates));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<LoanApplication>> getApplications(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(userService.getApplications(userId));
    }
}