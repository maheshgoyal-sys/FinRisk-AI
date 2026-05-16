package com.finrisk.controller;

import com.finrisk.model.User;
import com.finrisk.model.LoanApplication;
import com.finrisk.repository.UserRepository;
import com.finrisk.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final LoanApplicationRepository loanApplicationRepository;

    // Special endpoint to create admin (use secret key for security)
    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody Map<String, String> request) {
        String secretKey = request.get("secretKey");
        String email = request.get("email");

        // Secret key for admin creation (change in production)
        if (!"ADMIN_SECRET_2024".equals(secretKey)) {
            return ResponseEntity.status(403).build();
        }

        if (userRepository.existsByEmail(email)) {
            User user = userRepository.findByEmail(email).orElseThrow();
            user.setRole("ADMIN");
            return ResponseEntity.ok(userRepository.save(user));
        }

        return ResponseEntity.notFound().build();
    }

    // Endpoint to promote existing user to admin (public for testing - add auth in production)
    @PostMapping("/promote/{userId}")
    public ResponseEntity<User> promoteToAdmin(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setRole("ADMIN");
        user = userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(userRepository.findById(userId).orElseThrow());
    }

    @PutMapping("/users/{userId}/verify")
    public ResponseEntity<User> updateVerification(
            @PathVariable String userId,
            @RequestBody Map<String, String> request) {

        String field = request.get("field");
        String status = request.get("status");

        User user = userRepository.findById(userId).orElseThrow();

        switch (field) {
            case "aadhaar":
                user.setAadhaarStatus(status);
                break;
            case "pan":
                user.setPanStatus(status);
                break;
            case "address":
                user.setAddressStatus(status);
                break;
            case "photo":
                user.setPhotoStatus(status);
                break;
        }

        // Update overall KYC status
        boolean allVerified = "VERIFIED".equals(user.getAadhaarStatus()) &&
                              "VERIFIED".equals(user.getPanStatus()) &&
                              "VERIFIED".equals(user.getAddressStatus()) &&
                              "VERIFIED".equals(user.getPhotoStatus());

        boolean anyRejected = "REJECTED".equals(user.getAadhaarStatus()) ||
                             "REJECTED".equals(user.getPanStatus()) ||
                             "REJECTED".equals(user.getAddressStatus()) ||
                             "REJECTED".equals(user.getPhotoStatus());

        if (allVerified) {
            user.setKycStatus("VERIFIED");
        } else if (anyRejected) {
            user.setKycStatus("REJECTED");
        } else {
            user.setKycStatus("PENDING");
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<LoanApplication>> getAllApplications() {
        return ResponseEntity.ok(loanApplicationRepository.findAll());
    }

    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<LoanApplication> getApplication(@PathVariable String applicationId) {
        return ResponseEntity.ok(loanApplicationRepository.findById(applicationId).orElseThrow());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<User> users = userRepository.findAll();
        List<LoanApplication> applications = loanApplicationRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalApplications", applications.size());
        stats.put("pendingKyc", users.stream().filter(u -> "PENDING".equals(u.getKycStatus())).count());
        stats.put("verifiedUsers", users.stream().filter(u -> "VERIFIED".equals(u.getKycStatus())).count());
        stats.put("approvedApplications", applications.stream().filter(a -> "APPROVED".equals(a.getStatus())).count());
        stats.put("rejectedApplications", applications.stream().filter(a -> "REJECTED".equals(a.getStatus())).count());
        stats.put("pendingApplications", applications.stream().filter(a -> "PENDING".equals(a.getStatus())).count());

        return ResponseEntity.ok(stats);
    }
}