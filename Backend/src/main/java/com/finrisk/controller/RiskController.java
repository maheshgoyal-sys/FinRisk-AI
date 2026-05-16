package com.finrisk.controller;

import com.finrisk.model.RiskAnalysis;
import com.finrisk.service.RiskEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class RiskController {

    private final RiskEngineService riskEngineService;

    @PostMapping("/analyze")
    public ResponseEntity<RiskAnalysis> analyzeRisk(
            Authentication auth,
            @RequestBody Map<String, Object> request) {
        String userId = auth.getName();
        String applicationId = (String) request.get("applicationId");
        Double monthlyIncome = request.get("monthlyIncome") != null ?
                ((Number) request.get("monthlyIncome")).doubleValue() : null;
        Double loanAmount = request.get("loanAmount") != null ?
                ((Number) request.get("loanAmount")).doubleValue() : null;
        Double existingEmis = request.get("existingEmis") != null ?
                ((Number) request.get("existingEmis")).doubleValue() : null;
        Integer creditScore = request.get("creditScore") != null ?
                ((Number) request.get("creditScore")).intValue() : null;
        Integer employmentYears = request.get("employmentYears") != null ?
                ((Number) request.get("employmentYears")).intValue() : null;
        Double assets = request.get("assets") != null ?
                ((Number) request.get("assets")).doubleValue() : null;
        Double liabilities = request.get("liabilities") != null ?
                ((Number) request.get("liabilities")).doubleValue() : null;

        return ResponseEntity.ok(riskEngineService.analyzeRisk(
                userId, applicationId, monthlyIncome, loanAmount, existingEmis,
                creditScore, employmentYears, assets, liabilities));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<RiskAnalysis> getAnalysisByApplication(@PathVariable String applicationId) {
        return ResponseEntity.ok(riskEngineService.getAnalysisByApplicationId(applicationId));
    }

    @GetMapping("/latest")
    public ResponseEntity<RiskAnalysis> getLatestAnalysis(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(riskEngineService.getLatestAnalysisForUser(userId));
    }
}