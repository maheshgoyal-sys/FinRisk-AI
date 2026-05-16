package com.finrisk.dto.loan;

import lombok.Data;

@Data
public class LoanCalculationRequest {
    private Double loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private Double processingFee;
    private Double annualIncome;
    private Integer creditScore;
}