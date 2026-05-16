import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine, FaShieldAlt, FaPercent, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaLightbulb, FaMoneyBillWave, FaClock,
  FaThumbsUp, FaThumbsDown, FaInfoCircle
} from 'react-icons/fa';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const RISK_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444'
};

export default function RiskDashboard() {
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanDetails, setLoanDetails] = useState({
    monthlyIncome: 50000,
    loanAmount: 500000,
    existingEmis: 5000,
    creditScore: 700,
    employmentYears: 5,
    assets: 1000000,
    liabilities: 50000
  });

  useEffect(() => {
    loadRiskAnalysis();
  }, []);

  const loadRiskAnalysis = async () => {
    try {
      const res = await api.get('/risk/latest');
      setRiskAnalysis(res.data);
    } catch (error) {
      console.error('Error loading risk analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeNewApplication = async () => {
    setLoading(true);
    try {
      const res = await api.post('/risk/analyze', {
        applicationId: 'preview-' + Date.now(),
        ...loanDetails
      });
      setRiskAnalysis(res.data);
    } catch (error) {
      console.error('Error analyzing risk:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => RISK_COLORS[level] || '#6b7280';

  const getEligibilityMeter = () => {
    if (!riskAnalysis) return 0;
    return riskAnalysis.approvalProbability || 0;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Risk Assessment Dashboard</h1>
          <p className="text-gray-400">AI-powered risk analysis and eligibility check</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Risk Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass p-6"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaChartLine className="text-accent-500" />
              Risk Score Overview
            </h3>

            {riskAnalysis ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Risk Score Gauge */}
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={getRiskColor(riskAnalysis.riskLevel)}
                        strokeWidth="10"
                        strokeDasharray={`${(riskAnalysis.riskScore / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <span className="text-3xl font-bold" style={{ color: getRiskColor(riskAnalysis.riskLevel) }}>
                          {Math.round(riskAnalysis.riskScore)}
                        </span>
                        <span className="text-gray-400 text-sm">/100</span>
                      </div>
                    </div>
                  </div>
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium`}
                    style={{ backgroundColor: `${getRiskColor(riskAnalysis.riskLevel)}20`, color: getRiskColor(riskAnalysis.riskLevel) }}>
                    {riskAnalysis.riskLevel} RISK
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Debt-to-Income (DTI)</span>
                      <span className={`font-bold ${riskAnalysis.dti < 40 ? 'text-success' : riskAnalysis.dti < 50 ? 'text-warning' : 'text-danger'}`}>
                        {riskAnalysis.dti?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${riskAnalysis.dti < 40 ? 'bg-success' : riskAnalysis.dti < 50 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${Math.min(riskAnalysis.dti, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">FOIR</span>
                      <span className={`font-bold ${riskAnalysis.foir < 50 ? 'text-success' : 'text-danger'}`}>
                        {riskAnalysis.foir?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${riskAnalysis.foir < 50 ? 'bg-success' : 'bg-danger'}`}
                        style={{ width: `${Math.min(riskAnalysis.foir, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <FaMoneyBillWave className="text-accent-500 text-xl mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Suggested Rate</p>
                      <p className="text-xl font-bold text-accent-500">
                        {riskAnalysis.suggestedInterestRate?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <FaClock className="text-accent-500 text-xl mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Approval Prob.</p>
                      <p className="text-xl font-bold text-accent-500">
                        {riskAnalysis.approvalProbability?.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FaShieldAlt className="text-4xl mx-auto mb-4 opacity-50" />
                <p>No risk analysis available</p>
                <p className="text-sm">Submit loan application to get analysis</p>
              </div>
            )}
          </motion.div>

          {/* Eligibility Meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-success" />
              Eligibility Meter
            </h3>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeDasharray={`${(getEligibilityMeter() / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {getEligibilityMeter().toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="text-center mb-4">
              {riskAnalysis?.isEligible ? (
                <span className="flex items-center gap-2 text-success font-medium">
                  <FaCheckCircle /> Eligible
                </span>
              ) : (
                <span className="flex items-center gap-2 text-danger font-medium">
                  <FaTimesCircle /> Not Eligible
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Low Risk</span>
                <span className="text-danger">High Risk</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                <div className="w-1/3 bg-success"></div>
                <div className="w-1/3 bg-warning"></div>
                <div className="w-1/3 bg-danger"></div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Your position: {getEligibilityMeter()}%
              </p>
            </div>
          </motion.div>
        </div>

        {/* AI Explanation */}
        {riskAnalysis?.aiExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 mt-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaLightbulb className="text-warning" />
              AI Analysis & Explanation
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {riskAnalysis.aiExplanation}
            </p>
          </motion.div>
        )}

        {/* Positive/Negative Factors */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaThumbsUp className="text-success" />
              Positive Factors
            </h3>
            <ul className="space-y-3">
              {riskAnalysis?.positiveFactors?.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="text-success mt-1" />
                  <span className="text-gray-300">{factor}</span>
                </li>
              ))}
              {!riskAnalysis?.positiveFactors?.length && (
                <li className="text-gray-500">No positive factors recorded</li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaThumbsDown className="text-danger" />
              Areas of Concern
            </h3>
            <ul className="space-y-3">
              {riskAnalysis?.negativeFactors?.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-warning mt-1" />
                  <span className="text-gray-300">{factor}</span>
                </li>
              ))}
              {!riskAnalysis?.negativeFactors?.length && (
                <li className="text-gray-500">No concerns identified</li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Financial Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-6 mt-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-accent-500" />
            Financial Insights & Recommendations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium mb-2">Income Analysis</h4>
              <p className="text-sm text-gray-400">
                Your monthly income of ₹{loanDetails.monthlyIncome.toLocaleString()} puts you in a good position for loans up to ₹{(loanDetails.monthlyIncome * 10).toLocaleString()}.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium mb-2">Debt Management</h4>
              <p className="text-sm text-gray-400">
                Current DTI of {riskAnalysis?.dti?.toFixed(1) || 0}% is within safe limits. Keep existing EMIs below 40% of income.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-medium mb-2">Credit Health</h4>
              <p className="text-sm text-gray-400">
                Your credit score of {loanDetails.creditScore} is in the good range. Maintain timely payments to improve further.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}