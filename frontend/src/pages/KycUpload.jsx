import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFilePdf, FaImage, FaCheck, FaTimes, FaTrash, FaPaperPlane, FaClock, FaTerminal, FaShieldAlt } from 'react-icons/fa';
import api from '../services/api';

const documentTypes = [
  { id: 'AADHAAR', label: 'Aadhaar Card', required: true },
  { id: 'PAN', label: 'PAN Card', required: true },
  { id: 'ADDRESS', label: 'Address Proof', required: true },
  { id: 'PHOTO', label: 'Profile Photo', required: true },
];

export default function KycUpload() {
  const [documents, setDocuments] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await api.get('/kyc/status');
      setUploadedDocs(res.data.documents || []);
      setKycStatus(res.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  // Check if all 4 documents are uploaded
  const uploadedTypes = uploadedDocs.map(d => d.documentType);
  const allDocumentsUploaded = documentTypes.every(doc => uploadedTypes.includes(doc.id));

  const handleSubmitForReview = () => {
    setSubmitted(true);
  };

  const handleFileSelect = async (docType, file) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PDF, JPG, or PNG files only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setDocuments(prev => ({ ...prev, [docType]: file }));
    await uploadFile(docType, file);
  };

  const uploadFile = async (docType, file) => {
    setUploadProgress(prev => ({ ...prev, [docType]: 0 }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', docType);

    try {
      const res = await api.post('/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [docType]: progress }));
        },
      });

      setUploadedDocs(prev => [...prev, res.data]);
      setDocuments(prev => ({ ...prev, [docType]: null }));
      setUploadProgress(prev => ({ ...prev, [docType]: null }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload document. Please try again.');
      setUploadProgress(prev => ({ ...prev, [docType]: null }));
    }
  };

  const handleDelete = async (docId) => {
    try {
      await api.delete(`/kyc/${docId}`);
      setUploadedDocs(prev => prev.filter(d => d._id !== docId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDrop = (e, docType) => {
    e.preventDefault();
    setDragActive(null);
    const file = e.dataTransfer.files[0];
    handleFileSelect(docType, file);
  };

  const getDocStatus = (docType) => {
    const doc = uploadedDocs.find(d => d.documentType === docType);
    if (doc) {
      return { status: doc.status, doc };
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-4">
            <FaTerminal className="text-cyan-400 text-xs" />
            <span className="text-cyan-300 text-[10px] font-mono tracking-widest uppercase">Identity Verification Gateway</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">KYC Cryptographic Ledger</h1>
          <p className="text-slate-400 font-light">Upload and lock your credentials into our verified risk telemetry engine</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {documentTypes.map((doc, idx) => {
            const docStatus = getDocStatus(doc.id);
            const isUploaded = docStatus && docStatus.status === 'VERIFIED';
            const isPending = docStatus && docStatus.status === 'PENDING';
            const isRejected = docStatus && docStatus.status === 'REJECTED';

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-6 border transition-all ${
                  isUploaded ? 'border-cyan-500/40 glow-cyan bg-cyan-950/10' : 'border-purple-500/10 glow-purple bg-purple-950/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white tracking-wide text-sm font-mono uppercase">{doc.label}</h3>
                  {isUploaded && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <FaCheck /> VERIFIED
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-mono bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center gap-1 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                      <FaClock className="animate-spin text-[10px]" /> PENDING
                    </span>
                  )}
                  {isRejected && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-mono bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center gap-1 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                      <FaTimes /> REJECTED
                    </span>
                  )}
                </div>

                {uploadProgress[doc.id] !== null && uploadProgress[doc.id] !== undefined && (
                  <div className="mb-4 bg-slate-900/60 p-3 rounded-xl border border-white/5 font-mono">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${uploadProgress[doc.id]}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 flex justify-between">
                      <span>UPLOADING SECURE BINARY...</span>
                      <span className="text-cyan-400 font-bold">{uploadProgress[doc.id]}%</span>
                    </p>
                  </div>
                )}

                {docStatus?.doc ? (
                  <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                          <FaFilePdf className="text-xl text-pink-400" />
                        </div>
                        <div className="font-mono text-left">
                          <p className="text-xs font-semibold text-white truncate max-w-[160px]">
                            {docStatus.doc.fileName}
                          </p>
                          <p className="text-[9px] text-slate-500 mt-0.5">
                            COMMITTED: {new Date(docStatus.doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {!isUploaded && (
                        <button
                          onClick={() => handleDelete(docStatus.doc._id)}
                          className="w-8 h-8 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 hover:text-pink-300 flex items-center justify-center transition-all"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border border-dashed rounded-2xl p-8 text-center transition-all ${
                      dragActive === doc.id
                        ? 'border-cyan-400 bg-cyan-500/5 glow-cyan'
                        : 'border-white/10 hover:border-white/20 bg-slate-900/10'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(doc.id); }}
                    onDragLeave={() => setDragActive(null)}
                    onDrop={(e) => handleDrop(e, doc.id)}
                  >
                    <FaCloudUploadAlt className="text-4xl text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-300 text-xs font-semibold mb-1">Drag & drop encrypted document here</p>
                    <p className="text-[10px] text-slate-500 mb-4 font-mono">PDF, JPG, PNG (MAX SCALE 10MB)</p>
                    <input
                      type="file"
                      id={`file-${doc.id}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(doc.id, e.target.files[0])}
                    />
                    <label
                      htmlFor={`file-${doc.id}`}
                      className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5 cursor-pointer font-mono"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mt-8 border border-purple-500/10 glow-purple font-mono"
        >
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <FaShieldAlt className="text-cyan-400" /> Ledger Verification Diagnostics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <div className="text-2xl font-black text-cyan-400">
                {uploadedDocs.filter(d => d.status === 'VERIFIED').length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">VERIFIED</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <div className="text-2xl font-black text-purple-400">
                {uploadedDocs.filter(d => d.status === 'PENDING').length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">PENDING</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
              <div className="text-2xl font-black text-pink-400">
                {uploadedDocs.filter(d => d.status === 'REJECTED').length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">REJECTED</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-2xl font-black text-white">
                {documentTypes.length - uploadedDocs.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">REQUIRED</div>
            </div>
          </div>
        </motion.div>

        {/* Submit Button or Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          {submitted || kycStatus?.kycStatus === 'PENDING' || kycStatus?.kycStatus === 'VERIFIED' ? (
            <div className="glass-card p-8 text-center border border-cyan-500/20 glow-cyan">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <FaClock className="text-3xl text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-black mb-2 text-white uppercase tracking-wide">Telemetry Pending Authorization</h3>
              <p className="text-slate-400 mb-6 font-light text-sm max-w-lg mx-auto">
                Documents have been securely cataloged. Please wait for an administrator to authorize the security node keys before initializing credit queries.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 font-mono text-xs mb-6">
                CURRENT LEDGER STATUS: {kycStatus?.kycStatus || 'PENDING_REVIEW'}
              </div>
              <div>
                <Link
                  to="/dashboard"
                  className="btn-secondary text-xs px-6 py-3 font-mono uppercase inline-block"
                >
                  Return to Control Deck
                </Link>
              </div>
            </div>
          ) : allDocumentsUploaded ? (
            <div className="glass-card p-8 text-center border border-purple-500/25 glow-purple">
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">All Secure Binaries Uploaded</h3>
              <p className="text-slate-400 mb-6 font-light text-sm">
                Diagnostic checklist resolved. Click below to lock documents and transmit keys to administrative nodes.
              </p>
              <button
                onClick={handleSubmitForReview}
                className="btn-primary flex items-center gap-2 mx-auto uppercase font-mono tracking-wider py-3.5 px-8 text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-transparent"
              >
                <FaPaperPlane /> Lock and Commit Verification
              </button>
            </div>
          ) : (
            <div className="glass-card p-6 text-center border border-white/5 bg-slate-900/10">
              <p className="text-slate-400 text-sm font-light">
                Please upload all required cryptographic components (Aadhaar, PAN, Address, Photo) to authorize ledger verification.
              </p>
              <p className="text-[11px] font-mono text-pink-400 mt-2">
                CRITICAL WARNING: {documentTypes.length - uploadedDocs.length} COMPONENT(S) REMAIN UNRESOLVED
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}