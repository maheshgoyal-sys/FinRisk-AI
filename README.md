FinRisk AI – Loan Prediction & Financial Risk Assessment Platform

An enterprise-grade AI-powered fintech platform for intelligent loan approval, financial risk assessment, KYC verification, fraud detection, and personalized financial guidance.

🚀 Overview

FinRisk AI is a modern full-stack fintech web application that helps financial institutions and users streamline the loan approval process using Artificial Intelligence and Machine Learning.

The platform evaluates user financial data, predicts loan approval probability, calculates risk metrics such as DTI & FOIR, manages KYC verification, and provides intelligent financial assistance through an AI chatbot.

✨ Key Features
👤 User Features
JWT-based secure authentication
Multi-step loan application system
AI-powered loan approval prediction
Real-time financial risk assessment
KYC document upload & verification
Loan history tracking
Interactive analytics dashboard
AI financial chatbot assistant
Responsive modern UI with glassmorphism effects
🛡️ Admin Features
Admin analytics dashboard
User management system
Loan application monitoring
Fraud alert detection panel
Risk analysis & metrics visualization
Role management
Export data to CSV/Excel
🤖 AI & ML Features
Loan approval prediction using ML models
Risk score calculation
DTI & FOIR analysis
Intelligent approval/rejection explanation
Financial guidance chatbot
🏗️ Tech Stack
Frontend
React.js 18
Vite
Tailwind CSS
Framer Motion
Axios
Recharts
React Router DOM
Backend
Spring Boot 3
Java 17
Spring Security
JWT Authentication
MongoDB Atlas
Maven
ML Service
Python FastAPI
Random Forest / XGBoost
Scikit-learn
📁 Project Structure
FinRisk-AI/
│
├── frontend/                 # React Frontend
│
├── backend/                  # Spring Boot Backend
│
├── ml_service/               # FastAPI ML Service
│
└── README.md
🎨 UI/UX Highlights
Modern fintech-inspired design
Glassmorphism interface
Dark theme aesthetic
Gradient interactive components
Smooth animations using Framer Motion
Fully responsive across devices
Real-time charts & analytics
🔐 Authentication & Security
JWT Access & Refresh Tokens
Spring Security integration
BCrypt password hashing
Role-based authorization
API validation & rate limiting
Secure file uploads
CORS & XSS protection
📊 Core Modules
1️⃣ Loan Prediction Engine

The platform analyzes:

Income
Credit score
Existing EMIs
Assets & liabilities
Employment history
Loan amount & tenure

Then predicts:

Approval/Rejection
Confidence score
Risk level
AI explanation
2️⃣ Financial Risk Assessment
Debt-to-Income Ratio (DTI)

DTI=(
Monthly Gross Income
Total Monthly EMIs
	​

)×100

Fixed Obligation Income Ratio (FOIR)

FOIR=(
Monthly Income
Existing EMIs + Proposed EMI
	​

)×100

Risk Score Formula

Final Score=Base Score+Employment Bonus+Asset Bonus−Liability Penalty−DTI Penalty

📂 Features Breakdown
🏠 Landing Page
Hero section
Animated gradients
Statistics counters
Feature showcase
CTA buttons
Responsive design
🔑 Authentication
Login/Register
Password validation
JWT authentication
Secure session management
📋 Loan Application
Multi-step form
Financial data collection
Asset & liability analysis
Review & submit workflow
📎 KYC Upload System

Supported documents:

Aadhaar Card
PAN Card
Salary Slip
Bank Statement

Features:

Drag & drop upload
File validation
Upload progress
Verification status
📈 Analytics Dashboard
Approval metrics
Risk distribution charts
Loan trends
User statistics
Interactive charts
🤖 AI Chatbot
Financial guidance
Eligibility assistance
Credit improvement tips
EMI calculations
Persistent chat history
🛠️ Admin Dashboard
User management
Application monitoring
Fraud detection
Analytics overview
Role management
⚙️ Installation Guide
1️⃣ Clone Repository
git clone https://github.com/your-username/FinRisk-AI.git
cd FinRisk-AI
💻 Frontend Setup
Navigate to frontend
cd frontend
Install dependencies
npm install
Start frontend
npm run dev

Frontend runs on:

http://localhost:5173
☕ Backend Setup (Spring Boot)
Navigate to backend
cd backend
Configure application.properties
spring.data.mongodb.uri=YOUR_MONGODB_URI
jwt.secret=YOUR_SECRET_KEY
jwt.expiration=900000
ml.service.url=http://localhost:8000
Run backend
Windows
.\mvnw.cmd spring-boot:run
Linux/Mac
./mvnw spring-boot:run

Backend runs on:

http://localhost:8080
🧠 ML Service Setup
Navigate to ML Service
cd ml_service
Create virtual environment
python -m venv venv
Activate environment
Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate
Install requirements
pip install -r requirements.txt
Run FastAPI Server
uvicorn app.main:app --reload

ML service runs on:

http://localhost:8000
🌍 Environment Variables
Frontend .env
VITE_API_URL=http://localhost:8080/api
VITE_ML_SERVICE_URL=http://localhost:8000
Backend application.properties
spring.data.mongodb.uri=${MONGODB_URI}
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
ml.service.url=${ML_SERVICE_URL}
ML Service .env
MODEL_PATH=model/loan_model.pkl
PORT=8000
🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/auth/me	Current user
Loan APIs
Method	Endpoint
POST	/api/loan/predict
GET	/api/loan/{id}
GET	/api/loan/history
KYC APIs
Method	Endpoint
POST	/api/kyc/upload
GET	/api/kyc/status
Admin APIs
Method	Endpoint
GET	/api/admin/users
GET	/api/admin/applications
GET	/api/admin/analytics
🗄️ Database Collections
users
loan_applications
kyc_documents
chat_messages
📊 Charts & Analytics
Loan approval trends
Risk distribution
Revenue metrics
Fraud detection insights
Monthly application charts
🎞️ Animations
Smooth page transitions
Card hover effects
Animated counters
Skeleton loaders
Upload progress animations
Interactive chart transitions
📱 Responsive Design

Supports:

Mobile
Tablet
Desktop

Optimized breakpoints:

< 640px
640px - 1024px
> 1024px
🧪 Future Enhancements
OCR-based KYC verification
AI fraud detection engine
Voice-enabled chatbot
Bank statement analyzer
Credit score simulator
Real-time loan marketplace
📌 Acceptance Goals

✅ Fast and secure authentication
✅ Intelligent loan prediction
✅ Smooth user experience
✅ Enterprise-level dashboard
✅ Fully responsive UI
✅ Modern fintech aesthetics
✅ Scalable backend architecture

👨‍💻 Author

Developed by Mahesh Goyal

📄 License

This project is licensed under the MIT License.

⭐ Support

If you like this project:

Give it a ⭐ on GitHub
Fork the repository
Contribute improvements
Share feedback
📬 Contact

For collaboration or queries:

Email: your-email@example.com
GitHub: maheshgoyal-sys
