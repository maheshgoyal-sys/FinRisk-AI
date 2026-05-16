import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaUserPlus, FaSearch, FaFilter, FaCheck, FaTimes, FaEye,
  FaIdCard, FaAddressCard, FaImage, FaFileAlt, FaMoneyBill, FaCalendar,
  FaBuilding, FaPhone, FaEnvelope, FaClock, FaShieldAlt, FaUndo,
  FaFileUpload, FaDownload, FaChartLine, FaExclamationTriangle
} from 'react-icons/fa';
import api from '../services/api';

const VERIFICATION_STATUS = {
  NOT_SUBMITTED: 'Not Submitted',
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected'
};

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadUsers();
    loadApplications();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const updateUserVerification = async (userId, field, status) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, {
        field,
        status
      });
      loadUsers();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const getUserApplications = (userId) => {
    return applications.filter(app => app.userId === userId);
  };

  const getStatusBadge = (status) => {
    const styles = {
      NOT_SUBMITTED: 'bg-gray-500/20 text-gray-400',
      PENDING: 'bg-warning/20 text-warning',
      VERIFIED: 'bg-success/20 text-success',
      REJECTED: 'bg-danger/20 text-danger'
    };
    return styles[status] || styles.NOT_SUBMITTED;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FaUsers className="text-accent-500" />
            User Management & Verification
          </h1>
          <p className="text-gray-400">Verify user documents and manage loan applications</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Users" value={users.length} icon={FaUsers} color="#3b82f6" />
          <StatCard
            label="KYC Pending"
            value={users.filter(u => u.kycStatus === 'PENDING').length}
            icon={FaShieldAlt}
            color="#f59e0b"
          />
          <StatCard
            label="Verified"
            value={users.filter(u => u.kycStatus === 'VERIFIED').length}
            icon={FaCheck}
            color="#10b981"
          />
          <StatCard
            label="Applications"
            value={applications.length}
            icon={FaFileAlt}
            color="#8b5cf6"
          />
          <StatCard
            label="Approved"
            value={applications.filter(a => a.status === 'APPROVED').length}
            icon={FaChartLine}
            color="#10b981"
          />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-500"
          >
            <option value="all">All Users</option>
            <option value="PENDING">KYC Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-white/10 bg-white/5">
                  <th className="p-4">User</th>
                  <th className="p-4">Aadhaar</th>
                  <th className="p-4">PAN</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Photo</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applications</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const userApps = getUserApplications(user.id);
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{user.fullName || 'N/A'}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <VerificationBadge
                          status={user.aadhaarStatus}
                          onApprove={() => updateUserVerification(user.id, 'aadhaar', 'VERIFIED')}
                          onReject={() => updateUserVerification(user.id, 'aadhaar', 'REJECTED')}
                        />
                      </td>
                      <td className="p-4">
                        <VerificationBadge
                          status={user.panStatus}
                          onApprove={() => updateUserVerification(user.id, 'pan', 'VERIFIED')}
                          onReject={() => updateUserVerification(user.id, 'pan', 'REJECTED')}
                        />
                      </td>
                      <td className="p-4">
                        <VerificationBadge
                          status={user.addressStatus}
                          onApprove={() => updateUserVerification(user.id, 'address', 'VERIFIED')}
                          onReject={() => updateUserVerification(user.id, 'address', 'REJECTED')}
                        />
                      </td>
                      <td className="p-4">
                        <VerificationBadge
                          status={user.photoStatus}
                          onApprove={() => updateUserVerification(user.id, 'photo', 'VERIFIED')}
                          onReject={() => updateUserVerification(user.id, 'photo', 'REJECTED')}
                        />
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.kycStatus === 'VERIFIED' ? 'bg-success/20 text-success' :
                          user.kycStatus === 'PENDING' ? 'bg-warning/20 text-warning' :
                          user.kycStatus === 'REJECTED' ? 'bg-danger/20 text-danger' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.kycStatus || 'NOT_SUBMITTED'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-sm ${userApps.length > 0 ? 'text-accent-400' : 'text-gray-500'}`}>
                          {userApps.length} application(s)
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 hover:bg-accent-500/20 rounded text-accent-500 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filteredUsers.length && (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </div>

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <UserDetailModal
              user={selectedUser}
              applications={getUserApplications(selectedUser.id)}
              onClose={() => setSelectedUser(null)}
              onUpdateVerification={updateUserVerification}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
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

function VerificationBadge({ status, onApprove, onReject }) {
  const getStatusColor = (s) => {
    switch (s) {
      case 'VERIFIED': return 'text-success';
      case 'REJECTED': return 'text-danger';
      case 'PENDING': return 'text-warning';
      default: return 'text-gray-500';
    }
  };

  if (!status || status === 'NOT_SUBMITTED') {
    return <span className="text-gray-500 text-sm">Not Submitted</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
      {status === 'PENDING' && (
        <>
          <button
            onClick={onApprove}
            className="p-1 hover:bg-success/20 rounded text-success"
            title="Approve"
          >
            <FaCheck />
          </button>
          <button
            onClick={onReject}
            className="p-1 hover:bg-danger/20 rounded text-danger"
            title="Reject"
          >
            <FaTimes />
          </button>
        </>
      )}
    </div>
  );
}

function UserDetailModal({ user, applications, onClose, onUpdateVerification }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{user.fullName || 'User Details'}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUserPlus className="text-accent-500" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={user.fullName || 'N/A'} icon={FaUserPlus} />
            <InfoRow label="Email" value={user.email || 'N/A'} icon={FaEnvelope} />
            <InfoRow label="Phone" value={user.phone || 'N/A'} icon={FaPhone} />
            <InfoRow label="Registered" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} icon={FaClock} />
          </div>
        </div>

        {/* Document Verification */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-accent-500" />
            Document Verification
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <DocumentVerificationCard
              title="Aadhaar Card"
              status={user.aadhaarStatus}
              details={user.aadhaarNumber ? `****${user.aadhaarNumber.slice(-4)}` : 'Not submitted'}
              onApprove={() => onUpdateVerification(user.id, 'aadhaar', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'aadhaar', 'REJECTED')}
              icon={FaIdCard}
            />
            <DocumentVerificationCard
              title="PAN Card"
              status={user.panStatus}
              details={user.panNumber || 'Not submitted'}
              onApprove={() => onUpdateVerification(user.id, 'pan', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'pan', 'REJECTED')}
              icon={FaFileAlt}
            />
            <DocumentVerificationCard
              title="Address Proof"
              status={user.addressStatus}
              details={user.address || 'Not submitted'}
              onApprove={() => onUpdateVerification(user.id, 'address', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'address', 'REJECTED')}
              icon={FaAddressCard}
            />
            <DocumentVerificationCard
              title="Photo Verification"
              status={user.photoStatus}
              details={user.photoVerified ? 'Photo uploaded' : 'Not submitted'}
              onApprove={() => onUpdateVerification(user.id, 'photo', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'photo', 'REJECTED')}
              icon={FaImage}
            />
          </div>
        </div>

        {/* Loan Applications */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaMoneyBill className="text-accent-500" />
            Loan Applications
          </h3>

          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaFileAlt className="text-4xl mx-auto mb-4 opacity-50" />
              <p>No applications yet</p>
              <p className="text-sm">User cannot apply until all documents are verified</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'APPROVED' ? 'bg-success/20 text-success' :
                        app.status === 'REJECTED' ? 'bg-danger/20 text-danger' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <DetailCard
                      label="Loan Amount"
                      value={formatCurrency(app.loanAmount)}
                      icon={FaMoneyBill}
                    />
                    <DetailCard
                      label="Tenure"
                      value={`${app.tenure} Months`}
                      icon={FaCalendar}
                    />
                    <DetailCard
                      label="Monthly EMI"
                      value={formatCurrency(app.mlResponse?.confidence ? app.loanAmount / app.tenure : 0)}
                      icon={FaChartLine}
                    />
                  </div>

                  {/* Payment Details */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="font-medium mb-3">Payment Breakdown</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-accent-500/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400">Principal</p>
                        <p className="text-lg font-bold">{formatCurrency(app.loanAmount)}</p>
                      </div>
                      <div className="bg-warning/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400">Total Interest</p>
                        <p className="text-lg font-bold text-warning">
                          {formatCurrency((app.mlResponse?.confidence || 0.2) * app.loanAmount)}
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400">Total Payable</p>
                        <p className="text-lg font-bold">
                          {formatCurrency(app.loanAmount * 1.2)}
                        </p>
                      </div>
                      <div className="bg-success/10 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-400">Approval</p>
                        <p className="text-lg font-bold text-success">
                          {app.mlResponse?.approved ? 'Approved' : 'Rejected'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  {app.aiExplanation && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <h4 className="font-medium mb-2">AI Analysis</h4>
                      <p className="text-sm text-gray-300">{app.aiExplanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
        <Icon className="text-gray-400 text-sm" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function DocumentVerificationCard({ title, status, details, onApprove, onReject, icon: Icon }) {
  const getStatusColor = (s) => {
    switch (s) {
      case 'VERIFIED': return 'border-success bg-success/10';
      case 'REJECTED': return 'border-danger bg-danger/10';
      case 'PENDING': return 'border-warning bg-warning/10';
      default: return 'border-gray-500 bg-white/5';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(status)}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="text-xl" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-400">{details}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${
          status === 'VERIFIED' ? 'text-success' :
          status === 'REJECTED' ? 'text-danger' :
          status === 'PENDING' ? 'text-warning' :
          'text-gray-400'
        }`}>
          {status || 'NOT_SUBMITTED'}
        </span>
        {status === 'PENDING' && (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="px-3 py-1 bg-success/20 text-success rounded text-sm hover:bg-success/30"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="px-3 py-1 bg-danger/20 text-danger rounded text-sm hover:bg-danger/30"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ label, value, icon: Icon }) {
  return (
    <div className="text-center">
      <Icon className="text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}