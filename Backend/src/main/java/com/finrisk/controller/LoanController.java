package com.finrisk.controller;

import com.finrisk.dto.loan.LoanApplicationRequest;
import com.finrisk.model.LoanApplication;
import com.finrisk.repository.LoanApplicationRepository;
import com.finrisk.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;
    private final LoanApplicationRepository repository;

    @PostMapping("/predict")
    public ResponseEntity<LoanApplication> predict(Authentication auth, @RequestBody LoanApplicationRequest request) {
        String userId = auth.getName();
        LoanApplication application = loanService.predict(userId, request);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplication> getApplication(@PathVariable String id) {
        return repository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/history")
    public ResponseEntity<List<LoanApplication>> getHistory(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(repository.findByUserId(userId));
    }
}