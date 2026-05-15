import numpy as np
from typing import Dict

class LoanPredictor:
    def __init__(self):
        self.base_interest_rate = 0.12  # 12% base rate
        self.min_rate = 0.08  # 8% for excellent profile
        self.max_rate = 0.18  # 18% for high risk

    def get_interest_rate(self, risk_score: float) -> float:
        if risk_score >= 70:
            return self.min_rate  # Best rate for low risk
        elif risk_score >= 50:
            return 0.10  # Medium rate for medium risk
        else:
            return self.max_rate  # Higher rate for high risk

    def predict(self, data: Dict) -> Dict:
        income = data.get('income', 0)
        loan_amount = data.get('loan_amount', 0)
        credit_score = data.get('credit_score', 600)
        age = data.get('age', 30)
        employment_years = data.get('employment_years', 0)
        existing_emis = data.get('existing_emis', 0)
        assets = data.get('assets', 0)
        liabilities = data.get('liabilities', 0)
        tenure = data.get('tenure', 36)

        dti = self.calculate_dti(income, existing_emis)
        foir = self.calculate_foir(income, existing_emis, loan_amount, tenure)
        risk_score = self.calculate_risk_score(credit_score, employment_years, assets, liabilities, dti)

        approved = risk_score >= 50 and dti < 50 and foir < 50
        confidence = min(risk_score / 100, 0.99)

        if risk_score >= 70:
            risk_level = "LOW"
        elif risk_score >= 50:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        interest_rate = self.get_interest_rate(risk_score)
        emi = self.calculate_emi(loan_amount, tenure, interest_rate)
        total_payment = emi * tenure
        total_interest = total_payment - loan_amount

        explanation = self.generate_explanation(
            approved, credit_score, dti, employment_years, assets, liabilities, risk_score,
            interest_rate, emi, total_interest, tenure
        )

        return {
            "approved": approved,
            "confidence": round(confidence, 2),
            "risk_level": risk_level,
            "explanation": explanation,
            "loan_details": {
                "loan_amount": loan_amount,
                "interest_rate": round(interest_rate * 100, 2),
                "tenure_months": tenure,
                "monthly_emi": round(emi, 2),
                "total_interest": round(total_interest, 2),
                "total_payment": round(total_payment, 2),
                "processing_fee": round(loan_amount * 0.01, 2),  # 1% processing fee
                "annual_income": income * 12
            }
        }

    def calculate_dti(self, income: float, existing_emis: float) -> float:
        if income <= 0:
            return 100
        return min((existing_emis / income) * 100, 100)

    def calculate_foir(self, income: float, existing_emis: float, loan_amount: float, tenure: int) -> float:
        if income <= 0:
            return 100
        emi = self.calculate_emi(loan_amount, tenure, self.base_interest_rate)
        return min(((existing_emis + emi) / income) * 100, 100)

    def calculate_emi(self, principal: float, tenure: int, annual_rate: float = None) -> float:
        if annual_rate is None:
            annual_rate = self.base_interest_rate
        if principal <= 0 or tenure <= 0:
            return 0
        rate = annual_rate / 12
        return (principal * rate * (1 + rate)**tenure) / ((1 + rate)**tenure - 1)

    def calculate_risk_score(
        self, credit_score: int, employment_years: int,
        assets: float, liabilities: float, dti: float
    ) -> float:
        score = credit_score / 8.5
        score += min(employment_years * 2, 20)
        score += min(assets / 100000, 10)
        score -= min(liabilities / 10000, 10)
        if dti > 40:
            score -= (dti - 40) * 2
        return max(0, min(score, 100))

    def generate_explanation(
        self, approved: bool, credit_score: int, dti: float,
        employment_years: int, assets: float, liabilities: float, risk_score: float,
        interest_rate: float, emi: float, total_interest: float, tenure: int
    ) -> str:
        factors = []

        if credit_score >= 700:
            factors.append(f"excellent credit score ({credit_score})")
        elif credit_score >= 600:
            factors.append(f"good credit score ({credit_score})")
        else:
            factors.append(f"credit score ({credit_score}) requiring improvement")

        factors.append(f"{employment_years} years of stable employment")

        if assets > liabilities * 2:
            factors.append("strong asset-to-liability ratio")
        elif assets > liabilities:
            factors.append("adequate assets for debt coverage")

        if dti < 40:
            factors.append("healthy debt-to-income ratio")
        else:
            factors.append("elevated debt obligations")

        explanation = f"Key factors: {', '.join(factors)}. "
        explanation += f"Overall risk assessment score: {risk_score:.0f}/100. "
        explanation += f"Applied interest rate: {interest_rate*100:.2f}% per annum. "
        explanation += f"Monthly EMI: ₹{emi:,.2f} for {tenure} months. "
        explanation += f"Total interest payable: ₹{total_interest:,.2f}. "

        if approved:
            explanation += f"Loan amount ₹{(emi * tenure - total_interest):,.2f} approved. The application meets our lending criteria with a favorable risk profile."
        else:
            explanation += "Consider reducing existing debts or improving credit score before reapplying."

        return explanation

predictor = LoanPredictor()