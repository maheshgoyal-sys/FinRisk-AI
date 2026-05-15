package com.finrisk.service;

import com.finrisk.model.LoanApplication;
import com.finrisk.model.User;
import com.finrisk.repository.LoanApplicationRepository;
import com.finrisk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final LoanApplicationRepository applicationRepository;

    public User getProfile(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User updateProfile(String userId, User updates) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (updates.getFullName() != null) user.setFullName(updates.getFullName());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());
        return userRepository.save(user);
    }

    public List<LoanApplication> getApplications(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}