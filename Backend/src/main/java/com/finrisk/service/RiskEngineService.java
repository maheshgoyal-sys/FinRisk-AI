package com.finrisk.service;

import com.finrisk.model.RiskAnalysis;
import com.finrisk.repository.RiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiskEngineService {

    private final RiskAnalysisRepository riskAnalysisRepository;

    public RiskAnalysis analyzeRisk(String userId, String applicationId,
                                      Double monthlyIncome, Double loanAmount,
                                      Double existingEmis, Integer creditScore,
                                      Integer employmentYears, Double assets, Double liabilities) {

        log.info("Performing risk analysis for user: {}, application: {}", userId, applicationId);

        RiskAnalysis analysis = new RiskAnalysis();
        analysis.setUserId(userId);
        analysis.setApplicationId(applicationId);
        analysis.setCreatedAt(LocalDateTime.now());

        // Calculate DTI (Debt-to-Income Ratio)
        Double dti = calculateDTI(existingEmis, monthlyIncome);
        analysis.setDti(dti);

        // Calculate FOIR (Fixed Obligation Income Ratio)
        // Assuming monthly EMI roughly 15% of loan amount for calculation
        Double proposedEmi = calculateEmi(loanAmount);
        Double foir = calculateFoir(existingEmis, proposedEmi, monthlyIncome);
        analysis.setFoir(foir);

        // Calculate overall risk score (0-100)
        Double riskScore = calculateRiskScore(creditScore, dti, foir, employmentYears, assets, liabilities);
        analysis.setRiskScore(riskScore);

        // Determine risk level
        String riskLevel = determineRiskLevel(riskScore);
        analysis.setRiskLevel(riskLevel);

        // Check eligibility
        Boolean isEligible = checkEligibility(dti, foir, creditScore, riskScore);
        analysis.setIsEligible(isEligible);

        // Calculate approval probability
        Double approvalProbability = calculateApprovalProbability(riskScore, isEligible);
        analysis.setApprovalProbability(approvalProbability);

        // Suggest interest rate based on risk
        Double suggestedRate = calculateSuggestedInterestRate(riskScore);
        analysis.setSuggestedInterestRate(suggestedRate);

        // Generate positive and negative factors
        List<String> positiveFactors = new ArrayList<>();
        List<String> negativeFactors = new ArrayList<>();
        generateFactors(creditScore, dti, foir, employmentYears, assets, liabilities, positiveFactors, negativeFactors);
        analysis.setPositiveFactors(positiveFactors);
        analysis.setNegativeFactors(negativeFactors);

        // Generate AI explanation
        String explanation = generateExplanation(riskScore, riskLevel, isEligible, positiveFactors, negativeFactors);
        analysis.setAiExplanation(explanation);

        return riskAnalysisRepository.save(analysis);
    }

    private Double calculateDTI(Double existingEmis, Double monthlyIncome) {
        if (monthlyIncome == null || monthlyIncome == 0) return 100.0;
        return (existingEmis / monthlyIncome) * 100;
    }

    private Double calculateEmi(Double loanAmount) {
        // Simplified EMI calculation (assuming 12% interest, 36 months)
        double principal = loanAmount;
        double rate = 12.0 / 12 / 100;
        int months = 36;
        return (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    }

    private Double calculateFoir(Double existingEmis, Double proposedEmi, Double monthlyIncome) {
        if (monthlyIncome == null || monthlyIncome == 0) return 100.0;
        double totalObligations = (existingEmis != null ? existingEmis : 0) + (proposedEmi != null ? proposedEmi : 0);
        return (totalObligations / monthlyIncome) * 100;
    }

    private Double calculateRiskScore(Integer creditScore, Double dti, Double foir,
                                        Integer employmentYears, Double assets, Double liabilities) {
        double score = 50.0;

        // Credit score contribution (0-30 points)
        if (creditScore != null) {
            score += (creditScore - 500) * 0.06;
        }

        // DTI contribution (0-20 points, lower is better)
        if (dti != null) {
            if (dti < 20) score += 20;
            else if (dti < 40) score += 10;
            else if (dti < 50) score += 0;
            else score -= 20;
        }

        // FOIR contribution (0-15 points, lower is better)
        if (foir != null) {
            if (foir < 30) score += 15;
            else if (foir < 50) score += 5;
            else score -= 10;
        }

        // Employment years (0-15 points)
        if (employmentYears != null) {
            score += Math.min(employmentYears * 2, 15);
        }

        // Asset to liability ratio (0-20 points)
        if (liabilities != null && liabilities > 0 && assets != null) {
            double ratio = assets / liabilities;
            if (ratio > 10) score += 20;
            else if (ratio > 5) score += 15;
            else if (ratio > 2) score += 10;
            else if (ratio > 1) score += 5;
            else score -= 10;
        }

        return Math.max(0, Math.min(100, score));
    }

    private String determineRiskLevel(Double riskScore) {
        if (riskScore >= 75) return "LOW";
        else if (riskScore >= 50) return "MEDIUM";
        else return "HIGH";
    }

    private Boolean checkEligibility(Double dti, Double foir, Integer creditScore, Double riskScore) {
        if (dti != null && dti > 50) return false;
        if (foir != null && foir > 60) return false;
        if (creditScore != null && creditScore < 500) return false;
        if (riskScore != null && riskScore < 30) return false;
        return true;
    }

    private Double calculateApprovalProbability(Double riskScore, Boolean isEligible) {
        if (!isEligible) return riskScore * 0.5;
        return Math.min(95, riskScore);
    }

    private Double calculateSuggestedInterestRate(Double riskScore) {
        // Base rate 8%, adjusted by risk
        double baseRate = 8.0;
        if (riskScore >= 80) return baseRate;
        else if (riskScore >= 60) return baseRate + 2;
        else if (riskScore >= 40) return baseRate + 4;
        else return baseRate + 7;
    }

    private void generateFactors(Integer creditScore, Double dti, Double foir,
                                  Integer employmentYears, Double assets, Double liabilities,
                                  List<String> positive, List<String> negative) {
        if (creditScore != null) {
            if (creditScore >= 750) positive.add("Excellent credit score (" + creditScore + ")");
            else if (creditScore >= 650) positive.add("Good credit score (" + creditScore + ")");
            else negative.add("Low credit score (" + creditScore + ")");
        }

        if (dti != null) {
            if (dti < 30) positive.add("Healthy debt-to-income ratio (" + String.format("%.1f", dti) + "%)");
            else if (dti > 50) negative.add("High debt-to-income ratio (" + String.format("%.1f", dti) + "%)");
        }

        if (foir != null) {
            if (foir < 40) positive.add("Good FOIR ratio (" + String.format("%.1f", foir) + "%)");
            else negative.add("High fixed obligations (" + String.format("%.1f", foir) + "%)");
        }

        if (employmentYears != null) {
            if (employmentYears >= 3) positive.add("Stable employment (" + employmentYears + " years)");
            else negative.add("Limited work experience (" + employmentYears + " years)");
        }

        if (assets != null && liabilities != null && assets > liabilities) {
            double ratio = assets / liabilities;
            positive.add("Strong asset position (" + String.format("%.1f", ratio) + "x assets/liabilities)");
        }
    }

    private String generateExplanation(Double riskScore, String riskLevel, Boolean isEligible,
                                         List<String> positiveFactors, List<String> negativeFactors) {
        StringBuilder explanation = new StringBuilder();
        explanation.append("Risk Assessment Summary: ");
        explanation.append("Your application has been classified as ").append(riskLevel).append(" risk ");
        explanation.append("(Score: ").append(String.format("%.0f", riskScore)).append("/100). ");

        if (isEligible) {
            explanation.append("Based on the analysis, you meet our eligibility criteria. ");
        } else {
            explanation.append("Unfortunately, the application does not meet our current eligibility requirements. ");
        }

        if (!positiveFactors.isEmpty()) {
            explanation.append("Positive factors include: ");
            explanation.append(String.join(", ", positiveFactors.subList(0, Math.min(3, positiveFactors.size()))));
            explanation.append(". ");
        }

        if (!negativeFactors.isEmpty()) {
            explanation.append("Areas of concern: ");
            explanation.append(String.join(", ", negativeFactors.subList(0, Math.min(2, negativeFactors.size()))));
            explanation.append(".");
        }

        return explanation.toString();
    }

    public RiskAnalysis getAnalysisByApplicationId(String applicationId) {
        return riskAnalysisRepository.findByApplicationId(applicationId).orElse(null);
    }

    public RiskAnalysis getLatestAnalysisForUser(String userId) {
        List<RiskAnalysis> analyses = riskAnalysisRepository.findByUserId(userId);
        return analyses.isEmpty() ? null : analyses.get(analyses.size() - 1);
    }
}