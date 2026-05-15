import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaChartPie, FaLightbulb, FaArrowRight, FaMoneyBillWave, FaCalendarAlt, FaPercent, FaFileInvoice, FaShieldAlt, FaHandshake } from 'react-icons/fa';
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
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-gray-400 mt-4 text-center">Analyzing your application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Application not found</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
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
    { name: 'Confidence', value: confidence * 100, fill: isApproved ? '#34d399' : '#f87171' },
  ];

  const breakdownData = [
    { name: 'Principal', value: loanDetails.loan_amount || application.loanAmount || 0, color: '#d4af37' },
    { name: 'Interest', value: loanDetails.total_interest || 0, color: '#6366f1' },
  ];

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'LOW':
        return <span className="risk-low">Low Risk</span>;
      case 'MEDIUM':
        return <span className="risk-medium">Medium Risk</span>;
      case 'HIGH':
        return <span className="risk-high">High Risk</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-amber-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Decision Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-12 rounded-3xl mb-8 relative overflow-hidden ${
            isApproved
              ? 'bg-gradient-to-br from-green-500/10 to-amber-500/10'
              : 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
          }`}
        >
          <div className={`absolute inset-0 ${isApproved ? 'opacity-20' : 'opacity-10'}`} style={{
            background: isApproved
              ? 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)'
              : 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)'
          }}></div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className={`w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center relative ${
              isApproved ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: isApproved ? '#34d399' : '#f87171' }}></div>
            {isApproved ? (
              <FaCheck className="text-5xl text-white" />
            ) : (
              <FaTimes className="text-5xl text-white" />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl md:text-5xl font-black mb-4 ${
              isApproved ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isApproved ? 'Congratulations!' : 'Application Declined'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-400"
          >
            {isApproved
              ? 'Your loan application has been approved with premium terms'
              : 'Your loan application was not approved at this time'}
          </motion.p>

          {isApproved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20"
            >
              <FaHandshake className="text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Premium Approval</span>
            </motion.div>
          )}
        </motion.div>

        {/* Loan Summary Card - Only show if approved */}
        {isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-8 mb-6 glow-gold"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <FaMoneyBillWave className="text-amber-400" />
              <span className="gradient-text">Loan Summary</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Principal Amount */}
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-colors">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <FaFileInvoice className="text-amber-400/70" />
                  <span className="text-xs uppercase tracking-wider">Principal</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  ₹{(loanDetails.loan_amount || application.loanAmount || 0).toLocaleString()}
                </div>
              </div>

              {/* Monthly EMI */}
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-green-500/20 transition-colors">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <FaCalendarAlt className="text-green-400/70" />
                  <span className="text-xs uppercase tracking-wider">Monthly EMI</span>
                </div>
                <div className="text-2xl font-black font-mono text-green-400">
                  ₹{Number(loanDetails.monthly_emi || 0).toLocaleString()}
                </div>
              </div>

              {/* Interest Rate */}
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <FaPercent className="text-indigo-400/70" />
                  <span className="text-xs uppercase tracking-wider">Interest Rate</span>
                </div>
                <div className="text-2xl font-black font-mono text-indigo-400">
                  {loanDetails.interest_rate || 0}%
                </div>
              </div>

              {/* Tenure */}
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-colors">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <FaCalendarAlt className="text-amber-400/70" />
                  <span className="text-xs uppercase tracking-wider">Tenure</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {loanDetails.tenure_months || application.tenure || 0} <span className="text-sm text-gray-400">months</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Breakdown Card - Only show if approved */}
        {isApproved && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 mb-6"
          >
            <h3 className="text-2xl font-bold mb-8">Financial Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="flex items-center justify-center">
                <div className="w-72 h-72 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {breakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(20, 20, 20, 0.95)',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)'
                        }}
                        formatter={(value) => `₹${Number(value).toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-2xl font-black">₹{Number(loanDetails.total_payment || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <span className="text-gray-400">Principal Amount</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    ₹{(loanDetails.loan_amount || application.loanAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <span className="text-gray-400">Total Interest</span>
                  <span className="text-lg font-bold text-indigo-400 font-mono">
                    ₹{Number(loanDetails.total_interest || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <span className="text-gray-400">Processing Fee (1%)</span>
                  <span className="text-lg font-bold text-yellow-400 font-mono">
                    ₹{Number(loanDetails.processing_fee || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 rounded-xl border border-amber-500/30">
                  <span className="text-white font-semibold">Total Payment</span>
                  <span className="text-2xl font-black text-white font-mono">
                    ₹{Number(loanDetails.total_payment || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Decision Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass p-8 mb-6"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Confidence Score */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Confidence Score</h3>
              <div className="h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    data={riskData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background={{ fill: 'rgba(255,255,255,0.03)' }}
                      dataKey="value"
                      cornerRadius={12}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        borderRadius: '12px'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black gradient-text">{Math.round(confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Risk Assessment</h3>
              <div className="flex items-center justify-center h-44">
                {getRiskBadge()}
              </div>
            </div>

            {/* Loan Details */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Loan Details</h3>
              <div className="h-44 flex flex-col items-center justify-center space-y-3">
                <FaFileInvoice className="text-4xl text-amber-400/50 mb-2" />
                <div className="text-3xl font-black font-mono">
                  ₹{application.loanAmount?.toLocaleString()}
                </div>
                <div className="text-gray-400">{application.tenure} months tenure</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 flex items-center justify-center border border-amber-500/20">
              <FaChartPie className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-sm text-gray-400">Powered by FinRisk ML Engine</p>
            </div>
          </div>

          <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 mb-6">
            <p className="text-gray-300 leading-relaxed">
              {application.aiExplanation || 'The decision was based on a comprehensive analysis of your financial profile including income stability, credit history, debt-to-income ratio, and existing obligations.'}
            </p>
          </div>

          {/* Key Factors */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/10">
              <div className="flex items-center gap-2 mb-4">
                <FaCheck className="text-green-400" />
                <span className="font-semibold text-green-400">Strengths</span>
              </div>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/50"></span>
                  Credit Score: {application.creditScore || 'Excellent'}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/50"></span>
                  Monthly Income: ₹{application.monthlyIncome?.toLocaleString()}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/50"></span>
                  Employment: {application.employmentYears} years
                </li>
              </ul>
            </div>
            <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10">
              <div className="flex items-center gap-2 mb-4">
                <FaLightbulb className="text-amber-400" />
                <span className="font-semibold text-amber-400">Recommendations</span>
              </div>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50"></span>
                  Maintain stable income
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50"></span>
                  Reduce existing liabilities
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50"></span>
                  Build credit history
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
          {isApproved ? (
            <button className="btn-primary flex items-center justify-center gap-2">
              Proceed to Disbursement <FaArrowRight />
            </button>
          ) : (
            <Link to="/apply" className="btn-primary flex items-center justify-center gap-2">
              Try Again <FaArrowRight />
            </Link>
          )}
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <FaShieldAlt className="text-amber-500/50" />
            <span>Your data is protected with bank-grade encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}