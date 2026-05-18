import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileAlt, FaCheck, FaClock, FaTimes, FaChartLine, FaPlus, FaWallet, FaShieldAlt, FaTerminal } from 'react-icons/fa';
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
  const [kycStatus, setKycStatus] = useState(null);

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

      // Load KYC status
      const kycRes = await api.get('/kyc/status');
      setKycStatus(kycRes.data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const pieData = [
    { name: 'Approved', value: stats.approved, color: '#06b6d4' }, // Cyan
    { name: 'Pending', value: stats.pending, color: '#8b5cf6' },    // Purple
    { name: 'Rejected', value: stats.rejected, color: '#ec4899' }   // Pink
  ].filter(d => d.value > 0);

  const trendData = applications.map((app, idx) => ({
    month: `App ${idx + 1}`,
    amount: app.loanAmount || 0
  }));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="status-approved flex items-center gap-1.5 font-mono"><FaCheck className="text-xs" />APPROVED</span>;
      case 'REJECTED':
        return <span className="status-rejected flex items-center gap-1.5 font-mono"><FaTimes className="text-xs" />REJECTED</span>;
      default:
        return <span className="status-pending flex items-center gap-1.5 font-mono"><FaClock className="text-xs" />PENDING</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <FaTerminal className="text-cyan-400 text-xs" />
              <span className="text-cyan-300 text-[10px] font-mono tracking-widest uppercase">Authorized Terminal Node</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-white">
            Welcome back, <span className="gradient-text">{user?.fullName || 'User'}</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed font-light">Here's your network overview, financial logs, and active application statuses.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 group hover:glow-purple transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <FaFileAlt className="text-purple-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 gradient-text">{stats.total}</div>
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Total Applications</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 group hover:glow-cyan transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <FaCheck className="text-cyan-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 text-cyan-400">{stats.approved}</div>
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Approved Logs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 group hover:glow-purple transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <FaClock className="text-purple-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 text-purple-400">{stats.pending}</div>
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Pending Audit</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6 group hover:glow-pink transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/5 border border-pink-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <FaTimes className="text-pink-400 text-xl" />
              </div>
            </div>
            <div className="text-4xl font-black mb-1 text-pink-400">{stats.rejected}</div>
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Rejected Nodes</div>
          </motion.div>
        </div>

        {/* Charts and Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Approval Rate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border border-purple-500/10 glow-purple"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaShieldAlt className="text-cyan-400" />
              <h3 className="text-lg font-bold text-white tracking-wide">Approval Ratio</h3>
            </div>
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length ? pieData : [{ name: 'No Data', value: 1, color: '#1e293b' }]}
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
                      background: 'rgba(3, 0, 20, 0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-black gradient-text-pink">{approvalRate}%</div>
                  <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Efficiency</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 border border-cyan-500/10 glow-cyan"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaChartLine className="text-purple-400" />
              <h3 className="text-lg font-bold text-white tracking-wide">Liquidity Trend</h3>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} fontFamily="monospace" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(3, 0, 20, 0.95)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#06b6d4"
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
            className="glass-card p-6 border border-purple-500/10"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaWallet className="text-pink-400" />
              <h3 className="text-lg font-bold text-white tracking-wide">Interface Actions</h3>
            </div>

            {/* KYC Status Banner */}
            {kycStatus && (
              <div className={`mb-5 p-3.5 rounded-xl border ${
                kycStatus.kycStatus === 'VERIFIED'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
              }`}>
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {kycStatus.kycStatus === 'VERIFIED' ? (
                      <FaCheck className="text-emerald-400 animate-pulse" />
                    ) : (
                      <FaClock className="text-amber-400 animate-pulse" />
                    )}
                    <span className="font-bold tracking-wider">
                      KYC {kycStatus.kycStatus === 'VERIFIED' ? 'SECURED' : 'UNVERIFIED'}
                    </span>
                  </div>
                  {kycStatus.kycStatus !== 'VERIFIED' && (
                    <Link to="/kyc" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors">
                      VERIFY NOW →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {kycStatus?.kycStatus === 'VERIFIED' ? (
                <Link
                  to="/apply"
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-purple-400/40 border border-transparent transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaPlus className="text-lg text-white" />
                  </div>
                  <span className="tracking-wide">Create Credit Application</span>
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 cursor-not-allowed font-mono text-sm">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                    <FaPlus className="text-lg" />
                  </div>
                  <span>Initialize KYC First</span>
                </div>
              )}
              <Link
                to="/kyc"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaFileAlt className="text-purple-400 text-lg" />
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors tracking-wide text-sm font-medium">Upload Protocol Docs</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaChartLine className="text-cyan-400 text-lg" />
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors tracking-wide text-sm font-medium">Analyze Risk Metrics</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-8 border border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-cyan-400" />
              <h3 className="text-xl font-bold text-white tracking-wide">Audit Trail: Credit Applications</h3>
            </div>
            <Link to="/apply" className="text-cyan-400 hover:text-cyan-300 text-xs font-mono uppercase tracking-wider transition-colors">
              Request Full Logs →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                <FaFileAlt className="text-4xl text-cyan-500/30" />
              </div>
              <p className="text-slate-400 mb-6 text-lg font-light">No configured logs detected on this node.</p>
              <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
                <FaPlus /> Initialize Application
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 font-mono text-xs uppercase tracking-widest text-left">
                    <th className="py-4 px-4 font-semibold">Value (INR)</th>
                    <th className="py-4 px-4 font-semibold">Target Node</th>
                    <th className="py-4 px-4 font-semibold">Duration</th>
                    <th className="py-4 px-4 font-semibold">Audit State</th>
                    <th className="py-4 px-4 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-white/[0.01] transition-colors font-light text-slate-300">
                      <td className="py-4 px-4 font-mono font-semibold text-white">₹{app.loanAmount?.toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm">{app.loanPurpose}</td>
                      <td className="py-4 px-4 text-sm">{app.tenure} months</td>
                      <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-4 px-4 text-slate-500 text-xs font-mono">
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