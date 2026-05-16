import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaFileAlt, FaShieldAlt, FaSearch, FaFilter, FaCheck,
  FaTimes, FaExclamationTriangle, FaEye, FaHistory, FaCog,
  FaIdCard, FaUserShield, FaClipboardList, FaBell, FaChartBar,
  FaChevronDown, FaChevronUp, FaUndo, FaFlag
} from 'react-icons/fa';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#3b82f6'
};

const STATUS_COLORS = {
  OPEN: '#ef4444',
  INVESTIGATING: '#f59e0b',
  RESOLVED: '#10b981'
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
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'kyc', label: 'KYC Queue', icon: FaIdCard },
    { id: 'fraud', label: 'Fraud Detection', icon: FaShieldAlt },
    { id: 'audit', label: 'Audit Logs', icon: FaClipboardList },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">KYC, Fraud & Risk Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-secondary flex items-center gap-2">
              <FaBell />
              <span className="bg-danger text-xs rounded-full px-2 py-0.5">
                {stats.openFraudAlerts}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={FaUsers}
            label="Total Users"
            value={stats.totalUsers}
            color="#3b82f6"
          />
          <StatCard
            icon={FaFileAlt}
            label="Applications"
            value={stats.totalApplications}
            color="#8b5cf6"
          />
          <StatCard
            icon={FaIdCard}
            label="Pending KYC"
            value={stats.pendingKyc}
            color="#f59e0b"
          />
          <StatCard
            icon={FaShieldAlt}
            label="Open Alerts"
            value={stats.openFraudAlerts}
            color="#ef4444"
          />
          <StatCard
            icon={FaExclamationTriangle}
            label="Critical"
            value={stats.criticalAlerts}
            color="#dc2626"
          />
          <StatCard
            icon={FaCheck}
            label="Approved"
            value={stats.approvedToday}
            color="#10b981"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-accent-500 text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* KYC Queue Preview */}
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FaIdCard className="text-warning" />
                    KYC Verification Queue
                  </h3>
                  <button
                    onClick={() => setActiveTab('kyc')}
                    className="text-accent-500 text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {kycQueue.slice(0, 5).map(kyc => (
                    <div key={kyc.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{kyc.userId}</p>
                        <p className="text-sm text-gray-400">
                          {kyc.aadhaarNumber ? `Aadhaar: ***${kyc.aadhaarNumber.slice(-4)}` : 'No documents'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        kyc.overallStatus === 'PENDING' ? 'bg-warning/20 text-warning' :
                        kyc.overallStatus === 'INITIATED' ? 'bg-accent-500/20 text-accent-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {kyc.overallStatus}
                      </span>
                    </div>
                  ))}
                  {!kycQueue.length && (
                    <p className="text-gray-500 text-center py-4">No pending verifications</p>
                  )}
                </div>
              </div>

              {/* Fraud Alerts Preview */}
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FaShieldAlt className="text-danger" />
                    Recent Fraud Alerts
                  </h3>
                  <button
                    onClick={() => setActiveTab('fraud')}
                    className="text-accent-500 text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {fraudAlerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <FaFlag style={{ color: SEVERITY_COLORS[alert.severity] }} />
                          {alert.alertType.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-400 truncate max-w-[200px]">
                          {alert.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs`}
                        style={{ backgroundColor: `${SEVERITY_COLORS[alert.severity]}20`, color: SEVERITY_COLORS[alert.severity] }}>
                        {alert.severity}
                      </span>
                    </div>
                  ))}
                  {!fraudAlerts.length && (
                    <p className="text-gray-500 text-center py-4">No fraud alerts</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'kyc' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaIdCard className="text-warning" />
                  KYC Verification Queue
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search user..."
                      className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-500"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                      <th className="pb-3">User ID</th>
                      <th className="pb-3">Aadhaar</th>
                      <th className="pb-3">PAN</th>
                      <th className="pb-3">Face</th>
                      <th className="pb-3">Address</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycQueue.map(kyc => (
                      <tr key={kyc.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 font-mono text-sm">{kyc.userId?.slice(0, 8)}...</td>
                        <td className="py-3">
                          <StatusBadge status={kyc.aadhaarStatus} />
                        </td>
                        <td className="py-3">
                          <StatusBadge status={kyc.panStatus} />
                        </td>
                        <td className="py-3">
                          <StatusBadge status={kyc.faceVerificationStatus} />
                        </td>
                        <td className="py-3">
                          <StatusBadge status={kyc.addressProofStatus} />
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            kyc.overallStatus === 'VERIFIED' ? 'bg-success/20 text-success' :
                            kyc.overallStatus === 'PENDING' ? 'bg-warning/20 text-warning' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {kyc.overallStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => overrideKycStatus(kyc.id, 'VERIFIED')}
                              className="p-2 hover:bg-success/20 rounded text-success"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => overrideKycStatus(kyc.id, 'REJECTED')}
                              className="p-2 hover:bg-danger/20 rounded text-danger"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                            <button
                              onClick={() => setSelectedItem(kyc)}
                              className="p-2 hover:bg-accent-500/20 rounded text-accent-500"
                              title="View Details"
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
                  <p className="text-center text-gray-500 py-8">No pending KYC verifications</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'fraud' && (
            <motion.div
              key="fraud"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaShieldAlt className="text-danger" />
                  Fraud Investigation Panel
                </h3>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center gap-2">
                    <FaFilter /> Filter
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {fraudAlerts.map(alert => (
                  <div key={alert.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{alert.alertType.replace(/_/g, ' ')}</span>
                          <span className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${SEVERITY_COLORS[alert.severity]}20`, color: SEVERITY_COLORS[alert.severity] }}>
                            {alert.severity}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${STATUS_COLORS[alert.status]}20`, color: STATUS_COLORS[alert.status] }}>
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{alert.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Score: <span className="font-bold text-danger">{alert.fraudScore}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => resolveFraudAlert(alert.id, 'Verified as false positive')}
                        className="btn-secondary text-sm py-1"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => resolveFraudAlert(alert.id, 'Under investigation')}
                        className="btn-primary text-sm py-1"
                      >
                        Investigate
                      </button>
                      <button className="text-accent-500 text-sm py-1 hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                {!fraudAlerts.length && (
                  <p className="text-center text-gray-500 py-8">No fraud alerts</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaClipboardList className="text-accent-500" />
                  Audit Logs
                </h3>
                <div className="flex gap-2">
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
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
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">User</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Entity</th>
                      <th className="pb-3">Performed By</th>
                      <th className="pb-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 text-sm text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 font-mono text-sm">{log.userId?.slice(0, 8)}...</td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded text-xs bg-accent-500/20 text-accent-400">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{log.entityType}</td>
                        <td className="py-3 text-sm text-gray-400">{log.performedBy || 'System'}</td>
                        <td className="py-3 text-sm text-gray-400 max-w-[200px] truncate">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!auditLogs.length && (
                  <p className="text-center text-gray-500 py-8">No audit logs</p>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const getStatusColor = (s) => {
    switch (s) {
      case 'VERIFIED': return 'text-success bg-success/20';
      case 'FAILED': case 'REJECTED': return 'text-danger bg-danger/20';
      case 'PENDING': return 'text-warning bg-warning/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
      {status || 'PENDING'}
    </span>
  );
}