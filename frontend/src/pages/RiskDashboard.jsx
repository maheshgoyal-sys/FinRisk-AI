import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine, FaShieldAlt, FaPercent, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaLightbulb, FaMoneyBillWave, FaClock,
  FaThumbsUp, FaThumbsDown, FaInfoCircle, FaMicrochip
} from 'react-icons/fa';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const RISK_COLORS = {
  LOW: '#06b6d4',      // Cyan
  MEDIUM: '#8b5cf6',   // Purple
  HIGH: '#ec4899'      // Pink
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

  const getRiskColor = (level) => RISK_COLORS[level] || '#64748b';

  const getEligibilityMeter = () => {
    if (!riskAnalysis) return 0;
    return riskAnalysis.approvalProbability || 0;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(139,92,246,0.2)] mb-4">
            <FaMicrochip className="text-purple-400 text-xs animate-spin-slow" />
            <span className="text-purple-300 text-[10px] font-mono tracking-widest uppercase">Cognitive Risk Engine Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">Quantum Risk Assessment</h1>
          <p className="text-slate-400 font-light">Advanced AI-powered neural analysis & decentralized audit logs</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Risk Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card p-6 glow-purple border border-purple-500/20"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white tracking-wide">
              <FaChartLine className="text-purple-400" />
              Risk Protocol Overview
            </h3>

            {riskAnalysis ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Risk Score Gauge */}
                <div className="text-center flex flex-col justify-center items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={getRiskColor(riskAnalysis.riskLevel)}
                        strokeWidth="8"
                        strokeDasharray={`${(riskAnalysis.riskScore / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 8px ${getRiskColor(riskAnalysis.riskLevel)})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <span className="text-4xl font-black font-mono" style={{ color: getRiskColor(riskAnalysis.riskLevel) }}>
                          {Math.round(riskAnalysis.riskScore)}
                        </span>
                        <span className="text-slate-500 text-xs font-mono">/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest border"
                    style={{ backgroundColor: `${getRiskColor(riskAnalysis.riskLevel)}15`, borderColor: `${getRiskColor(riskAnalysis.riskLevel)}40`, color: getRiskColor(riskAnalysis.riskLevel) }}>
                    {riskAnalysis.riskLevel} RISK NODE
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2 font-mono text-xs">
                      <span className="text-slate-400">DEBT-TO-INCOME (DTI)</span>
                      <span className={`font-bold ${riskAnalysis.dti < 40 ? 'text-cyan-400' : riskAnalysis.dti < 50 ? 'text-purple-400' : 'text-pink-400'}`}>
                        {riskAnalysis.dti?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${riskAnalysis.dti < 40 ? 'bg-cyan-500' : riskAnalysis.dti < 50 ? 'bg-purple-500' : 'bg-pink-500'}`}
                        style={{ width: `${Math.min(riskAnalysis.dti, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2 font-mono text-xs">
                      <span className="text-slate-400">FOIR EXPOSURE</span>
                      <span className={`font-bold ${riskAnalysis.foir < 50 ? 'text-cyan-400' : 'text-pink-400'}`}>
                        {riskAnalysis.foir?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${riskAnalysis.foir < 50 ? 'bg-cyan-500' : 'bg-pink-500'}`}
                        style={{ width: `${Math.min(riskAnalysis.foir, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
                      <FaMoneyBillWave className="text-cyan-400 text-lg mx-auto mb-2" />
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Suggested APR</p>
                      <p className="text-xl font-black text-cyan-400 font-mono mt-1">
                        {riskAnalysis.suggestedInterestRate?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
                      <FaClock className="text-purple-400 text-lg mx-auto mb-2" />
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Approval Prob</p>
                      <p className="text-xl font-black text-purple-400 font-mono mt-1">
                        {riskAnalysis.approvalProbability?.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <FaShieldAlt className="text-4xl mx-auto mb-4 opacity-30 text-purple-500 animate-pulse" />
                <p className="font-mono text-sm uppercase tracking-wider">[NO ANALYSIS LOGGED]</p>
                <p className="text-xs mt-1 text-slate-500">Deploy a loan application to construct telemetry</p>
              </div>
            )}
          </motion.div>

          {/* Eligibility Meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border border-cyan-500/20 glow-cyan"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white tracking-wide">
              <FaCheckCircle className="text-cyan-400" />
              Eligibility Vector
            </h3>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(getEligibilityMeter() / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(6,182,212,0.5))' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black font-mono text-white">
                  {getEligibilityMeter().toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="text-center mb-6 flex justify-center">
              {riskAnalysis?.isEligible ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono tracking-widest uppercase">
                  <FaCheckCircle className="animate-pulse" /> TARGET SECURED
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-mono tracking-widest uppercase">
                  <FaTimesCircle className="animate-pulse" /> BELOW THRESHOLD
                </span>
              )}
            </div>

            <div className="space-y-3 font-mono text-[10px]">
              <div className="flex justify-between text-slate-400 uppercase tracking-widest">
                <span>Secure</span>
                <span>Vulnerable</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex border border-white/5">
                <div className="w-1/3 bg-cyan-500"></div>
                <div className="w-1/3 bg-purple-500"></div>
                <div className="w-1/3 bg-pink-500"></div>
              </div>
              <p className="text-slate-500 text-center mt-2">
                NODAL PLACEMENT: {getEligibilityMeter()}%
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
            className="glass-card p-6 mt-6 border border-white/5"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <FaLightbulb className="text-cyan-400" />
              Nodal Network Diagnosis
            </h3>
            <p className="text-slate-300 leading-relaxed font-light text-sm">
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
            className="glass-card p-6 border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <FaThumbsUp className="text-cyan-400" />
              Positive Telemetry
            </h3>
            <ul className="space-y-3 font-light text-sm">
              {riskAnalysis?.positiveFactors?.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="text-cyan-400 mt-1 text-xs" />
                  <span className="text-slate-300">{factor}</span>
                </li>
              ))}
              {!riskAnalysis?.positiveFactors?.length && (
                <li className="text-slate-500 font-mono text-xs">[NO TELEMETRY RECORDED]</li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 border border-pink-500/10 hover:border-pink-500/30 transition-all duration-300"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <FaThumbsDown className="text-pink-400" />
              Network Anomaly Logs
            </h3>
            <ul className="space-y-3 font-light text-sm">
              {riskAnalysis?.negativeFactors?.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-pink-400 mt-1 text-xs" />
                  <span className="text-slate-300">{factor}</span>
                </li>
              ))}
              {!riskAnalysis?.negativeFactors?.length && (
                <li className="text-slate-500 font-mono text-xs">[NO NOMINAL CONCERNS]</li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Financial Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mt-6 border border-white/5"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            <FaInfoCircle className="text-purple-400" />
            Nodal Recommendations & Optimization
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 hover:border-purple-500/20 transition-all">
              <h4 className="font-bold mb-2 text-white text-sm tracking-wide">Liquidity Velocity</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Your monthly intake of ₹{loanDetails.monthlyIncome.toLocaleString()} positions the node for optimized asset delegation up to ₹{(loanDetails.monthlyIncome * 10).toLocaleString()}.
              </p>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 hover:border-cyan-500/20 transition-all">
              <h4 className="font-bold mb-2 text-white text-sm tracking-wide">Liability Ratios</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                DTI allocation stands at {riskAnalysis?.dti?.toFixed(1) || 0}%. Maintaining active EMIs below 40% of throughput ensures network consistency.
              </p>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 hover:border-pink-500/20 transition-all">
              <h4 className="font-bold mb-2 text-white text-sm tracking-wide">Cryptographic Trust Score</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Your trust rating of {loanDetails.creditScore} is within optimized thresholds. Timely ledger adjustments will upgrade status.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}