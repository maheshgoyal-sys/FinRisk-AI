# Loan Prediction & Financial Risk Assessment Platform

## 1. Project Overview

**Project Name:** FinRisk AI - Loan Prediction & Risk Assessment Platform

**Project Type:** Enterprise Fintech Web Application (SPA + REST API + ML Service)

**Core Functionality:** AI-powered loan approval system with risk assessment, KYC document management, and intelligent chatbot for financial guidance.

**Target Users:**
- Individual loan applicants seeking personal/business loans
- Financial administrators managing loan portfolios
- Risk analysts monitoring fraud and loan metrics

---

## 2. Tech Stack

### Frontend
- **Framework:** React.js 18 with Vite
- **Styling:** Tailwind CSS 3.x
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Routing:** React Router DOM v6

### Backend
- **Framework:** Spring Boot 3.x (Java 17)
- **Security:** Spring Security + JWT
- **Database:** MongoDB Atlas
- **Build Tool:** Maven

### ML Service
- **Framework:** Python FastAPI
- **ML Model:** Random Forest / XGBoost trained on loan data

---

## 3. UI/UX Specification

### 3.1 Design System

#### Color Palette
```css
/* Primary - Deep Navy */
--primary-900: #0a1628;
--primary-800: #0f2139;
--primary-700: #152d4a;
--primary-600: #1a3a5c;

/* Accent - Electric Blue */
--accent-500: #3b82f6;
--accent-400: #60a5fa;
--accent-300: #93c5fd;

/* Gradient Primary */
--gradient-start: #3b82f6;
--gradient-end: #8b5cf6;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--danger: #ef4444;

/* Surface Colors */
--surface-dark: rgba(15, 33, 57, 0.8);
--surface-glass: rgba(255, 255, 255, 0.05);
--border-glass: rgba(255, 255, 255, 0.1);
```

#### Typography
- **Primary Font:** "Plus Jakarta Sans" (Google Fonts)
- **Monospace:** "JetBrains Mono" (for numbers/data)
- **Headings:** 700 weight, tracking tight
- **Body:** 400 weight, 16px base

#### Glassmorphism Effects
- Background blur: 20px
- Surface transparency: 0.05-0.15
- Border: 1px solid rgba(255,255,255,0.1)
- Border radius: 12px-24px

### 3.2 Layout Structure

#### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

#### Page Structure
```
+--------------------------------------------------+
|  Navbar (fixed, glassmorphism)                  |
+--------------------------------------------------+
|                                                  |
|  Main Content Area                               |
|  - Page-specific layout                          |
|  - Animated transitions                          |
|                                                  |
+--------------------------------------------------+
|  Floating Chatbot (bottom-right)                |
+--------------------------------------------------+
```

### 3.3 Component Library

#### Buttons
- **Primary:** Gradient background (#3b82f6 → #8b5cf6), white text
- **Secondary:** Glass surface, border, hover glow
- **Danger:** Red gradient for destructive actions
- **States:** Loading spinner, disabled opacity

#### Cards
- Glassmorphism background
- Subtle gradient border on hover
- Shadow on elevation
- Animated entry (fade + slide up)

#### Forms
- Floating labels with smooth transition
- Input focus: gradient border glow
- Validation states with icons
- Multi-step progress indicator

#### Charts
- Dark theme with gradient fills
- Animated data entry
- Interactive tooltips
- Responsive sizing

---

## 4. Page Specifications

### 4.1 Landing Page

#### Hero Section
- Full viewport height
- Animated gradient background (animated grain texture)
- Main headline: "AI-Powered Loan Decisions"
- Subheadline: "Instant approval with intelligent risk assessment"
- CTA buttons: "Apply Now" | "Learn More"
- Floating 3D elements with parallax

#### Features Section
- 3-column grid (responsive to single column on mobile)
- Feature cards with icon, title, description
- Hover: scale + glow effect

#### Stats Section
- Counter animations
- Key metrics: "98% Accuracy", "50K+ Users", "2Min Approval"

#### Footer
- Logo + navigation links
- Social icons
- Copyright

### 4.2 Authentication Pages

#### Login Page
- Centered card layout
- Email + password fields
- "Forgot Password" link
- "Sign Up" redirect
- Social login buttons (optional)
- Background: subtle animated gradient

#### Register Page
- Multi-field form: name, email, phone, password, confirm
- Terms acceptance checkbox
- Progress indicator
- Password strength indicator

### 4.3 User Dashboard

#### Overview Section
- Welcome message with user name
- Quick stats cards (animated counters):
  - Total Applications
  - Approved Loans
  - Pending Applications
  - Rejected Applications
- Approval rate percentage ring chart

#### Recent Applications Table
- Sortable columns
- Status badges (color-coded)
- Pagination
- Click to view details

#### Risk Analytics Chart
- Line chart: Monthly application trends
- Pie chart: Risk distribution
- Bar chart: Loan amount distribution

### 4.4 Loan Application Form (Multi-Step)

#### Step 1: Personal Details
- Full name (text)
- Date of birth (date picker)
- Gender (select)
- Email (email input)
- Phone (tel input)

#### Step 2: Financial Information
- Monthly income (currency input)
- Employment type (select: Salaried/Self-Employed/Business)
- Employment years (number)
- Company name (text, if salaried)
- Annual income (currency input)

#### Step 3: Loan Details
- Loan amount (slider + input)
- Loan purpose (select: Personal/Business/Home/Education)
- Loan tenure (select: 12/24/36/48/60 months)
- Existing EMIs (currency input)

#### Step 4: Assets & Liabilities
- Assets section (expandable):
  - Real estate value
  - Vehicle value
  - Investments value
  - Other assets
- Liabilities section:
  - Existing loans
  - Credit cards balance
  - Other debts

#### Step 5: Review & Submit
- Summary of all entered data
- Edit buttons for each section
- Terms acceptance
- Submit button with loading state

### 4.5 KYC Document Upload

#### Upload Zones
- 4 upload areas:
  - Aadhaar Card (front/back)
  - PAN Card
  - Salary Slip / Income Proof
  - Bank Statement (last 6 months)
- Drag & drop support
- File type validation (PDF, JPG, PNG)
- Size limit indicator
- Preview after upload

#### Document Status
- Upload progress bar
- Verification status: Pending/Verified/Rejected
- Retry option for failed uploads

### 4.6 Result Page

#### Decision Display
- Large animated status: APPROVED ✓ / REJECTED ✗
- Background gradient changes based on decision (green/blue for approved, red/orange for rejected)
- Confetti animation for approval

#### Detailed Results Card
- Confidence score with radial progress
- Risk level badge (Low/Medium/High with color)
- AI Explanation section:
  - Key factors considered
  - Why approved/rejected
  - Recommendations

#### Next Steps
- If approved: "Proceed to disbursement"
- If rejected: "View improvement tips" button

### 4.7 AI Chatbot

#### Widget UI
- Floating button (bottom-right)
- Pulsing animation when new messages
- Expandable chat window (400x500px)

#### Chat Interface
- Message bubbles (user: right, bot: left)
- Typing indicator
- Quick action buttons:
  - "Am I eligible?"
  - "Why was I rejected?"
  - "Improve credit score"
  - "Calculate EMI"

#### Chat Features
- Context-aware (uses user's financial data)
- Persistent chat history
- Export conversation option

### 4.8 Admin Dashboard

#### Navigation Tabs
- Dashboard | Users | Applications | Fraud Alerts | Settings

#### Stats Overview
- Total users
- Total applications
- Fraud cases detected
- Revenue metrics

#### User Management Table
- Search + filter
- User details modal
- Role assignment
- Account actions (suspend/reactivate)

#### Application Management
- All applications with filters (date, status, risk)
- Bulk actions
- Export to CSV/Excel

#### Fraud Detection Panel
- Alert cards with severity
- Action buttons: Investigate / Dismiss / Escalate
- Pattern indicators

---

## 5. Backend Architecture

### 5.1 Spring Boot Structure

```
src/main/java/com/finrisk/
├── FinRiskApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── MongoConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── LoanController.java
│   ├── KycController.java
│   └── AdminController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── LoanService.java
│   ├── KycService.java
│   ├── MlService.java
│   └── ChatService.java
├── repository/
│   ├── UserRepository.java
│   ├── LoanApplicationRepository.java
│   ├── KycDocumentRepository.java
│   └── ChatMessageRepository.java
├── model/
│   ├── User.java
│   ├── LoanApplication.java
│   ├── KycDocument.java
│   └── ChatMessage.java
├── dto/
│   ├── auth/
│   ├── loan/
│   ├── user/
│   └── admin/
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── exception/
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── CustomException.java
```

### 5.2 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

#### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/applications` - Get user's applications

#### Loan
- `POST /api/loan/predict` - Submit loan application for prediction
- `GET /api/loan/{id}` - Get specific application
- `GET /api/loan/history` - Get user's application history

#### KYC
- `POST /api/kyc/upload` - Upload KYC document
- `GET /api/kyc/status` - Get KYC status
- `DELETE /api/kyc/{id}` - Delete document

#### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/fraud-alerts` - Get fraud alerts
- `PUT /api/admin/user/{id}/role` - Update user role

#### Chat
- `POST /api/chat/message` - Send message to chatbot

### 5.3 MongoDB Collections

#### users
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "hashed",
  "fullName": "string",
  "phone": "string",
  "role": "USER|ADMIN",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "isActive": "boolean"
}
```

#### loan_applications
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "status": "PENDING|APPROVED|REJECTED",
  "loanAmount": "number",
  "income": "number",
  "creditScore": "number",
  "age": "number",
  "employmentYears": "number",
  "existingEmis": "number",
  "assets": "number",
  "liabilities": "number",
  "loanPurpose": "string",
  "tenure": "number",
  "dti": "number",
  "foir": "number",
  "mlResponse": {
    "approved": "boolean",
    "confidence": "number",
    "riskLevel": "string"
  },
  "aiExplanation": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### kyc_documents
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "documentType": "AADHAAR|PAN|SALARY|BANK_STATEMENT",
  "fileName": "string",
  "fileUrl": "string",
  "status": "PENDING|VERIFIED|REJECTED",
  "uploadedAt": "datetime"
}
```

#### chat_messages
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "role": "USER|ASSISTANT",
  "content": "string",
  "timestamp": "datetime"
}
```

---

## 6. ML Service Specification

### 6.1 FastAPI Structure

```
ml_service/
├── app/
│   ├── main.py
│   ├── model/
│   │   ├── predictor.py
│   │   └── model.pkl
│   ├── schemas/
│   │   └── prediction.py
│   └── routes/
│       └── predict.py
├── requirements.txt
└── uvicorn setup
```

### 6.2 Prediction Endpoint

**Endpoint:** `POST /predict`

**Request:**
```json
{
  "income": 50000,
  "loan_amount": 500000,
  "credit_score": 750,
  "age": 30,
  "employment_years": 5,
  "existing_emis": 5000,
  "assets": 1000000,
  "liabilities": 50000
}
```

**Response:**
```json
{
  "approved": true,
  "confidence": 0.87,
  "risk_level": "LOW",
  "explanation": "Key factors: High credit score (750), stable employment (5 years), strong asset to liability ratio (20:1), low DTI (10%). The application meets all positive criteria."
}
```

### 6.3 Business Logic Calculations

#### DTI (Debt-to-Income Ratio)
```
DTI = (Total Monthly EMIs / Monthly Gross Income) × 100
```
- Threshold: < 40% = Good, 40-50% = Moderate, > 50% = High Risk

#### FOIR (Fixed Obligation Income Ratio)
```
FOIR = ((Existing EMIs + Proposed EMI) / Monthly Income) × 100
```
- Threshold: < 50% = Eligible

#### Risk Score Calculation
```
Base Score = Credit Score (normalized to 100)
Employment Bonus = min(employment_years × 2, 20)
Asset Bonus = min(assets / 100000, 10)
Liability Penalty = liabilities / 10000 × 2
DTI Penalty = DTI > 40 ? (DTI - 40) × 2 : 0

Final Score = Base Score + Employment Bonus + Asset Bonus - Liability Penalty - DTI Penalty
```

---

## 7. Security Requirements

### 7.1 JWT Configuration
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token algorithm: HS256
- Claims: userId, email, role

### 7.2 Password Security
- BCrypt hashing with salt
- Minimum 8 characters
- Strength validation

### 7.3 API Security
- Rate limiting
- Input validation
- CORS configuration
- XSS protection

---

## 8. Animations Specification

### 8.1 Page Transitions
- Fade in: 300ms ease-out
- Slide up: 400ms cubic-bezier(0.16, 1, 0.3, 1)

### 8.2 Micro-interactions
- Button hover: scale(1.02), 150ms
- Card hover: translateY(-4px), shadow increase
- Input focus: border glow animation

### 8.3 Loading States
- Skeleton screens for data loading
- Spinner for actions
- Progress bar for file uploads

### 8.4 Chart Animations
- Line/Bar: staggered reveal, 800ms
- Pie: segment-by-segment, 600ms
- Numbers: count-up animation

---

## 9. Environment Configuration

### 9.1 Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
VITE_ML_SERVICE_URL=http://localhost:8000
```

### 9.2 Backend (application.properties)
```properties
spring.data.mongodb.uri=${MONGODB_URI}
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
ml.service.url=${ML_SERVICE_URL}
```

### 9.3 ML Service (.env)
```
MODEL_PATH=model/loan_model.pkl
PORT=8000
```

---

## 10. Acceptance Criteria

### 10.1 Functional Requirements
- [ ] User can register and login with JWT
- [ ] User can complete multi-step loan application
- [ ] Loan prediction returns accurate results
- [ ] KYC documents can be uploaded
- [ ] Dashboard shows analytics
- [ ] Chatbot responds to queries
- [ ] Admin can view all users and applications
- [ ] Admin can manage fraud alerts

### 10.2 Non-Functional Requirements
- [ ] All pages load under 2 seconds
- [ ] Smooth 60fps animations
- [ ] Responsive on all breakpoints
- [ ] No console errors in production build
- [ ] All forms have validation

### 10.3 Visual Requirements
- [ ] Glassmorphism UI consistent
- [ ] Dark theme throughout
- [ ] Gradient accents on interactive elements
- [ ] Professional fintech aesthetic