package com.finrisk.controller;

import com.finrisk.dto.loan.LoanCalculationRequest;
import com.finrisk.dto.loan.LoanCalculationResponse;
import com.finrisk.service.LoanCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculator")
@RequiredArgsConstructor
public class LoanCalculatorController {

    private final LoanCalculatorService loanCalculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<LoanCalculationResponse> calculate(@RequestBody LoanCalculationRequest request) {
        return ResponseEntity.ok(loanCalculatorService.calculate(request));
    }

    @PostMapping("/compare")
    public ResponseEntity<List<LoanCalculationResponse>> compareLoans(@RequestBody List<LoanCalculationRequest> requests) {
        return ResponseEntity.ok(loanCalculatorService.compareLoans(requests));
    }

    @GetMapping("/eligibility")
    public ResponseEntity<LoanCalculationResponse> checkEligibility(
            @RequestParam Double annualIncome,
            @RequestParam Double loanAmount,
            @RequestParam Double interestRate,
            @RequestParam Integer tenureMonths,
            @RequestParam(required = false) Integer creditScore) {

        LoanCalculationRequest request = new LoanCalculationRequest();
        request.setAnnualIncome(annualIncome);
        request.setLoanAmount(loanAmount);
        request.setInterestRate(interestRate);
        request.setTenureMonths(tenureMonths);
        request.setCreditScore(creditScore);

        return ResponseEntity.ok(loanCalculatorService.calculate(request));
    }
}