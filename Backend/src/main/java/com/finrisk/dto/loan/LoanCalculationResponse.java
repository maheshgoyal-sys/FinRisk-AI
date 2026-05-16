package com.finrisk.dto.loan;

import lombok.Data;
import java.util.List;

@Data
public class LoanCalculationResponse {
    private Double loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private Double monthlyEmi;
    private Double totalInterest;
    private Double totalPayment;
    private Double processingFee;
    private Double totalCost;
    private Double principalAmount;
    private List<AmortizationEntry> amortizationSchedule;
    private Boolean isEligible;
    private String eligibilityReason;
    private Double maxEligibleAmount;
}