import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaMoneyBillWave, FaBriefcase, FaHome, FaPercent, FaCalendar, FaChartLine, FaCheck, FaClock, FaIdCard } from 'react-icons/fa';
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
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isKycVerified) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
              <FaClock className="text-4xl text-warning" />
            </div>
            <h2 className="text-2xl font-bold mb-4">KYC Verification Required</h2>
            <p className="text-gray-400 mb-6">
              You must complete and get your documents verified by admin before applying for a loan.
            </p>

            {/* Document Status */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-lg ${kycStatus?.kycVerification?.aadhaarStatus === 'VERIFIED' ? 'bg-success/10 border border-success/30' : 'bg-gray-800/50'}`}>
                <FaIdCard className={`mx-auto mb-2 ${kycStatus?.kycVerification?.aadhaarStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`} />
                <p className="text-sm">Aadhaar Card</p>
                <p className={`text-xs ${kycStatus?.kycVerification?.aadhaarStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`}>
                  {kycStatus?.kycVerification?.aadhaarStatus || 'Not Submitted'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${kycStatus?.kycVerification?.panStatus === 'VERIFIED' ? 'bg-success/10 border border-success/30' : 'bg-gray-800/50'}`}>
                <FaIdCard className={`mx-auto mb-2 ${kycStatus?.kycVerification?.panStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`} />
                <p className="text-sm">PAN Card</p>
                <p className={`text-xs ${kycStatus?.kycVerification?.panStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`}>
                  {kycStatus?.kycVerification?.panStatus || 'Not Submitted'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${kycStatus?.kycVerification?.addressStatus === 'VERIFIED' ? 'bg-success/10 border border-success/30' : 'bg-gray-800/50'}`}>
                <FaIdCard className={`mx-auto mb-2 ${kycStatus?.kycVerification?.addressStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`} />
                <p className="text-sm">Address Proof</p>
                <p className={`text-xs ${kycStatus?.kycVerification?.addressStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`}>
                  {kycStatus?.kycVerification?.addressStatus || 'Not Submitted'}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${kycStatus?.kycVerification?.photoStatus === 'VERIFIED' ? 'bg-success/10 border border-success/30' : 'bg-gray-800/50'}`}>
                <FaIdCard className={`mx-auto mb-2 ${kycStatus?.kycVerification?.photoStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`} />
                <p className="text-sm">Profile Photo</p>
                <p className={`text-xs ${kycStatus?.kycVerification?.photoStatus === 'VERIFIED' ? 'text-success' : 'text-gray-500'}`}>
                  {kycStatus?.kycVerification?.photoStatus || 'Not Submitted'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link to="/kyc" className="btn-primary flex items-center gap-2">
                <FaUser /> Upload Documents
              </Link>
              <Link to="/dashboard" className="btn-secondary">
                Go to Dashboard
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
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Loan Application</h1>
          <p className="text-gray-400">Fill in your details to get instant loan approval</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass p-8"
        >
          <div className="space-y-6">
            {/* Income & EMI */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <FaMoneyBillWave className="inline mr-2" /> Monthly Income (₹) *
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
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <FaPercent className="inline mr-2" /> Existing EMI (₹)
                </label>
                <input
                  type="number"
                  value={formData.existingEmi}
                  onChange={(e) => handleChange('existingEmi', e.target.value)}
                  className="input-field"
                  placeholder="Monthly EMI payments"
                />
              </div>
            </div>

            {/* Loan Type & Property Value */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <FaHome className="inline mr-2" /> Loan Type *
                </label>
                <select
                  value={formData.loanType}
                  onChange={(e) => handleChange('loanType', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select loan type</option>
                  <option value="PERSONAL">Personal Loan</option>
                  <option value="HOME">Home Loan</option>
                  <option value="BUSINESS">Business Loan</option>
                  <option value="VEHICLE">Vehicle Loan</option>
                  <option value="EDUCATION">Education Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <FaHome className="inline mr-2" /> Property Value (₹)
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
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Loan Amount: ₹{Number(formData.loanAmount).toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={formData.loanAmount}
                onChange={(e) => handleChange('loanAmount', Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>₹10,000</span>
                <span>₹50,00,000</span>
              </div>
            </div>

            {/* Employment Type & Tenure */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <FaBriefcase className="inline mr-2" /> Employment Type *
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select employment type</option>
                  <option value="SALARIED">Salaried</option>
                  <option value="SELF_EMPLOYED">Self-Employed</option>
                  <option value="BUSINESS">Business Owner</option>
                  <option value="FREELANCER">Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  <FaCalendar className="inline mr-2" /> Tenure (months) *
                </label>
                <select
                  value={formData.tenure}
                  onChange={(e) => handleChange('tenure', e.target.value)}
                  className="input-field"
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
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <FaChartLine className="inline mr-2" /> Credit Score (Optional)
              </label>
              <input
                type="number"
                value={formData.creditScore}
                onChange={(e) => handleChange('creditScore', e.target.value)}
                className="input-field"
                placeholder="300-900 (CIBIL Score)"
                min="300"
                max="900"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck /> Submit Application
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}