import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaFileAlt, FaShieldAlt, FaSearch, FaFilter, FaCheck,
  FaTimes, FaExclamationTriangle, FaEye, FaHistory, FaCog,
  FaIdCard, FaUserShield, FaClipboardList, FaBell, FaChartBar,
  FaChevronDown, FaChevronUp, FaUndo, FaFlag, FaTerminal
} from 'react-icons/fa';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const SEVERITY_COLORS = {
  CRITICAL: '#ec4899',
  HIGH: '#f43f5e',
  MEDIUM: '#8b5cf6',
  LOW: '#06b6d4'
};

const STATUS_COLORS = {
  OPEN: '#ec4899',
  INVESTIGATING: '#8b5cf6',
  RESOLVED: '#06b6d4'
};

export default function AdminDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState('overview');
  const [kycQueue, setKycQueue] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingKyc: 0,
    openFraudAlerts: 0,
    criticalAlerts: 0,
    approvedToday: 0,
    rejectedToday: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [kycRes, fraudRes, auditRes] = await Promise.all([
        api.get('/kyc/verification/all-pending'),
        api.get('/fraud/alerts/all'),
        api.get('/audit/recent?limit=50')
      ]);

      setKycQueue(kycRes.data || []);
      setFraudAlerts(fraudRes.data || []);
      setAuditLogs(auditRes.data || []);

      const alertCounts = await api.get('/fraud/alerts/count');
      setStats(prev => ({
        ...prev,
        pendingKyc: kycRes.data?.length || 0,
        openFraudAlerts: alertCounts.data.open || 0,
        criticalAlerts: alertCounts.data.critical || 0
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveFraudAlert = async (alertId, resolution) => {
    try {
      await api.put(`/fraud/alerts/${alertId}/resolve`, {
        resolvedBy: 'admin',
        resolution
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const overrideKycStatus = async (kycId, newStatus) => {
    try {
      await api.put(`/kyc/verification/manual-override/${kycId}`, {
        status: newStatus,
        remarks: 'Manual override by admin',
        performedBy: 'admin'
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error overriding KYC:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Telemetry Overview', icon: FaChartBar },
    { id: 'kyc', label: 'KYC Ledger', icon: FaIdCard },
    { id: 'fraud', label: 'Security Nodes', icon: FaShieldAlt },
    { id: 'audit', label: 'System Logs', icon: FaClipboardList },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden bg-[#030014]">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-4">
              <FaTerminal className="text-cyan-400 text-xs" />
              <span className="text-cyan-300 text-[10px] font-mono tracking-widest uppercase">Admin Terminal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">Quantum Control Deck</h1>
            <p className="text-slate-400 font-light text-sm mt-1">Real-time risk telemetry, biometric queues, and fraud vector streams</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-12 h-12 rounded-xl bg-slate-900/60 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.15)] hover:bg-slate-900 transition-colors">
              <FaBell />
              {stats.openFraudAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-mono text-[9px] font-bold rounded-full px-2 py-0.5 shadow-[0_0_10px_rgba(236,72,153,0.4)]">
                  {stats.openFraudAlerts}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 font-mono">
          <StatCard
            icon={FaUsers}
            label="Active Users"
            value={stats.totalUsers}
            color="#8b5cf6"
          />
          <StatCard
            icon={FaFileAlt}
            label="Inflow Apps"
            value={stats.totalApplications}
            color="#06b6d4"
          />
          <StatCard
            icon={FaIdCard}
            label="Pending KYC"
            value={stats.pendingKyc}
            color="#8b5cf6"
          />
          <StatCard
            icon={FaShieldAlt}
            label="Active Threats"
            value={stats.openFraudAlerts}
            color="#ec4899"
          />
          <StatCard
            icon={FaExclamationTriangle}
            label="Critical Threats"
            value={stats.criticalAlerts}
            color="#f43f5e"
          />
          <StatCard
            icon={FaCheck}
            label="Cleared Nodes"
            value={stats.approvedToday}
            color="#06b6d4"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-white/5 font-mono">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs uppercase tracking-wider border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold'
                  : 'bg-transparent border-white/5 text-slate-400 hover:text-white hover:border-white/10'
              }`}
            >
              <tab.icon className="text-xs" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* KYC Queue Preview */}
              <div className="glass-card p-6 border border-purple-500/10 glow-purple font-mono text-left">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FaIdCard className="text-purple-400" />
                    Biometric Verification Queue
                  </h3>
                  <button
                    onClick={() => setActiveTab('kyc')}
                    className="text-cyan-400 text-xs hover:underline uppercase font-bold"
                  >
                    Expand Queue
                  </button>
                </div>
                <div className="space-y-3.5">
                  {kycQueue.slice(0, 5).map(kyc => (
                    <div key={kyc.id} className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                      <div>
                        <p className="font-bold text-white text-xs uppercase">{kyc.userId?.slice(0, 12) || 'Anonymous'}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-light">
                          {kyc.aadhaarNumber ? `Aadhaar ID: *******${kyc.aadhaarNumber.slice(-4)}` : 'Biometric telemetry pending'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        kyc.overallStatus === 'PENDING' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.1)]' :
                        kyc.overallStatus === 'INITIATED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' :
                        'bg-slate-950 border-white/10 text-slate-500'
                      }`}>
                        {kyc.overallStatus}
                      </span>
                    </div>
                  ))}
                  {!kycQueue.length && (
                    <p className="text-slate-500 text-center py-6 text-xs uppercase">No biometric files pending verification</p>
                  )}
                </div>
              </div>

              {/* Fraud Alerts Preview */}
              <div className="glass-card p-6 border border-purple-500/10 glow-purple font-mono text-left">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FaShieldAlt className="text-pink-400" />
                    Real-time Threat Streams
                  </h3>
                  <button
                    onClick={() => setActiveTab('fraud')}
                    className="text-cyan-400 text-xs hover:underline uppercase font-bold"
                  >
                    Open Nodes
                  </button>
                </div>
                <div className="space-y-3.5">
                  {fraudAlerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                      <div>
                        <p className="font-bold text-white text-xs uppercase flex items-center gap-2">
                          <FaFlag style={{ color: SEVERITY_COLORS[alert.severity] }} className="text-xs" />
                          {alert.alertType.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-light truncate max-w-[220px]">
                          {alert.description}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold border"
                        style={{ backgroundColor: `${SEVERITY_COLORS[alert.severity]}10`, borderColor: `${SEVERITY_COLORS[alert.severity]}30`, color: SEVERITY_COLORS[alert.severity] }}>
                        {alert.severity}
                      </span>
                    </div>
                  ))}
                  {!fraudAlerts.length && (
                    <p className="text-slate-500 text-center py-6 text-xs uppercase">All systems running secure - no threat vectors</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'kyc' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card p-6 border border-purple-500/10 glow-purple font-mono text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FaIdCard className="text-purple-400" />
                  Biometric KYC Queue Ledger
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Filter User Node..."
                      className="bg-[#030014] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/10 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">User Node</th>
                      <th className="pb-3 font-semibold">Aadhaar Bio</th>
                      <th className="pb-3 font-semibold">PAN OCR</th>
                      <th className="pb-3 font-semibold">Face Liveness</th>
                      <th className="pb-3 font-semibold">Address Ledg</th>
                      <th className="pb-3 font-semibold">System State</th>
                      <th className="pb-3 font-semibold">Decision Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycQueue.map(kyc => (
                      <tr key={kyc.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 font-bold text-white">{kyc.userId?.slice(0, 12)}...</td>
                        <td className="py-3.5">
                          <StatusBadge status={kyc.aadhaarStatus} />
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={kyc.panStatus} />
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={kyc.faceVerificationStatus} />
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={kyc.addressProofStatus} />
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            kyc.overallStatus === 'VERIFIED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                            kyc.overallStatus === 'PENDING' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                            'bg-slate-950 border-white/10 text-slate-500'
                          }`}>
                            {kyc.overallStatus}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex gap-1">
                            <button
                              onClick={() => overrideKycStatus(kyc.id, 'VERIFIED')}
                              className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                              title="Authorize KYC"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => overrideKycStatus(kyc.id, 'REJECTED')}
                              className="p-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-500 hover:bg-pink-500/20 rounded transition-colors"
                              title="Reject KYC"
                            >
                              <FaTimes />
                            </button>
                            <button
                              onClick={() => setSelectedItem(kyc)}
                              className="p-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 rounded transition-colors"
                              title="Inspect File"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!kycQueue.length && (
                  <p className="text-center text-slate-500 py-8 uppercase text-xs">No biometric files in queue</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'fraud' && (
            <motion.div
              key="fraud"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card p-6 border border-purple-500/10 glow-purple font-mono text-left"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FaShieldAlt className="text-pink-400" />
                  Real-Time Security Threat Engine
                </h3>
                <div className="flex gap-2">
                  <button className="btn-secondary text-[11px] uppercase py-1.5 px-4 flex items-center gap-1.5">
                    <FaFilter /> Filter Vectors
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {fraudAlerts.map(alert => (
                  <div key={alert.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-white text-xs uppercase">{alert.alertType.replace(/_/g, ' ')}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border"
                            style={{ backgroundColor: `${SEVERITY_COLORS[alert.severity]}10`, borderColor: `${SEVERITY_COLORS[alert.severity]}30`, color: SEVERITY_COLORS[alert.severity] }}>
                            {alert.severity}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold border"
                            style={{ backgroundColor: `${STATUS_COLORS[alert.status]}10`, borderColor: `${STATUS_COLORS[alert.status]}30`, color: STATUS_COLORS[alert.status] }}>
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs font-light leading-relaxed">{alert.description}</p>
                      </div>
                      <div className="text-left md:text-right font-mono">
                        <p className="text-xs text-slate-500">
                          Threat Score: <span className="font-black text-pink-500">{alert.fraudScore}%</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                      <button
                        onClick={() => resolveFraudAlert(alert.id, 'Verified as false positive')}
                        className="btn-secondary text-[10px] py-1.5 px-4 uppercase"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => resolveFraudAlert(alert.id, 'Under investigation')}
                        className="btn-primary text-[10px] py-1.5 px-4 uppercase"
                      >
                        Launch Probe
                      </button>
                      <button className="text-cyan-400 text-[10px] uppercase font-bold hover:underline py-1.5 px-2">
                        Inspect Node Data
                      </button>
                    </div>
                  </div>
                ))}
                {!fraudAlerts.length && (
                  <p className="text-center text-slate-500 py-8 uppercase text-xs">No fraud threats detected</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card p-6 border border-purple-500/10 glow-purple font-mono text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FaClipboardList className="text-purple-400" />
                  Audit System Log Ledgers
                </h3>
                <div className="flex gap-2">
                  <select className="bg-[#030014] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500">
                    <option>All Actions</option>
                    <option>USER_REGISTERED</option>
                    <option>KYC_VERIFICATION</option>
                    <option>LOAN_APPLICATION</option>
                    <option>FRAUD_ALERT</option>
                    <option>MANUAL_OVERRIDE</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/10 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Timestamp</th>
                      <th className="pb-3 font-semibold">User Node</th>
                      <th className="pb-3 font-semibold">Action Token</th>
                      <th className="pb-3 font-semibold">Entity Map</th>
                      <th className="pb-3 font-semibold">Validator</th>
                      <th className="pb-3 font-semibold">Description Snippet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                        <td className="py-3 text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 text-white font-bold">{log.userId?.slice(0, 12)}...</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{log.entityType}</td>
                        <td className="py-3 text-cyan-400 font-bold">{log.performedBy || 'System Engine'}</td>
                        <td className="py-3 text-slate-500 max-w-[200px] truncate">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!auditLogs.length && (
                  <p className="text-center text-slate-500 py-8 uppercase text-xs">No audit entries retrieved</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 border border-purple-500/10 glow-purple flex items-center gap-3 text-left hover:border-white/10 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/5" style={{ backgroundColor: `${color}10` }}>
        <Icon style={{ color }} className="text-sm" />
      </div>
      <div>
        <p className="text-xl font-black text-white">{value}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const getStatusStyle = (s) => {
    switch (s) {
      case 'VERIFIED': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'FAILED': case 'REJECTED': return 'text-pink-500 bg-pink-500/10 border-pink-500/30';
      case 'PENDING': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-slate-500 bg-slate-950 border-white/10';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getStatusStyle(status)}`}>
      {status || 'PENDING'}
    </span>
  );
}