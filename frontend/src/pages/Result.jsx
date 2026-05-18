import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheck, FaTimes, FaChartPie, FaLightbulb, FaArrowRight,
  FaMoneyBillWave, FaCalendarAlt, FaPercent, FaFileInvoice, FaShieldAlt,
  FaHandshake, FaTerminal, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

export default function Result() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      const res = await api.get(`/loan/${id}`);
      setApplication(res.data);
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center relative overflow-hidden bg-[#030014]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="glass-card p-8 border border-purple-500/20 glow-purple max-w-sm w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
          </div>
          <h3 className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-1">Synthesizing Decision Nodes</h3>
          <p className="text-slate-400 text-xs font-light">Decrypting underwriting telemetry datasets...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center relative overflow-hidden bg-[#030014]">
        <div className="text-center font-mono glass-card p-8 border border-pink-500/20 glow-pink">
          <FaExclamationTriangle className="text-pink-500 text-4xl mb-4 mx-auto" />
          <p className="text-slate-300 text-sm uppercase tracking-wider mb-6">Application Node Not Found</p>
          <Link to="/dashboard" className="btn-secondary text-xs uppercase px-6 py-3">
            Back to Deck
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = application.status === 'APPROVED';
  const confidence = application.mlResponse?.confidence || 0;
  const riskLevel = application.mlResponse?.riskLevel || 'MEDIUM';
  const loanDetails = application.mlResponse?.loanDetails || {};

  const riskData = [
    { name: 'Confidence', value: confidence * 100, fill: isApproved ? '#06b6d4' : '#ec4899' },
  ];

  const breakdownData = [
    { name: 'Principal', value: loanDetails.loan_amount || application.loanAmount || 0, color: '#8b5cf6' },
    { name: 'Interest', value: loanDetails.total_interest || 0, color: '#06b6d4' },
  ];

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'LOW':
        return <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">LOW RISK NODE</span>;
      case 'MEDIUM':
        return <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">MEDIUM RISK NODE</span>;
      case 'HIGH':
        return <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-pink-500/10 border border-pink-500/30 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.2)]">HIGH RISK NODE</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden bg-[#030014]">
      {/* Decorative Cyber Grid & Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        {/* Decision Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-card p-10 md:p-12 text-center mb-8 border relative overflow-hidden ${
            isApproved
              ? 'border-cyan-500/30 glow-cyan bg-cyan-950/5'
              : 'border-pink-500/30 glow-pink bg-pink-950/5'
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none"></div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center relative border ${
              isApproved 
                ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                : 'bg-pink-500/10 border-pink-400/40 text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]'
            }`}
          >
            <div className="absolute inset-0 rounded-2xl animate-ping opacity-10" style={{ background: isApproved ? '#06b6d4' : '#ec4899' }}></div>
            {isApproved ? (
              <FaCheck className="text-4xl text-cyan-400" />
            ) : (
              <FaTimes className="text-4xl text-pink-500" />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-4xl md:text-5xl font-black mb-3 tracking-wide uppercase font-mono ${
              isApproved ? 'text-cyan-400' : 'text-pink-500'
            }`}
          >
            {isApproved ? 'Node Authorized' : 'Security Halt'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-slate-400 max-w-lg mx-auto font-light"
          >
            {isApproved
              ? 'AI telemetric engine has cleared your credit node profile under optimized liquidity pathways.'
              : 'AI security underwriting has flagged risk variables. Capital issuance halted.'}
          </motion.p>

          {isApproved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs shadow-[0_0_10px_rgba(139,92,246,0.15)]"
            >
              <FaHandshake />
              <span>Optimum Tier Authorization</span>
            </motion.div>
          )}
        </motion.div>

        {/* Loan Summary Card - Only show if approved */}
        {isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 mb-6 border border-purple-500/10 glow-purple font-mono"
          >
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <FaMoneyBillWave className="text-cyan-400" /> Capital Summary Details
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                  <FaFileInvoice className="text-slate-400/80 text-xs" />
                  <span className="text-[10px] uppercase">Principal</span>
                </div>
                <div className="text-xl font-bold text-white">
                  ₹{(loanDetails.loan_amount || application.loanAmount || 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                  <FaCalendarAlt className="text-cyan-400/80 text-xs" />
                  <span className="text-[10px] uppercase">Monthly EMI</span>
                </div>
                <div className="text-xl font-bold text-cyan-400">
                  ₹{Number(loanDetails.monthly_emi || 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                  <FaPercent className="text-purple-400/80 text-xs" />
                  <span className="text-[10px] uppercase">Interest Vector</span>
                </div>
                <div className="text-xl font-bold text-purple-400 font-mono">
                  {loanDetails.interest_rate || 0}%
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                  <FaCalendarAlt className="text-slate-400/80 text-xs" />
                  <span className="text-[10px] uppercase">Cycle Tenure</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {loanDetails.tenure_months || application.tenure || 0} <span className="text-xs text-slate-500">mo</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Breakdown Card - Only show if approved */}
        {isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 md:p-8 mb-6 border border-purple-500/10 glow-purple font-mono"
          >
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider text-left">Financial Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Pie Chart */}
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {breakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#030014',
                          border: '1px solid rgba(139,92,246,0.2)',
                          borderRadius: '12px',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}
                        formatter={(value) => `₹${Number(value).toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span className="text-slate-500 text-[10px] uppercase">Aggregate</span>
                    <span className="text-xl font-bold text-white mt-1">₹{Number(loanDetails.total_payment || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 text-left text-xs font-mono">
                <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-white/5">
                  <span className="text-slate-400">Principal Allocation</span>
                  <span className="font-bold text-purple-400 text-sm">
                    ₹{(loanDetails.loan_amount || application.loanAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-white/5">
                  <span className="text-slate-400">Yield Interest Cost</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    ₹{Number(loanDetails.total_interest || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-xl border border-white/5">
                  <span className="text-slate-400">Processing Margin (1%)</span>
                  <span className="font-bold text-white text-sm">
                    ₹{Number(loanDetails.processing_fee || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                  <span className="text-white font-bold uppercase tracking-wider">Gross Outlay</span>
                  <span className="text-lg font-black text-white">
                    ₹{Number(loanDetails.total_payment || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Decision Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 md:p-8 mb-6 border border-purple-500/10 glow-purple font-mono"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Confidence Score */}
            <div className="text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-6">Confidence Coefficient</h3>
              <div className="h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={riskData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background={{ fill: 'rgba(255,255,255,0.02)' }}
                      dataKey="value"
                      cornerRadius={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#030014',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: '12px'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 bottom-6 flex items-center justify-center">
                  <span className="text-3xl font-black text-white">{Math.round(confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-6">ML Telemetry Risk</h3>
              <div className="flex items-center justify-center h-32">
                {getRiskBadge()}
              </div>
            </div>

            {/* Loan Details */}
            <div className="text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-6">Commit Parameters</h3>
              <div className="h-32 flex flex-col items-center justify-center space-y-2">
                <FaFileInvoice className="text-3xl text-purple-400/50 mb-1" />
                <div className="text-2xl font-black text-white">
                  ₹{application.loanAmount?.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{application.tenure} CYCLES MATURITY</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 md:p-8 mb-6 border border-purple-500/10 glow-purple font-mono text-left"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <FaChartPie className="text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Model Explanation</h3>
              <p className="text-[10px] text-slate-500 uppercase">Underwriting telemetry neural engine</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 mb-6 text-sm text-slate-300 leading-relaxed font-light">
            {application.aiExplanation || 'Decision vectors computed utilizing holistic credit profiles, including debt ratios, liquidity metrics, tenure, and credit index ratings.'}
          </div>

          {/* Key Factors */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-500/5 p-5 rounded-2xl border border-cyan-500/10">
              <div className="flex items-center gap-2 mb-4 font-bold text-cyan-400">
                <FaCheck />
                <span className="text-xs uppercase tracking-wider">Telemetry Strengths</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"></span>
                  Credit Score Index: {application.creditScore || 'EXCELLENT'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"></span>
                  Periodic Inflow: ₹{application.monthlyIncome?.toLocaleString()}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"></span>
                  Professional Tenure: {application.employmentYears} cycles
                </li>
              </ul>
            </div>
            <div className="bg-purple-500/5 p-5 rounded-2xl border border-purple-500/10">
              <div className="flex items-center gap-2 mb-4 font-bold text-purple-400">
                <FaLightbulb />
                <span className="text-xs uppercase tracking-wider">Optimization Signals</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
                  Maintain stable liquidity vectors
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
                  Reduce residual debt leverages
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
                  Scale credit histories
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center font-mono mt-8"
        >
          <Link to="/dashboard" className="btn-secondary uppercase text-xs px-8 py-3.5">
            Return to Deck
          </Link>
          {isApproved ? (
            <button className="btn-primary uppercase text-xs px-8 py-3.5 flex items-center justify-center gap-2">
              Proceed to Liquidity <FaArrowRight />
            </button>
          ) : (
            <Link to="/apply" className="btn-primary uppercase text-xs px-8 py-3.5 flex items-center justify-center gap-2">
              Re-submit Parameters <FaArrowRight />
            </Link>
          )}
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-slate-500 text-xs">
            <FaShieldAlt className="text-purple-400/50" />
            <span className="font-mono uppercase tracking-wider text-[10px]">Secure Ledger: Cryptographic AES-256 Underwritten</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}