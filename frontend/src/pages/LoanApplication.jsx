import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCoins, FaFileAlt, FaLandmark, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';

const steps = [
  { id: 1, title: 'Personal Details', icon: FaUser },
  { id: 2, title: 'Financial Info', icon: FaCoins },
  { id: 3, title: 'Loan Details', icon: FaFileAlt },
  { id: 4, title: 'Assets & Liabilities', icon: FaLandmark },
  { id: 5, title: 'Review & Submit', icon: FaCheck },
];

export default function LoanApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',

    // Step 2: Financial Information
    monthlyIncome: '',
    employmentType: '',
    employmentYears: '',
    companyName: '',
    annualIncome: '',

    // Step 3: Loan Details
    loanAmount: 100000,
    loanPurpose: '',
    tenure: '',
    existingEmis: '',

    // Step 4: Assets & Liabilities
    assets: {
      realEstate: '',
      vehicle: '',
      investments: '',
      other: '',
    },
    liabilities: {
      existingLoans: '',
      creditCards: '',
      otherDebts: '',
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssetChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, [field]: value }
    }));
  };

  const handleLiabilityChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      liabilities: { ...prev.liabilities, [field]: value }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone;
      case 2:
        return formData.monthlyIncome && formData.employmentType;
      case 3:
        return formData.loanAmount && formData.loanPurpose && formData.tenure;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        monthlyIncome: Number(formData.monthlyIncome),
        employmentType: formData.employmentType,
        employmentYears: Number(formData.employmentYears),
        companyName: formData.companyName,
        annualIncome: Number(formData.annualIncome),
        loanAmount: Number(formData.loanAmount),
        loanPurpose: formData.loanPurpose,
        tenure: Number(formData.tenure),
        existingEmis: Number(formData.existingEmis) || 0,
        assets: {
          realEstate: Number(formData.assets.realEstate) || 0,
          vehicle: Number(formData.assets.vehicle) || 0,
          investments: Number(formData.assets.investments) || 0,
          other: Number(formData.assets.other) || 0,
        },
        liabilities: {
          existingLoans: Number(formData.liabilities.existingLoans) || 0,
          creditCards: Number(formData.liabilities.creditCards) || 0,
          otherDebts: Number(formData.liabilities.otherDebts) || 0,
        },
      };

      const res = await api.post('/loan/predict', payload);
      navigate(`/result/${res.data._id}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-6">Personal Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-6">Financial Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Income (₹) *</label>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                  className="input-field"
                  placeholder="Enter monthly income"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Employment Type *</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleChange('employmentType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select employment type</option>
                  <option value="SALARIED">Salaried</option>
                  <option value="SELF_EMPLOYED">Self-Employed</option>
                  <option value="BUSINESS">Business Owner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years of Employment</label>
                <input
                  type="number"
                  value={formData.employmentYears}
                  onChange={(e) => handleChange('employmentYears', e.target.value)}
                  className="input-field"
                  placeholder="Years at current job"
                />
              </div>
              {formData.employmentType === 'SALARIED' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="input-field"
                    placeholder="Company name"
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Annual Income (₹)</label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  className="input-field"
                  placeholder="Annual income"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-6">Loan Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Amount: ₹{formData.loanAmount.toLocaleString()}
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Purpose *</label>
                  <select
                    value={formData.loanPurpose}
                    onChange={(e) => handleChange('loanPurpose', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select purpose</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="BUSINESS">Business</option>
                    <option value="HOME">Home</option>
                    <option value="EDUCATION">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tenure (months) *</label>
                  <select
                    value={formData.tenure}
                    onChange={(e) => handleChange('tenure', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select tenure</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Existing EMIs (₹/month)</label>
                  <input
                    type="number"
                    value={formData.existingEmis}
                    onChange={(e) => handleChange('existingEmis', e.target.value)}
                    className="input-field"
                    placeholder="Total monthly EMIs"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        const totalAssets = Object.values(formData.assets).reduce((sum, val) => sum + (Number(val) || 0), 0);
        const totalLiabilities = Object.values(formData.liabilities).reduce((sum, val) => sum + (Number(val) || 0), 0);

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">Assets & Liabilities</h3>

            <div className="glass p-4">
              <h4 className="font-medium mb-4 text-success">Assets</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Real Estate (₹)</label>
                  <input
                    type="number"
                    value={formData.assets.realEstate}
                    onChange={(e) => handleAssetChange('realEstate', e.target.value)}
                    className="input-field"
                    placeholder="Property value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle (₹)</label>
                  <input
                    type="number"
                    value={formData.assets.vehicle}
                    onChange={(e) => handleAssetChange('vehicle', e.target.value)}
                    className="input-field"
                    placeholder="Vehicle value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Investments (₹)</label>
                  <input
                    type="number"
                    value={formData.assets.investments}
                    onChange={(e) => handleAssetChange('investments', e.target.value)}
                    className="input-field"
                    placeholder="Investment value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Other Assets (₹)</label>
                  <input
                    type="number"
                    value={formData.assets.other}
                    onChange={(e) => handleAssetChange('other', e.target.value)}
                    className="input-field"
                    placeholder="Other assets"
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-gray-400">Total Assets: </span>
                <span className="font-mono text-success">₹{totalAssets.toLocaleString()}</span>
              </div>
            </div>

            <div className="glass p-4">
              <h4 className="font-medium mb-4 text-danger">Liabilities</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Existing Loans (₹)</label>
                  <input
                    type="number"
                    value={formData.liabilities.existingLoans}
                    onChange={(e) => handleLiabilityChange('existingLoans', e.target.value)}
                    className="input-field"
                    placeholder="Outstanding loans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Credit Cards (₹)</label>
                  <input
                    type="number"
                    value={formData.liabilities.creditCards}
                    onChange={(e) => handleLiabilityChange('creditCards', e.target.value)}
                    className="input-field"
                    placeholder="Credit card balance"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Other Debts (₹)</label>
                  <input
                    type="number"
                    value={formData.liabilities.otherDebts}
                    onChange={(e) => handleLiabilityChange('otherDebts', e.target.value)}
                    className="input-field"
                    placeholder="Other debts"
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-gray-400">Total Liabilities: </span>
                <span className="font-mono text-danger">₹{totalLiabilities.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 5:
        const totalAssetsVal = Object.values(formData.assets).reduce((sum, val) => sum + (Number(val) || 0), 0);
        const totalLiabilitiesVal = Object.values(formData.liabilities).reduce((sum, val) => sum + (Number(val) || 0), 0);

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">Review & Submit</h3>

            <div className="space-y-4">
              <div className="glass p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Personal Details</h4>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-accent-400 text-sm hover:text-accent-300"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Name:</span> {formData.fullName}</div>
                  <div><span className="text-gray-400">Email:</span> {formData.email}</div>
                  <div><span className="text-gray-400">Phone:</span> {formData.phone}</div>
                  <div><span className="text-gray-400">DOB:</span> {formData.dateOfBirth}</div>
                </div>
              </div>

              <div className="glass p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Financial Information</h4>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-accent-400 text-sm hover:text-accent-300"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Monthly Income:</span> ₹{Number(formData.monthlyIncome).toLocaleString()}</div>
                  <div><span className="text-gray-400">Employment:</span> {formData.employmentType}</div>
                  <div><span className="text-gray-400">Years of Work:</span> {formData.employmentYears}</div>
                </div>
              </div>

              <div className="glass p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Loan Details</h4>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-accent-400 text-sm hover:text-accent-300"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Amount:</span> ₹{formData.loanAmount.toLocaleString()}</div>
                  <div><span className="text-gray-400">Purpose:</span> {formData.loanPurpose}</div>
                  <div><span className="text-gray-400">Tenure:</span> {formData.tenure} months</div>
                  <div><span className="text-gray-400">Existing EMIs:</span> ₹{Number(formData.existingEmis || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="glass p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Assets & Liabilities</h4>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-accent-400 text-sm hover:text-accent-300"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-400">Total Assets:</span> ₹{totalAssetsVal.toLocaleString()}</div>
                  <div><span className="text-gray-400">Total Liabilities:</span> ₹{totalLiabilitiesVal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
          <p className="text-gray-400">Complete the form to apply for a loan</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20 -z-10"></div>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-primary'
                      : 'bg-white/10'
                  } ${isCurrent ? 'ring-4 ring-accent-500/30' : ''}`}
                >
                  <Icon className={`${isActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className={`text-xs mt-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`btn-secondary flex items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaArrowLeft /> Previous
            </button>

            {currentStep === 5 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit <FaCheck /></>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`btn-primary flex items-center gap-2 ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next <FaArrowRight />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}