package com.finrisk.controller;

import com.finrisk.model.LoanApplication;
import com.finrisk.model.User;
import com.finrisk.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // 🔒 protect all endpoints
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/applications")
    public ResponseEntity<List<LoanApplication>> getAllApplications() {
        return ResponseEntity.ok(adminService.getAllApplications());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/fraud-alerts")
    public ResponseEntity<List<Map<String, Object>>> getFraudAlerts() {
        return ResponseEntity.ok(adminService.getFraudAlerts());
    }

    @PutMapping("/user/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable String id,
            @RequestParam String role
    ) {
        User updatedUser = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }
}