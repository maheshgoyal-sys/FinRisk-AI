from pydantic import BaseModel
from typing import Optional

class LoanDetails(BaseModel):
    loan_amount: float
    interest_rate: float
    tenure_months: int
    monthly_emi: float
    total_interest: float
    total_payment: float
    processing_fee: float
    annual_income: float

class PredictionRequest(BaseModel):
    income: float
    loan_amount: float
    credit_score: int
    age: int
    employment_years: int
    existing_emis: float
    assets: float
    liabilities: float
    tenure: int = 36

class PredictionResponse(BaseModel):
    approved: bool
    confidence: float
    risk_level: str
    explanation: str
    loan_details: Optional[LoanDetails] = None