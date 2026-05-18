import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaUserPlus, FaSearch, FaFilter, FaCheck, FaTimes, FaEye,
  FaIdCard, FaAddressCard, FaImage, FaFileAlt, FaMoneyBill, FaCalendar,
  FaBuilding, FaPhone, FaEnvelope, FaClock, FaShieldAlt, FaUndo,
  FaFileUpload, FaDownload, FaChartLine, FaExclamationTriangle, FaTerminal
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
  const [userDocuments, setUserDocuments] = useState({});

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

  const loadUserDocuments = async (userId) => {
    try {
      const res = await api.get(`/kyc/user/${userId}/documents`);
      setUserDocuments(prev => ({ ...prev, [userId]: res.data || [] }));
    } catch (error) {
      console.error('Error loading user documents:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    loadUserDocuments(user.id);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden bg-[#030014]">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(139,92,246,0.2)] mb-4">
            <FaTerminal className="text-purple-400 text-xs" />
            <span className="text-purple-300 text-[10px] font-mono tracking-widest uppercase">Registry Terminal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide flex items-center gap-3">
            User Telemetry & Verification Ledger
          </h1>
          <p className="text-slate-400 font-light text-sm mt-1">Audit node profiles, verify cryptographic credentials, and manage credit application streams</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 font-mono">
          <StatCard label="Total Nodes" value={users.length} icon={FaUsers} color="#8b5cf6" />
          <StatCard
            label="KYC In Queue"
            value={users.filter(u => u.kycStatus === 'PENDING').length}
            icon={FaShieldAlt}
            color="#ec4899"
          />
          <StatCard
            label="Cleared Nodes"
            value={users.filter(u => u.kycStatus === 'VERIFIED').length}
            icon={FaCheck}
            color="#06b6d4"
          />
          <StatCard
            label="Apps Streamed"
            value={applications.length}
            icon={FaFileAlt}
            color="#8b5cf6"
          />
          <StatCard
            label="Cleared Apps"
            value={applications.filter(a => a.status === 'APPROVED').length}
            icon={FaChartLine}
            color="#06b6d4"
          />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 font-mono text-xs">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user profile name, email token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#030014] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#030014] border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Registry Profiles</option>
            <option value="PENDING">KYC In Queue</option>
            <option value="VERIFIED">Cleared Nodes</option>
            <option value="REJECTED">Flagged Nodes</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden border border-purple-500/10 glow-purple font-mono text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/10 bg-slate-900/20 uppercase tracking-wider">
                  <th className="p-4 font-semibold">User Profile</th>
                  <th className="p-4 font-semibold">Aadhaar Bio</th>
                  <th className="p-4 font-semibold">PAN OCR</th>
                  <th className="p-4 font-semibold">Address Ledg</th>
                  <th className="p-4 font-semibold">Liveness Photo</th>
                  <th className="p-4 font-semibold">KYC State</th>
                  <th className="p-4 font-semibold">Apps Queue</th>
                  <th className="p-4 font-semibold text-right">Inspect</th>
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
                      className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-white uppercase text-xs">{user.fullName || 'Anonymous Node'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{user.phone || 'No phone link'}</p>
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                          user.kycStatus === 'VERIFIED' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                          user.kycStatus === 'PENDING' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                          user.kycStatus === 'REJECTED' ? 'bg-pink-500/10 border-pink-500/30 text-pink-500' :
                          'bg-slate-950 border-white/10 text-slate-500'
                        }`}>
                          {user.kycStatus || 'NOT_SUBMITTED'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] ${userApps.length > 0 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                          {userApps.length} Node(s)
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUserClick(user)}
                          className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 rounded-xl transition-all"
                          title="Inspect Telemetry"
                        >
                          <FaEye className="text-xs" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filteredUsers.length && (
            <p className="text-center text-slate-500 py-8 uppercase text-xs">No profile nodes match query</p>
          )}
        </div>

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <UserDetailModal
              user={selectedUser}
              applications={getUserApplications(selectedUser.id)}
              documents={userDocuments[selectedUser.id] || []}
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

function VerificationBadge({ status, onApprove, onReject }) {
  const getStatusStyle = (s) => {
    switch (s) {
      case 'VERIFIED': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'REJECTED': return 'text-pink-500 bg-pink-500/10 border-pink-500/30';
      case 'PENDING': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-slate-500 bg-slate-950 border-white/10';
    }
  };

  if (!status || status === 'NOT_SUBMITTED') {
    return <span className="text-slate-600 text-[10px] uppercase font-light">Unsubmitted</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getStatusStyle(status)}`}>
        {status}
      </span>
      {status === 'PENDING' && (
        <div className="flex gap-1">
          <button
            onClick={onApprove}
            className="p-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 rounded"
            title="Approve Document"
          >
            <FaCheck size={10} />
          </button>
          <button
            onClick={onReject}
            className="p-1 bg-pink-500/10 border border-pink-500/20 text-pink-500 hover:bg-pink-500/20 rounded"
            title="Reject Document"
          >
            <FaTimes size={10} />
          </button>
        </div>
      )}
    </div>
  );
}

function UserDetailModal({ user, applications, documents, onClose, onUpdateVerification }) {
  const getDocumentByType = (docType) => {
    return documents.find(d => d.documentType === docType);
  };

  const handleViewDocument = (docUrl) => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    }
  };

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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 font-mono text-left"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-purple-500/20 glow-purple bg-slate-950/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 mb-2 uppercase font-bold">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
              Inspect Mode
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wide">{user.fullName || 'Registry Profile'}</h2>
            <p className="text-slate-400 text-xs mt-1">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Personal Information */}
        <div className="p-6 border-b border-white/5 bg-slate-900/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <FaUserPlus className="text-purple-400" />
            Telemetry Registry
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <InfoRow label="Profile Name" value={user.fullName || 'N/A'} icon={FaUserPlus} />
            <InfoRow label="Email Link" value={user.email || 'N/A'} icon={FaEnvelope} />
            <InfoRow label="Phone Node" value={user.phone || 'N/A'} icon={FaPhone} />
            <InfoRow label="Deployment" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} icon={FaClock} />
          </div>
        </div>

        {/* Document Verification */}
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-purple-400" />
            Biometric Credential Matrix
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <DocumentVerificationCard
              title={getDocumentByType('AADHAAR')?.fileName || 'Aadhaar ID Card'}
              status={user.aadhaarStatus}
              details={user.aadhaarNumber ? `**** **** ${user.aadhaarNumber.slice(-4)}` : 'Biometric unsubmitted'}
              onApprove={() => onUpdateVerification(user.id, 'aadhaar', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'aadhaar', 'REJECTED')}
              icon={FaIdCard}
              docUrl={getDocumentByType('AADHAAR')?.fileUrl}
              onView={() => handleViewDocument(getDocumentByType('AADHAAR')?.fileUrl)}
              document={getDocumentByType('AADHAAR')}
            />
            <DocumentVerificationCard
              title={getDocumentByType('PAN')?.fileName || 'PAN Tax Card'}
              status={user.panStatus}
              details={user.panNumber || 'Credential unsubmitted'}
              onApprove={() => onUpdateVerification(user.id, 'pan', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'pan', 'REJECTED')}
              icon={FaFileAlt}
              docUrl={getDocumentByType('PAN')?.fileUrl}
              onView={() => handleViewDocument(getDocumentByType('PAN')?.fileUrl)}
              document={getDocumentByType('PAN')}
            />
            <DocumentVerificationCard
              title={getDocumentByType('ADDRESS')?.fileName || 'Verification Proof'}
              status={user.addressStatus}
              details={user.address || 'Address unsubmitted'}
              onApprove={() => onUpdateVerification(user.id, 'address', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'address', 'REJECTED')}
              icon={FaAddressCard}
              docUrl={getDocumentByType('ADDRESS')?.fileUrl}
              onView={() => handleViewDocument(getDocumentByType('ADDRESS')?.fileUrl)}
              document={getDocumentByType('ADDRESS')}
            />
            <DocumentVerificationCard
              title={getDocumentByType('PHOTO')?.fileName || 'Facial Telemetry'}
              status={user.photoStatus}
              details={user.photoVerified ? 'Telemetry uploaded' : 'Facial match unsubmitted'}
              onApprove={() => onUpdateVerification(user.id, 'photo', 'VERIFIED')}
              onReject={() => onUpdateVerification(user.id, 'photo', 'REJECTED')}
              icon={FaImage}
              docUrl={getDocumentByType('PHOTO')?.fileUrl}
              onView={() => handleViewDocument(getDocumentByType('PHOTO')?.fileUrl)}
              document={getDocumentByType('PHOTO')}
            />
          </div>
        </div>

        {/* Loan Applications */}
        <div className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <FaMoneyBill className="text-purple-400" />
            Credit Node Application Log
          </h3>

          {applications.length === 0 ? (
            <div className="text-center py-8 text-slate-500 border border-dashed border-white/5 rounded-2xl">
              <FaFileAlt className="text-3xl mx-auto mb-3 opacity-30" />
              <p className="text-xs uppercase">No applications in stream</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase">Node is locked until biometric verification cleared</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, idx) => (
                <div key={idx} className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-colors">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                        app.status === 'APPROVED' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' :
                        app.status === 'REJECTED' ? 'text-pink-500 bg-pink-500/10 border-pink-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' :
                        'text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-light">
                      TIMESTAMP: {app.createdAt ? new Date(app.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <DetailCard
                      label="Principal Loan"
                      value={formatCurrency(app.loanAmount)}
                      icon={FaMoneyBill}
                    />
                    <DetailCard
                      label="Tenure Cycle"
                      value={`${app.tenure} Months`}
                      icon={FaCalendar}
                    />
                    <DetailCard
                      label="Monthly Telemetry EMI"
                      value={formatCurrency(app.mlResponse?.confidence ? app.loanAmount / app.tenure : 0)}
                      icon={FaChartLine}
                    />
                  </div>

                  {/* Payment Details */}
                  <div className="mt-5 pt-4 border-t border-white/5 text-left">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quantum Amortization Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Base Principal</p>
                        <p className="text-sm font-bold text-white mt-1">{formatCurrency(app.loanAmount)}</p>
                      </div>
                      <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Aggregated Interest</p>
                        <p className="text-sm font-bold text-purple-400 mt-1">
                          {formatCurrency((app.mlResponse?.confidence || 0.2) * app.loanAmount)}
                        </p>
                      </div>
                      <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Cumulative Return</p>
                        <p className="text-sm font-bold text-white mt-1">
                          {formatCurrency(app.loanAmount * 1.2)}
                        </p>
                      </div>
                      <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Decision Engine</p>
                        <p className={`text-sm font-bold mt-1 ${app.mlResponse?.approved ? 'text-cyan-400' : 'text-pink-500'}`}>
                          {app.mlResponse?.approved ? 'CLEAR / APPROVED' : 'FAIL / REJECTED'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  {app.aiExplanation && (
                    <div className="mt-4 p-4 bg-slate-950 border border-white/5 rounded-2xl text-left">
                      <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">AI Engine Recommendation Log</h4>
                      <p className="text-[11px] text-slate-300 font-light leading-relaxed">{app.aiExplanation}</p>
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
    <div className="flex items-center gap-3 bg-slate-950 border border-white/5 rounded-xl p-3 text-left">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
        <Icon className="text-slate-400 text-xs" />
      </div>
      <div>
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="font-bold text-white text-xs mt-0.5 truncate max-w-[150px]">{value}</p>
      </div>
    </div>
  );
}

function DocumentVerificationCard({ title, status, details, onApprove, onReject, icon: Icon, docUrl, onView, document }) {
  const getStatusColorClass = (s) => {
    switch (s) {
      case 'VERIFIED': return 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400';
      case 'REJECTED': return 'border-pink-500/20 bg-pink-500/5 text-pink-500';
      case 'PENDING': return 'border-purple-500/20 bg-purple-500/5 text-purple-400';
      default: return 'border-white/5 bg-slate-900/30 text-slate-500';
    }
  };

  return (
    <div className={`border rounded-2xl p-4 text-left transition-all ${getStatusColorClass(status)}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-center shrink-0">
          <Icon className="text-base text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-xs truncate">{title || 'Unknown Document'}</p>
          <p className="text-[10px] text-slate-400 mt-1 truncate">{details}</p>
          {document?.uploadedAt && (
            <p className="text-[9px] text-slate-500 mt-0.5">
              UPLOADED: {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-[9px] font-bold uppercase tracking-wider">
          STATE: {status || 'NOT_SUBMITTED'}
        </span>
        <div className="flex items-center gap-1.5">
          {docUrl && (
            <button
              onClick={onView}
              className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-[10px] hover:bg-cyan-500/20 font-bold transition-all flex items-center gap-1"
              title={`View ${title}`}
            >
              <FaEye /> VIEW
            </button>
          )}
          {status === 'PENDING' && (
            <>
              <button
                onClick={onApprove}
                className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-[10px] hover:bg-cyan-500/25 font-bold transition-all"
              >
                CLEAR
              </button>
              <button
                onClick={onReject}
                className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-lg text-[10px] hover:bg-pink-500/25 font-bold transition-all"
              >
                FLAG
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, icon: Icon }) {
  return (
    <div className="text-center bg-slate-950/60 border border-white/5 rounded-xl p-3.5">
      <Icon className="text-slate-500 mx-auto mb-2 text-sm animate-pulse" />
      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="font-black text-white text-xs mt-1">{value}</p>
    </div>
  );
}