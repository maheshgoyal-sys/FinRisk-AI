import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaFileAlt, FaShieldAlt, FaChartLine, FaSearch, FaFilter, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
  { id: 'users', label: 'Users', icon: FaUsers },
  { id: 'applications', label: 'Applications', icon: FaFileAlt },
  { id: 'fraud', label: 'Fraud Alerts', icon: FaShieldAlt },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    approvedApplications: 0,
    fraudCases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, appsRes, analyticsRes, fraudRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/applications'),
        api.get('/admin/analytics'),
        api.get('/admin/fraud-alerts'),
      ]);

      setUsers(usersRes.data || []);
      setApplications(appsRes.data || []);
      setFraudAlerts(fraudRes.data || []);
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalApplications: appsRes.data?.length || 0,
        approvedApplications: appsRes.data?.filter(a => a.status === 'APPROVED').length || 0,
        fraudCases: fraudRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = applications.slice(-7).map((app, idx) => ({
    date: `Day ${idx + 1}`,
    applications: idx + 1,
    approved: app.status === 'APPROVED' ? 1 : 0,
  }));

  const riskDistribution = [
    { name: 'Low Risk', value: applications.filter(a => a.mlResponse?.riskLevel === 'LOW').length, color: '#10b981' },
    { name: 'Medium Risk', value: applications.filter(a => a.mlResponse?.riskLevel === 'MEDIUM').length, color: '#f59e0b' },
    { name: 'High Risk', value: applications.filter(a => a.mlResponse?.riskLevel === 'HIGH').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="status-approved">Approved</span>;
      case 'REJECTED':
        return <span className="status-rejected">Rejected</span>;
      default:
        return <span className="status-pending">Pending</span>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter(app =>
    app.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.loanAmount?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, applications, and monitor fraud</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                        <FaUsers className="text-accent-400 text-xl" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                    <div className="text-gray-400 text-sm">Total Users</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                        <FaFileAlt className="text-success text-xl" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.totalApplications}</div>
                    <div className="text-gray-400 text-sm">Total Applications</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                        <FaChartLine className="text-warning text-xl" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold">
                      {stats.totalApplications > 0
                        ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                        : 0}%
                    </div>
                    <div className="text-gray-400 text-sm">Approval Rate</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center">
                        <FaShieldAlt className="text-danger text-xl" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stats.fraudCases}</div>
                    <div className="text-gray-400 text-sm">Fraud Cases</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass p-6">
                    <h3 className="text-lg font-semibold mb-4">Application Trends</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip
                            contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="applications"
                            stroke="#3b82f6"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass p-6">
                    <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskDistribution.length ? riskDistribution : [{ name: 'No Data', value: 1, color: '#374151' }]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {riskDistribution.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      {riskDistribution.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="text-sm text-gray-400">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Search */}
                <div className="glass p-4 flex items-center gap-4">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users..."
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="glass overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">User</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Role</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Joined</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                                {user.fullName?.charAt(0) || 'U'}
                              </div>
                              <span className="font-medium">{user.fullName || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              user.role === 'ADMIN' ? 'bg-accent-500/20 text-accent-400' : 'bg-white/10'
                            }`}>
                              {user.role || 'USER'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-sm">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-4 px-6">
                            <button className="text-sm text-accent-400 hover:text-accent-300">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="glass p-4 flex items-center gap-4">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search applications..."
                      className="input-field pl-12"
                    />
                  </div>
                  <button className="btn-secondary flex items-center gap-2">
                    <FaFilter /> Filter
                  </button>
                </div>

                <div className="glass overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Applicant</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Purpose</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(app => (
                        <tr key={app._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 px-6">{app.fullName || 'Unknown'}</td>
                          <td className="py-4 px-6 font-mono">₹{app.loanAmount?.toLocaleString()}</td>
                          <td className="py-4 px-6">{app.loanPurpose}</td>
                          <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                          <td className="py-4 px-6 text-gray-400 text-sm">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'fraud' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  {fraudAlerts.length === 0 ? (
                    <div className="glass p-12 text-center">
                      <FaShieldAlt className="text-4xl text-success mx-auto mb-4" />
                      <p className="text-gray-400">No fraud alerts detected</p>
                    </div>
                  ) : (
                    fraudAlerts.map((alert, idx) => (
                      <div key={alert._id || idx} className="glass p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            alert.severity === 'HIGH' ? 'bg-danger/20' :
                            alert.severity === 'MEDIUM' ? 'bg-warning/20' : 'bg-accent-500/20'
                          }`}>
                            <FaExclamationTriangle className={
                              alert.severity === 'HIGH' ? 'text-danger' :
                              alert.severity === 'MEDIUM' ? 'text-warning' : 'text-accent-400'
                            } />
                          </div>
                          <div>
                            <p className="font-medium">{alert.description || 'Suspicious activity detected'}</p>
                            <p className="text-sm text-gray-400">
                              User: {alert.userId?.fullName || 'Unknown'} | {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn-secondary text-sm py-2">Investigate</button>
                          <button className="text-sm text-gray-400 hover:text-white">Dismiss</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}