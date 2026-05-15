from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router

app = FastAPI(title="FinRisk AI ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/predict", tags=["ML"])

@app.get("/")
async def root():
    return {"message": "FinRisk AI ML Service", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}