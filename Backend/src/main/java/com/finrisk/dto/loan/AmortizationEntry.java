package com.finrisk.dto.loan;

import lombok.Data;

@Data
public class AmortizationEntry {
    private Integer month;
    private Double principal;
    private Double interest;
    private Double balance;
    private Double cumulativeInterest;
    private Double cumulativePrincipal;
}