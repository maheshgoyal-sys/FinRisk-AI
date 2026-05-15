package com.finrisk.dto.loan;

import lombok.Data;
import java.util.Map;

@Data
public class LoanApplicationRequest {
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
}