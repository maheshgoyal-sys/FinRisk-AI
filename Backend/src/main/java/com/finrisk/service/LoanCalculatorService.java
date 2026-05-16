package com.finrisk.service;

import com.finrisk.dto.loan.AmortizationEntry;
import com.finrisk.dto.loan.LoanCalculationRequest;
import com.finrisk.dto.loan.LoanCalculationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class LoanCalculatorService {

    public LoanCalculationResponse calculate(LoanCalculationRequest request) {
        LoanCalculationResponse response = new LoanCalculationResponse();
        response.setLoanAmount(request.getLoanAmount());
        response.setInterestRate(request.getInterestRate());
        response.setTenureMonths(request.getTenureMonths());
        response.setProcessingFee(request.getProcessingFee() != null ? request.getProcessingFee() : 0.0);

        double principal = request.getLoanAmount();
        double annualRate = request.getInterestRate();
        int months = request.getTenureMonths();
        double processingFee = response.getProcessingFee();

        double monthlyRate = annualRate / 12 / 100;
        double emi;

        if (monthlyRate == 0) {
            emi = principal / months;
        } else {
            double pow = Math.pow(1 + monthlyRate, months);
            emi = principal * monthlyRate * pow / (pow - 1);
        }

        response.setMonthlyEmi(Math.round(emi * 100.0) / 100.0);

        double totalPayment = emi * months;
        double totalInterest = totalPayment - principal;

        response.setTotalInterest(Math.round(totalInterest * 100.0) / 100.0);
        response.setTotalPayment(Math.round(totalPayment * 100.0) / 100.0);
        response.setPrincipalAmount(principal);
        response.setTotalCost(Math.round((totalPayment + processingFee) * 100.0) / 100.0);

        List<AmortizationEntry> schedule = generateAmortizationSchedule(
                principal, monthlyRate, emi, months);
        response.setAmortizationSchedule(schedule);

        calculateEligibility(response, request);

        return response;
    }

    private List<AmortizationEntry> generateAmortizationSchedule(
            double principal, double monthlyRate, double emi, int months) {

        List<AmortizationEntry> schedule = new ArrayList<>();
        double balance = principal;
        double cumulativeInterest = 0;
        double cumulativePrincipal = 0;

        for (int month = 1; month <= months; month++) {
            double interestPart = balance * monthlyRate;
            double principalPart = emi - interestPart;

            if (month == months) {
                principalPart = balance;
                interestPart = emi - principalPart;
            }

            balance = Math.max(0, balance - principalPart);
            cumulativeInterest += interestPart;
            cumulativePrincipal += principalPart;

            AmortizationEntry entry = new AmortizationEntry();
            entry.setMonth(month);
            entry.setPrincipal(Math.round(principalPart * 100.0) / 100.0);
            entry.setInterest(Math.round(interestPart * 100.0) / 100.0);
            entry.setBalance(Math.round(balance * 100.0) / 100.0);
            entry.setCumulativeInterest(Math.round(cumulativeInterest * 100.0) / 100.0);
            entry.setCumulativePrincipal(Math.round(cumulativePrincipal * 100.0) / 100.0);

            schedule.add(entry);
        }

        return schedule;
    }

    private void calculateEligibility(LoanCalculationResponse response, LoanCalculationRequest request) {
        double annualIncome = request.getAnnualIncome() != null ? request.getAnnualIncome() : 0;
        int creditScore = request.getCreditScore() != null ? request.getCreditScore() : 0;
        double monthlyEmi = response.getMonthlyEmi();
        double monthlyIncome = annualIncome / 12;

        double foir = monthlyIncome > 0 ? (monthlyEmi / monthlyIncome) * 100 : 100;

        if (monthlyIncome == 0) {
            response.setIsEligible(false);
            response.setEligibilityReason("Income information required");
            response.setMaxEligibleAmount(0.0);
            return;
        }

        if (foir > 60) {
            response.setIsEligible(false);
            response.setEligibilityReason(String.format("FOIR ratio (%.1f%%) exceeds 60%%", foir));
            response.setMaxEligibleAmount(calculateMaxEligibleAmount(monthlyIncome, request.getInterestRate(), request.getTenureMonths()));
            return;
        }

        if (creditScore > 0 && creditScore < 500) {
            response.setIsEligible(false);
            response.setEligibilityReason("Credit score below 500");
            response.setMaxEligibleAmount(0.0);
            return;
        }

        double maxEmi = monthlyIncome * 0.5;
        double maxAmount = calculateMaxEligibleAmount(monthlyIncome, request.getInterestRate(), request.getTenureMonths());

        if (response.getMonthlyEmi() > maxEmi) {
            response.setIsEligible(false);
            response.setEligibilityReason(String.format("Max eligible: ₹%.0f", maxAmount));
            response.setMaxEligibleAmount(maxAmount);
        } else {
            response.setIsEligible(true);
            response.setEligibilityReason("Eligible for this loan");
            response.setMaxEligibleAmount(maxAmount);
        }
    }

    private double calculateMaxEligibleAmount(double monthlyIncome, double interestRate, int months) {
        double maxEmi = monthlyIncome * 0.5;
        double monthlyRate = interestRate / 12 / 100;

        if (monthlyRate == 0) return maxEmi * months;

        double pow = Math.pow(1 + monthlyRate, months);
        return maxEmi * (pow - 1) / (monthlyRate * pow);
    }

    public List<LoanCalculationResponse> compareLoans(List<LoanCalculationRequest> requests) {
        List<LoanCalculationResponse> comparisons = new ArrayList<>();
        for (LoanCalculationRequest request : requests) {
            comparisons.add(calculate(request));
        }
        return comparisons;
    }
}