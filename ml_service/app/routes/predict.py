from fastapi import APIRouter
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.model.predictor import predictor

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    data = {
        "income": request.income,
        "loan_amount": request.loan_amount,
        "credit_score": request.credit_score,
        "age": request.age,
        "employment_years": request.employment_years,
        "existing_emis": request.existing_emis,
        "assets": request.assets,
        "liabilities": request.liabilities,
        "tenure": request.tenure
    }
    return predictor.predict(data)