import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaMoneyBillWave, FaBriefcase, FaHome, FaPercent, FaCalendar, FaChartLine, FaCheck, FaClock, FaIdCard, FaTerminal, FaMicrochip } from 'react-icons/fa';
import api from '../services/api';

export default function LoanApplication() {
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [checkingKyc, setCheckingKyc] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    monthlyIncome: '',
    existingEmi: '',
    loanType: '',
    propertyValue: '',
    loanAmount: 100000,
    employmentType: '',
    tenure: 24,
    creditScore: '',
  });

  useEffect(() => {
    checkKycStatus();
  }, []);

  const checkKycStatus = async () => {
    try {
      const res = await api.get('/kyc/status');
      setKycStatus(res.data);
    } catch (error) {
      console.error('Error checking KYC status:', error);
    } finally {
      setCheckingKyc(false);
    }
  };

  const isKycVerified = kycStatus?.kycStatus === 'VERIFIED';

  if (checkingKyc) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!isKycVerified) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 relative">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center border border-purple-500/20 glow-purple"
          >
            <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <FaClock className="text-4xl text-purple-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-white tracking-wide">KYC Protocol Verification Required</h2>
            <p className="text-slate-400 mb-8 font-light text-sm">
              Your security ledger is unverified. You must complete document upload and receive administrator clearance before deploying credit requests.
            </p>

            {/* Document Status */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-left font-mono">
              <div className={`p-4 rounded-xl border transition-all ${kycStatus?.kycVerification?.aadhaarStatus === 'VERIFIED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <FaIdCard className={`text-lg mb-2 ${kycStatus?.kycVerification?.aadhaarStatus === 'VERIFIED' ? 'text-cyan-400' : 'text-slate-600'}`} />
                <p className="text-xs font-semibold text-white">Aadhaar Card</p>
                <p className="text-[10px] mt-1 tracking-wider">
                  STATUS: {kycStatus?.kycVerification?.aadhaarStatus || 'UNRESOLVED'}
                </p>
              </div>
              <div className={`p-4 rounded-xl border transition-all ${kycStatus?.kycVerification?.panStatus === 'VERIFIED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <FaIdCard className={`text-lg mb-2 ${kycStatus?.kycVerification?.panStatus === 'VERIFIED' ? 'text-cyan-400' : 'text-slate-600'}`} />
                <p className="text-xs font-semibold text-white">PAN Card</p>
                <p className="text-[10px] mt-1 tracking-wider">
                  STATUS: {kycStatus?.kycVerification?.panStatus || 'UNRESOLVED'}
                </p>
              </div>
              <div className={`p-4 rounded-xl border transition-all ${kycStatus?.kycVerification?.addressStatus === 'VERIFIED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <FaIdCard className={`text-lg mb-2 ${kycStatus?.kycVerification?.addressStatus === 'VERIFIED' ? 'text-cyan-400' : 'text-slate-600'}`} />
                <p className="text-xs font-semibold text-white">Address Proof</p>
                <p className="text-[10px] mt-1 tracking-wider">
                  STATUS: {kycStatus?.kycVerification?.addressStatus || 'UNRESOLVED'}
                </p>
              </div>
              <div className={`p-4 rounded-xl border transition-all ${kycStatus?.kycVerification?.photoStatus === 'VERIFIED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <FaIdCard className={`text-lg mb-2 ${kycStatus?.kycVerification?.photoStatus === 'VERIFIED' ? 'text-cyan-400' : 'text-slate-600'}`} />
                <p className="text-xs font-semibold text-white">Profile Photo</p>
                <p className="text-[10px] mt-1 tracking-wider">
                  STATUS: {kycStatus?.kycVerification?.photoStatus || 'UNRESOLVED'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kyc" className="btn-primary flex items-center justify-center gap-2">
                <FaUser /> Initialize KYC Docs
              </Link>
              <Link to="/dashboard" className="btn-secondary flex items-center justify-center">
                Abort and Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loan Application Form (only shows when KYC is verified)
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        monthlyIncome: Number(formData.monthlyIncome),
        existingEmis: Number(formData.existingEmi) || 0,
        loanType: formData.loanType,
        propertyValue: Number(formData.propertyValue) || 0,
        loanAmount: Number(formData.loanAmount),
        employmentType: formData.employmentType,
        tenure: Number(formData.tenure),
        creditScore: formData.creditScore ? Number(formData.creditScore) : null,
        fullName: 'User',
        dateOfBirth: '',
        gender: '',
        email: '',
        phone: '',
        annualIncome: Number(formData.monthlyIncome) * 12,
        employmentYears: 1,
        companyName: '',
        assets: { realEstate: Number(formData.propertyValue), vehicle: 0, investments: 0, other: 0 },
        liabilities: { existingLoans: Number(formData.existingEmi), creditCards: 0, otherDebts: 0 },
        loanPurpose: formData.loanType,
      };

      const res = await api.post('/loan/predict', payload);
      navigate(`/result/${res.data.id}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-4">
            <FaTerminal className="text-cyan-400 text-xs" />
            <span className="text-cyan-300 text-[10px] font-mono tracking-widest uppercase">Secured Application Tunnel</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">Initialize Credit Request</h1>
          <p className="text-slate-400 font-light">Input telemetry variables for real-time quantum assessment</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 border border-purple-500/10 glow-purple"
        >
          <div className="space-y-6">
            {/* Income & EMI */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                  <FaMoneyBillWave className="inline mr-2 text-purple-400" /> Monthly Income (INR) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                  className="input-field"
                  placeholder="Enter monthly income"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                  <FaPercent className="inline mr-2 text-purple-400" /> Existing EMI (INR)
                </label>
                <input
                  type="number"
                  value={formData.existingEmi}
                  onChange={(e) => handleChange('existingEmi', e.target.value)}
                  className="input-field"
                  placeholder="Monthly EMI obligations"
                />
              </div>
            </div>

            {/* Loan Type & Property Value */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                  <FaMicrochip className="inline mr-2 text-cyan-400" /> Loan Classification *
                </label>
                <select
                  value={formData.loanType}
                  onChange={(e) => handleChange('loanType', e.target.value)}
                  className="input-field bg-[#030014] text-white border-white/10"
                  required
                >
                  <option value="">Select allocation type</option>
                  <option value="PERSONAL">Personal Allocation</option>
                  <option value="HOME">Mortgage Allocation</option>
                  <option value="BUSINESS">Commercial Allocation</option>
                  <option value="VEHICLE">Asset/Vehicle Allocation</option>
                  <option value="EDUCATION">Academic Allocation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                  <FaHome className="inline mr-2 text-cyan-400" /> Real Estate Assets (INR)
                </label>
                <input
                  type="number"
                  value={formData.propertyValue}
                  onChange={(e) => handleChange('propertyValue', e.target.value)}
                  className="input-field"
                  placeholder="If applicable"
                />
              </div>
            </div>

            {/* Loan Amount Slider */}
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
              <label className="block text-xs font-mono tracking-wider mb-3 text-slate-300 uppercase flex justify-between">
                <span>Requested Capital Allocation:</span>
                <span className="text-cyan-400 font-bold">₹{Number(formData.loanAmount).toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={formData.loanAmount}
                onChange={(e) => handleChange('loanAmount', Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 tracking-wider">
                <span>₹10,000</span>
                <span>₹50,00,000</span>
              </div>
            </div>

            {/* Employment Type & Tenure */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                  <FaBriefcase className="inline mr-2 text-pink-400" /> Professional Status *
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  className="input-field bg-[#030014] text-white border-white/10"
                  required
                >
                  <option value="">Select sector</option>
                  <option value="SALARIED">Salaried Node</option>
                  <option value="SELF_EMPLOYED">Independent Contractor</option>
                  <option value="BUSINESS">Corporate Entity</option>
                  <option value="FREELANCER">Autonomous Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                  <FaCalendar className="inline mr-2 text-pink-400" /> Maturity Duration *
                </label>
                <select
                  value={formData.tenure}
                  onChange={(e) => handleChange('tenure', e.target.value)}
                  className="input-field bg-[#030014] text-white border-white/10"
                  required
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>
            </div>

            {/* Credit Score (Optional) */}
            <div>
              <label className="block text-xs font-mono tracking-wider mb-2 text-slate-400 uppercase">
                <FaChartLine className="inline mr-2 text-purple-400" /> Bureau Trust Rating (CIBIL - Optional)
              </label>
              <input
                type="number"
                value={formData.creditScore}
                onChange={(e) => handleChange('creditScore', e.target.value)}
                className="input-field"
                placeholder="300-900 (Score)"
                min="300"
                max="900"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-transparent transition-all tracking-wider uppercase font-mono mt-8"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Initializing Prediction Sequence...
                </>
              ) : (
                <>
                  <FaCheck /> Submit Application Protocol
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}