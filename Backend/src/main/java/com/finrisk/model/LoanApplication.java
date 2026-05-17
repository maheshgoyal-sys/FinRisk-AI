package com.finrisk.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "loan-applications")
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

    public static class MLResponse {
        private boolean approved;
        private double confidence;
        private String riskLevel;
        private Map<String, Object> loanDetails;

        public boolean isApproved() { return approved; }
        public void setApproved(boolean approved) { this.approved = approved; }

        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }

        public String getRiskLevel() { return riskLevel; }
        public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

        public Map<String, Object> getLoanDetails() { return loanDetails; }
        public void setLoanDetails(Map<String, Object> loanDetails) { this.loanDetails = loanDetails; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public double getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(double monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public int getEmploymentYears() { return employmentYears; }
    public void setEmploymentYears(int employmentYears) { this.employmentYears = employmentYears; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public double getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(double annualIncome) { this.annualIncome = annualIncome; }

    public double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(double loanAmount) { this.loanAmount = loanAmount; }

    public String getLoanPurpose() { return loanPurpose; }
    public void setLoanPurpose(String loanPurpose) { this.loanPurpose = loanPurpose; }

    public int getTenure() { return tenure; }
    public void setTenure(int tenure) { this.tenure = tenure; }

    public double getExistingEmis() { return existingEmis; }
    public void setExistingEmis(double existingEmis) { this.existingEmis = existingEmis; }

    public Map<String, Double> getAssets() { return assets; }
    public void setAssets(Map<String, Double> assets) { this.assets = assets; }

    public Map<String, Double> getLiabilities() { return liabilities; }
    public void setLiabilities(Map<String, Double> liabilities) { this.liabilities = liabilities; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getCreditScore() { return creditScore; }
    public void setCreditScore(int creditScore) { this.creditScore = creditScore; }

    public double getDti() { return dti; }
    public void setDti(double dti) { this.dti = dti; }

    public double getFoir() { return foir; }
    public void setFoir(double foir) { this.foir = foir; }

    public MLResponse getMlResponse() { return mlResponse; }
    public void setMlResponse(MLResponse mlResponse) { this.mlResponse = mlResponse; }

    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}