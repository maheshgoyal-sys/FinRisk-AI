package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "risk_analysis")
public class RiskAnalysis {
    @Id
    private String id;
    private String userId;
    private String applicationId;
    private Double riskScore;
    private String riskLevel;
    private Double dti;
    private Double foir;
    private Boolean isEligible;
    private Double suggestedInterestRate;
    private Double approvalProbability;
    private List<String> positiveFactors;
    private List<String> negativeFactors;
    private String aiExplanation;
    private Map<String, Object> eligibilityDetails;
    private LocalDateTime createdAt;
}