import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileAlt, FaCheck, FaClock, FaTimes, FaChartLine, FaPlus, FaWallet, FaShieldAlt, FaCrown } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get('/users/applications');
      const apps = res.data || [];
      setApplications(apps.slice(-5).reverse());
      setStats({
        total: apps.length,
        approved: apps.filter(a => a.status === 'APPROVED').length,
        pending: apps.filter(a => a.status === 'PENDING').length,
        rejected: apps.filter(a => a.status === 'REJECTED').length
      });
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const pieData = [
    { name: 'Approved', value: stats.approved, color: '#34d399' },
    { name: 'Pending', value: stats.pending, color: '#fbbf24' },
    { name: 'Rejected', value: stats.rejected, color: '#f87171' }
  ].filter(d => d.value > 0);

  const trendData = applications.map((app, idx) => ({
    month: `App ${idx + 1}`,
    amount: app.loanAmount || 0
  }));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="status-approved flex items-center gap-1"><FaCheck className="text-xs" />Approved</span>;
      case 'REJECTED':
        return <span className="status-rejected flex items-center gap-1"><FaTimes className="text-xs" />Rejected</span>;
      default:
        return <span className="status-pending flex items-center gap-1"><FaClock className="text-xs" />Pending</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-amber-500/3 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/3 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaCrown className="text-amber-400" />
            <span className="text-amber-400/80 text-sm font-medium uppercase tracking-wider">Premium Member</span>
          </div>
          <h1 className="text-4xl font-black mb-3">
            Welcome back, <span className="gradient-text">{user?.fullName || 'User'}</span>
          </h1>
          <p className="text-gray-400 text-lg">Here's your financial overview and loan status</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaFileAlt className="text-amber-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 gradient-text">{stats.total}</div>
            <div className="text-gray-400 text-sm font-medium">Total Applications</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaCheck className="text-green-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 text-green-400">{stats.approved}</div>
            <div className="text-gray-400 text-sm font-medium">Approved</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaClock className="text-yellow-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 text-yellow-400">{stats.pending}</div>
            <div className="text-gray-400 text-sm font-medium">Pending</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaTimes className="text-red-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 text-red-400">{stats.rejected}</div>
            <div className="text-gray-400 text-sm font-medium">Rejected</div>
          </motion.div>
        </div>

        {/* Charts and Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Approval Rate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaShieldAlt className="text-amber-400" />
              <h3 className="text-lg font-semibold">Approval Rate</h3>
            </div>
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length ? pieData : [{ name: 'No Data', value: 1, color: '#1f2937' }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20, 20, 20, 0.95)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-black gradient-text">{approvalRate}%</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Success Rate</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaChartLine className="text-amber-400" />
              <h3 className="text-lg font-semibold">Application Trend</h3>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#4b5563" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20, 20, 20, 0.95)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#d4af37"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaWallet className="text-amber-400" />
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link
                to="/apply"
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-black font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaPlus className="text-lg" />
                </div>
                <span>New Application</span>
              </Link>
              <Link
                to="/kyc"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaFileAlt className="text-amber-400 text-lg" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">Upload KYC Documents</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaChartLine className="text-indigo-400 text-lg" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">View Analytics</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-amber-400" />
              <h3 className="text-xl font-bold">Recent Applications</h3>
            </div>
            <Link to="/apply" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <FaFileAlt className="text-4xl text-amber-500/30" />
              </div>
              <p className="text-gray-400 mb-6 text-lg">No applications yet</p>
              <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
                <FaPlus /> Apply Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm uppercase tracking-wider">Loan Amount</th>
                    <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm uppercase tracking-wider">Purpose</th>
                    <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm uppercase tracking-wider">Tenure</th>
                    <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-4 text-gray-500 font-medium text-sm uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-white">₹{app.loanAmount?.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-300">{app.loanPurpose}</td>
                      <td className="py-4 px-4 text-gray-300">{app.tenure} months</td>
                      <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-4 px-4 text-gray-500 text-sm">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}