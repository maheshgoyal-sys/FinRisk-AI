package com.finrisk.service;

import com.finrisk.dto.loan.LoanApplicationRequest;
import com.finrisk.model.LoanApplication;
import com.finrisk.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanService {

    private final LoanApplicationRepository repository;
    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public LoanApplication predict(String userId, LoanApplicationRequest request) {
        double totalAssets = sumValues(request.getAssets());
        double totalLiabilities = sumValues(request.getLiabilities());

        double dti = calculateDTI(request.getMonthlyIncome(), request.getExistingEmis());
        double foir = calculateFOIR(request.getMonthlyIncome(), request.getExistingEmis(), request.getLoanAmount(), request.getTenure());
        int creditScore = estimateCreditScore(request);

        LoanApplication application = new LoanApplication();
        application.setUserId(userId);
        application.setFullName(request.getFullName());
        application.setDateOfBirth(request.getDateOfBirth());
        application.setGender(request.getGender());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setMonthlyIncome(request.getMonthlyIncome());
        application.setEmploymentType(request.getEmploymentType());
        application.setEmploymentYears(request.getEmploymentYears());
        application.setCompanyName(request.getCompanyName());
        application.setAnnualIncome(request.getAnnualIncome());
        application.setLoanAmount(request.getLoanAmount());
        application.setLoanPurpose(request.getLoanPurpose());
        application.setTenure(request.getTenure());
        application.setExistingEmis(request.getExistingEmis());
        application.setAssets(request.getAssets());
        application.setLiabilities(request.getLiabilities());
        application.setCreditScore(creditScore);
        application.setDti(dti);
        application.setFoir(foir);
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        try {
            Map<String, Object> mlRequest = new HashMap<>();
            mlRequest.put("income", request.getMonthlyIncome());
            mlRequest.put("loan_amount", request.getLoanAmount());
            mlRequest.put("credit_score", creditScore);
            mlRequest.put("age", calculateAge(request.getDateOfBirth()));
            mlRequest.put("employment_years", request.getEmploymentYears());
            mlRequest.put("existing_emis", request.getExistingEmis());
            mlRequest.put("assets", totalAssets);
            mlRequest.put("liabilities", totalLiabilities);

            Map<String, Object> mlResponse = restTemplate.postForObject(
                mlServiceUrl + "/predict",
                mlRequest,
                Map.class
            );

            if (mlResponse != null) {
                LoanApplication.MLResponse response = new LoanApplication.MLResponse();
                response.setApproved((Boolean) mlResponse.get("approved"));
                response.setConfidence((Double) mlResponse.get("confidence"));
                response.setRiskLevel((String) mlResponse.get("risk_level"));
                application.setMlResponse(response);
                application.setStatus(response.isApproved() ? "APPROVED" : "REJECTED");
                application.setAiExplanation((String) mlResponse.get("explanation"));
            }
        } catch (Exception e) {
            log.error("ML service unavailable, using fallback logic", e);
            applyFallbackLogic(application, dti, foir, creditScore, totalAssets, totalLiabilities);
        }

        return repository.save(application);
    }

    private void applyFallbackLogic(LoanApplication app, double dti, double foir, int creditScore, double totalAssets, double totalLiabilities) {
        double score = calculateRiskScore(creditScore, app.getEmploymentYears(), totalAssets, totalLiabilities, dti);
        boolean approved = score >= 50 && dti < 50 && foir < 50;

        LoanApplication.MLResponse response = new LoanApplication.MLResponse();
        response.setApproved(approved);
        response.setConfidence(score / 100.0);
        response.setRiskLevel(score >= 70 ? "LOW" : (score >= 50 ? "MEDIUM" : "HIGH"));
        app.setMlResponse(response);
        app.setStatus(approved ? "APPROVED" : "REJECTED");

        StringBuilder explanation = new StringBuilder();
        explanation.append("Based on our analysis: ");
        explanation.append("Credit score assessment (").append(creditScore >= 700 ? "Good" : creditScore >= 600 ? "Fair" : "Needs improvement").append("), ");
        explanation.append("Debt-to-income ratio (").append(String.format("%.1f", dti)).append("%), ");
        explanation.append("Employment stability (").append(app.getEmploymentYears()).append(" years). ");
        if (approved) {
            explanation.append("Your profile meets our lending criteria.");
        } else {
            explanation.append("Consider improving your credit score or reducing existing debts.");
        }
        app.setAiExplanation(explanation.toString());
    }

    private double calculateDTI(double income, double emi) {
        if (income <= 0) return 100;
        return Math.min((emi / income) * 100, 100);
    }

    private double calculateFOIR(double income, double existingEmis, double loanAmount, int tenure) {
        if (income <= 0) return 100;
        double monthlyEMI = calculateEMI(loanAmount, tenure);
        return Math.min(((existingEmis + monthlyEMI) / income) * 100, 100);
    }

    private double calculateEMI(double principal, int tenure) {
        double rate = 0.12 / 12;
        return (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    }

    private int estimateCreditScore(LoanApplicationRequest req) {
        int base = 550;
        if (req.getMonthlyIncome() > 50000) base += 100;
        if (req.getEmploymentYears() > 3) base += 50;
        double ratio = sumValues(req.getAssets()) / Math.max(sumValues(req.getLiabilities()), 1);
        if (ratio > 2) base += 100;
        return Math.min(base + (int)(Math.random() * 100), 850);
    }

    private int calculateAge(String dob) {
        if (dob == null || dob.isEmpty()) return 30;
        try {
            int year = Integer.parseInt(dob.substring(0, 4));
            return 2024 - year;
        } catch (Exception e) {
            return 30;
        }
    }

    private double calculateRiskScore(int creditScore, int employmentYears, double assets, double liabilities, double dti) {
        double score = creditScore / 8.5;
        score += Math.min(employmentYears * 2, 20);
        score += Math.min(assets / 100000, 10);
        score -= Math.min(liabilities / 10000, 10);
        if (dti > 40) score -= (dti - 40) * 2;
        return Math.max(0, Math.min(score, 100));
    }

    private double sumValues(Map<String, Double> map) {
        if (map == null) return 0;
        return map.values().stream().mapToDouble(Double::doubleValue).sum();
    }
}