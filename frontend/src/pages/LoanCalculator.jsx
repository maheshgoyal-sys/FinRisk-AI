import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCalculator, FaChartPie, FaTable, FaDownload, FaMoneyBill,
  FaPercent, FaCalendar, FaShieldAlt, FaCheck, FaTimes, FaInfoCircle,
  FaClock, FaUniversity, FaChartLine
} from 'react-icons/fa';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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
  const [activeTab, setActiveTab] = useState('calculator');
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
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <FaCalculator className="text-accent-500" />
            Loan EMI Calculator
          </h1>
          <p className="text-gray-400">Calculate your EMI, interest, and check eligibility instantly</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 glass p-6"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaMoneyBill className="text-accent-500" />
              Loan Details
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    name="loanAmount"
                    value={inputs.loanAmount}
                    onChange={handleInputChange}
                    onBlur={calculateLoan}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-accent-500"
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
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹10K</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Interest Rate (% p.a.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaPercent /></span>
                  <input
                    type="number"
                    name="interestRate"
                    value={inputs.interestRate}
                    onChange={handleInputChange}
                    onBlur={calculateLoan}
                    step="0.1"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent-500"
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
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>24%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tenure (Months)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaCalendar /></span>
                  <input
                    type="number"
                    name="tenureMonths"
                    value={inputs.tenureMonths}
                    onChange={handleInputChange}
                    onBlur={calculateLoan}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent-500"
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
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>6 mo</span>
                  <span>120 mo</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Processing Fee (₹)</label>
                <input
                  type="number"
                  name="processingFee"
                  value={inputs.processingFee}
                  onChange={handleInputChange}
                  onBlur={calculateLoan}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-500"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-accent-500" />
                  Eligibility Check
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Annual Income (₹)</label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={inputs.annualIncome}
                      onChange={handleInputChange}
                      onBlur={calculateLoan}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Credit Score</label>
                    <input
                      type="number"
                      name="creditScore"
                      value={inputs.creditScore}
                      onChange={handleInputChange}
                      onBlur={calculateLoan}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-500"
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
            <div className="glass p-6">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Monthly EMI</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold gradient-text"
                >
                  {result ? formatCurrency(result.monthlyEmi) : '...'}
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Principal</p>
                  <p className="text-xl font-semibold">{result ? formatCurrency(result.principalAmount) : '...'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Total Interest</p>
                  <p className="text-xl font-semibold text-warning">{result ? formatCurrency(result.totalInterest) : '...'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Processing Fee</p>
                  <p className="text-xl font-semibold">{result ? formatCurrency(result.processingFee) : '...'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">Total Cost</p>
                  <p className="text-xl font-semibold text-accent-400">{result ? formatCurrency(result.totalCost) : '...'}</p>
                </div>
              </div>

              {/* Eligibility Status */}
              {result && (
                <div className={`mt-6 p-4 rounded-lg flex items-center justify-between ${
                  result.isEligible ? 'bg-success/10' : 'bg-danger/10'
                }`}>
                  <div className="flex items-center gap-3">
                    {result.isEligible ? (
                      <FaCheck className="text-success text-xl" />
                    ) : (
                      <FaTimes className="text-danger text-xl" />
                    )}
                    <div>
                      <p className="font-medium">{result.isEligible ? 'Eligible' : 'Not Eligible'}</p>
                      <p className="text-sm text-gray-400">{result.eligibilityReason}</p>
                    </div>
                  </div>
                  {result.maxEligibleAmount > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Max Eligible</p>
                      <p className="font-semibold">{formatCurrency(result.maxEligibleAmount)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartPie className="text-accent-500" />
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
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Balance Chart */}
              <div className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartLine className="text-accent-500" />
                  Balance Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getAmortizationChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="cumulativeInterest" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaTable className="text-accent-500" />
                  Amortization Schedule
                </h3>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="btn-secondary text-sm"
                >
                  {showAmortization ? 'Hide' : 'Show'} Schedule
                </button>
              </div>

              {showAmortization && result?.amortizationSchedule && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="pb-3">Month</th>
                        <th className="pb-3">Principal</th>
                        <th className="pb-3">Interest</th>
                        <th className="pb-3">EMI</th>
                        <th className="pb-3">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortizationSchedule.slice(0, 24).map((entry) => (
                        <tr key={entry.month} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-2">{entry.month}</td>
                          <td className="py-2 text-success">{formatCurrency(entry.principal)}</td>
                          <td className="py-2 text-warning">{formatCurrency(entry.interest)}</td>
                          <td className="py-2">{formatCurrency(entry.principal + entry.interest)}</td>
                          <td className="py-2 text-gray-400">{formatCurrency(entry.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.amortizationSchedule.length > 24 && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Showing first 24 months. Total {result.tenureMonths} months.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-accent-500" />
                Ways to Reduce Your Loan Cost
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <FaClock className="text-accent-500 text-xl mb-2" />
                  <h4 className="font-medium mb-1">Longer Tenure</h4>
                  <p className="text-sm text-gray-400">Opt for longer tenure to reduce monthly EMI</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <FaIndianRupeeSign className="text-accent-500 text-xl mb-2" />
                  <h4 className="font-medium mb-1">Higher Down Payment</h4>
                  <p className="text-sm text-gray-400">Reduce principal to lower interest burden</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <FaUniversity className="text-accent-500 text-xl mb-2" />
                  <h4 className="font-medium mb-1">Compare Lenders</h4>
                  <p className="text-sm text-gray-400">Compare rates to get best deal</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}