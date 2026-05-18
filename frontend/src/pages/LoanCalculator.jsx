import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalculator, FaChartPie, FaTable, FaDownload, FaMoneyBill,
  FaPercent, FaCalendar, FaShieldAlt, FaCheck, FaTimes, FaInfoCircle,
  FaClock, FaUniversity, FaChartLine, FaTerminal, FaMoneyBillWave
} from 'react-icons/fa';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#475569'];

export default function LoanCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: 500000,
    interestRate: 12,
    tenureMonths: 36,
    processingFee: 5000,
    annualIncome: 600000,
    creditScore: 700
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAmortization, setShowAmortization] = useState(false);

  useEffect(() => {
    calculateLoan();
  }, []);

  const calculateLoan = async () => {
    setLoading(true);
    try {
      const res = await api.post('/calculator/calculate', inputs);
      setResult(res.data);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'loanAmount' || name === 'interestRate' || name === 'tenureMonths' ||
               name === 'processingFee' || name === 'annualIncome' || name === 'creditScore'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getPieData = () => {
    if (!result) return [];
    return [
      { name: 'Principal', value: result.principalAmount },
      { name: 'Interest', value: result.totalInterest },
      { name: 'Processing Fee', value: result.processingFee }
    ];
  };

  const getAmortizationChartData = () => {
    if (!result?.amortizationSchedule) return [];
    return result.amortizationSchedule.filter((_, i) => i % 3 === 0 || i === result.amortizationSchedule.length - 1);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-4">
            <FaTerminal className="text-cyan-400 text-xs" />
            <span className="text-cyan-300 text-[10px] font-mono tracking-widest uppercase">Simulation Interface</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">Quantum EMI Simulator</h1>
          <p className="text-slate-400 font-light">Synthesize variables to model credit amortization pipelines</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 glass-card p-6 border border-purple-500/10 glow-purple"
          >
            <h3 className="text-md font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
              <FaMoneyBill className="text-purple-400" />
              Parameter Inputs
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Capital Allocation</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    name="loanAmount"
                    value={inputs.loanAmount}
                    onChange={handleInputChange}
                    onBlur={calculateLoan}
                    className="w-full bg-[#030014] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
                  />
                </div>
                <input
                  type="range"
                  name="loanAmount"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={inputs.loanAmount}
                  onChange={handleInputChange}
                  onMouseUp={calculateLoan}
                  className="w-full mt-3 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>₹10K</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Interest Rate (% p.a.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaPercent className="text-xs" /></span>
                  <input
                    type="number"
                    name="interestRate"
                    value={inputs.interestRate}
                    onChange={handleInputChange}
                    onBlur={calculateLoan}
                    step="0.1"
                    className="w-full bg-[#030014] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
                  />
                </div>
                <input
                  type="range"
                  name="interestRate"
                  min="5"
                  max="24"
                  step="0.5"
                  value={inputs.interestRate}
                  onChange={handleInputChange}
                  onMouseUp={calculateLoan}
                  className="w-full mt-3 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>5%</span>
                  <span>24%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Maturity Tenure (Months)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaCalendar className="text-xs" /></span>
                  <input
                    type="number"
                    name="tenureMonths"
                    value={inputs.tenureMonths}
                    onChange={handleInputChange}
                    onBlur={calculateLoan}
                    className="w-full bg-[#030014] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
                  />
                </div>
                <input
                  type="range"
                  name="tenureMonths"
                  min="6"
                  max="120"
                  step="6"
                  value={inputs.tenureMonths}
                  onChange={handleInputChange}
                  onMouseUp={calculateLoan}
                  className="w-full mt-3 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>6 mo</span>
                  <span>120 mo</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Processing Fee (INR)</label>
                <input
                  type="number"
                  name="processingFee"
                  value={inputs.processingFee}
                  onChange={handleInputChange}
                  onBlur={calculateLoan}
                  className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono"
                />
              </div>

              <div className="pt-5 border-t border-white/5">
                <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FaShieldAlt className="text-pink-400" />
                  Eligibility Heuristic
                </h4>
                <div className="space-y-4 font-mono">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 uppercase">Annual Gross Income (INR)</label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={inputs.annualIncome}
                      onChange={handleInputChange}
                      onBlur={calculateLoan}
                      className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 uppercase">Credit Rating Index</label>
                    <input
                      type="number"
                      name="creditScore"
                      value={inputs.creditScore}
                      onChange={handleInputChange}
                      onBlur={calculateLoan}
                      className="w-full bg-[#030014] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* EMI Display */}
            <div className="glass-card p-6 border border-cyan-500/10 glow-cyan">
              <div className="text-center">
                <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">Synthesized Monthly EMI</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-5xl md:text-6xl font-black text-white tracking-wide font-mono"
                >
                  {result ? formatCurrency(result.monthlyEmi) : '...'}
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 font-mono text-left">
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Principal</p>
                  <p className="text-base font-bold text-white">{result ? formatCurrency(result.principalAmount) : '...'}</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Interest Cost</p>
                  <p className="text-base font-bold text-cyan-400">{result ? formatCurrency(result.totalInterest) : '...'}</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Fee</p>
                  <p className="text-base font-bold text-white">{result ? formatCurrency(result.processingFee) : '...'}</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Gross Cost</p>
                  <p className="text-base font-bold text-pink-400">{result ? formatCurrency(result.totalCost) : '...'}</p>
                </div>
              </div>

              {/* Eligibility Status */}
              {result && (
                <div className={`mt-6 p-4 rounded-xl border font-mono text-left flex items-center justify-between transition-all ${
                  result.isEligible 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'bg-pink-500/10 border-pink-500/20 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.1)]'
                }`}>
                  <div className="flex items-center gap-3">
                    {result.isEligible ? (
                      <FaCheck className="text-lg text-cyan-400" />
                    ) : (
                      <FaTimes className="text-lg text-pink-500" />
                    )}
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider">{result.isEligible ? 'PROTOCOL VERIFIED' : 'PROTOCOL REJECTED'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{result.eligibilityReason}</p>
                    </div>
                  </div>
                  {result.maxEligibleAmount > 0 && (
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 uppercase">Max Allowed</p>
                      <p className="font-bold text-sm text-white mt-0.5">{formatCurrency(result.maxEligibleAmount)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="glass-card p-6 border border-purple-500/10 glow-purple">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FaChartPie className="text-purple-400" />
                  Payment Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#030014', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 text-[10px] font-mono mt-2">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500"></span> Principal</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-400"></span> Interest</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-pink-500"></span> Fees</span>
                </div>
              </div>

              {/* Balance Chart */}
              <div className="glass-card p-6 border border-purple-500/10 glow-purple">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FaChartLine className="text-cyan-400" />
                  Balance Trajectory
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getAmortizationChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" tickFormatter={(v) => `₹${v/1000}K`} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#030014', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Balance" />
                      <Line type="monotone" dataKey="cumulativeInterest" stroke="#ec4899" strokeWidth={2} dot={false} name="Interest Paid" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="glass-card p-6 border border-purple-500/10 glow-purple">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <FaTable className="text-purple-400" />
                  Amortization Schedule
                </h3>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="btn-secondary text-[11px] py-1.5 px-4 font-mono uppercase"
                >
                  {showAmortization ? 'Minimize' : 'Expand'} Ledgers
                </button>
              </div>

              {showAmortization && result?.amortizationSchedule && (
                <div className="overflow-x-auto font-mono text-left">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-white/10 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Month</th>
                        <th className="pb-3 font-semibold">Principal Allocation</th>
                        <th className="pb-3 font-semibold">Interest Yield</th>
                        <th className="pb-3 font-semibold">Monthly EMI</th>
                        <th className="pb-3 font-semibold">Residual Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortizationSchedule.slice(0, 24).map((entry) => (
                        <tr key={entry.month} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                          <td className="py-2.5 text-slate-400">{entry.month}</td>
                          <td className="py-2.5 text-cyan-400">{formatCurrency(entry.principal)}</td>
                          <td className="py-2.5 text-purple-400">{formatCurrency(entry.interest)}</td>
                          <td className="py-2.5 text-white">{formatCurrency(entry.principal + entry.interest)}</td>
                          <td className="py-2.5 text-slate-500">{formatCurrency(entry.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.amortizationSchedule.length > 24 && (
                    <p className="text-center text-slate-500 text-[10px] mt-4 uppercase">
                      DIAGNOSTICS: Showing first 24 cycles. Simulation spans {result.tenureMonths} cycles.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="glass-card p-6 border border-purple-500/10 glow-purple">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
                <FaInfoCircle className="text-pink-400" />
                Capital Optimization Tips
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-left font-mono">
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                  <FaClock className="text-purple-400 text-lg mb-2" />
                  <h4 className="font-bold text-white text-xs uppercase mb-1">Longer Term</h4>
                  <p className="text-[10px] text-slate-400 font-light leading-relaxed">Extend tenure to deflate periodic obligation indexes.</p>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4">
                  <FaMoneyBillWave className="text-cyan-400 text-lg mb-2" />
                  <h4 className="font-bold text-white text-xs uppercase mb-1">Frontload Margin</h4>
                  <p className="text-[10px] text-slate-400 font-light leading-relaxed">Inject higher down payments to reduce residual debt.</p>
                </div>
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                  <FaUniversity className="text-pink-400 text-lg mb-2" />
                  <h4 className="font-bold text-white text-xs uppercase mb-1">Node Comparison</h4>
                  <p className="text-[10px] text-slate-400 font-light leading-relaxed">Contrast rate vectors across banking nodes.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}