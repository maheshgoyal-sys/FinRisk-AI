package com.finrisk.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "loan_applications")
public class LoanApplication {
    @Id
    private String id;
    private String userId;
    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String email;
    private String phone;
    private double monthlyIncome;
    private String employmentType;
    private int employmentYears;
    private String companyName;
    private double annualIncome;
    private double loanAmount;
    private String loanPurpose;
    private int tenure;
    private double existingEmis;
    private Map<String, Double> assets;
    private Map<String, Double> liabilities;
    private String status = "PENDING";
    private int creditScore;
    private double dti;
    private double foir;
    private MLResponse mlResponse;
    private String aiExplanation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class MLResponse {
        private boolean approved;
        private double confidence;
        private String riskLevel;
    }
}