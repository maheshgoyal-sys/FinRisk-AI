package com.finrisk.service;

import com.finrisk.model.LoanApplication;
import com.finrisk.model.User;
import com.finrisk.repository.LoanApplicationRepository;
import com.finrisk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LoanApplicationRepository applicationRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<LoanApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Map<String, Object> getAnalytics() {

        List<LoanApplication> applications = applicationRepository.findAll();

        long totalUsers = userRepository.count();
        long totalApplications = applications.size();

        long approved = applications.stream()
                .filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus()))
                .count();

        long rejected = applications.stream()
                .filter(a -> "REJECTED".equalsIgnoreCase(a.getStatus()))
                .count();

        long pending = applications.stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus()))
                .count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", totalUsers);
        analytics.put("totalApplications", totalApplications);
        analytics.put("approved", approved);
        analytics.put("rejected", rejected);
        analytics.put("pending", pending);

        return analytics;
    }

    public List<Map<String, Object>> getFraudAlerts() {

        List<LoanApplication> applications = applicationRepository.findAll();

        return applications.stream()
                .filter(app ->
                        app.getMlResponse() != null &&
                        "HIGH".equalsIgnoreCase(app.getMlResponse().getRiskLevel())
                )
                .map(app -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("id", app.getId());
                    alert.put("userId", app.getUserId());
                    alert.put("description", "High risk application detected");
                    alert.put("severity", "HIGH");
                    alert.put("timestamp", app.getCreatedAt());
                    return alert;
                })
                .toList();
    }

    public User updateUserRole(String id, String role) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role.toUpperCase());

        return userRepository.save(user);
    }
}