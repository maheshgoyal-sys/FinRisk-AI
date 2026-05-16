import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanApplication from './pages/LoanApplication';
import KycUpload from './pages/KycUpload';
import EnhancedKyc from './pages/EnhancedKyc';
import RiskDashboard from './pages/RiskDashboard';
import Result from './pages/Result';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardEnhanced from './pages/AdminDashboardEnhanced';
import LoanCalculator from './pages/LoanCalculator';
import AdminUserManagement from './pages/AdminUserManagement';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import './index.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply"
              element={
                <ProtectedRoute>
                  <LoanApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kyc"
              element={
                <ProtectedRoute>
                  <KycUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kyc-enhanced"
              element={
                <ProtectedRoute>
                  <EnhancedKyc />
                </ProtectedRoute>
              }
            />
            <Route
              path="/risk-dashboard"
              element={
                <ProtectedRoute>
                  <RiskDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculator"
              element={
                <ProtectedRoute>
                  <LoanCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result/:id"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/overview"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboardEnhanced />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;