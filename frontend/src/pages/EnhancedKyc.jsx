import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera, FaIdCard, FaUser, FaMapMarkerAlt, FaCheck, FaTimes,
  FaSpinner, FaShieldAlt, FaExclamationTriangle, FaFileAlt,
  FaFingerprint, FaVideo, FaIdCardAlt, FaHome, FaShieldVirus, FaTerminal, FaMicrochip
} from 'react-icons/fa';
import api from '../services/api';

const verificationSteps = [
  { id: 'aadhaar', label: 'Aadhaar Verification', icon: FaIdCard },
  { id: 'pan', label: 'PAN Verification', icon: FaIdCardAlt },
  { id: 'face', label: 'Face Verification', icon: FaUser },
  { id: 'address', label: 'Address Proof', icon: FaHome },
];

export default function EnhancedKyc() {
  const [currentStep, setCurrentStep] = useState(0);
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selfieMode, setSelfieMode] = useState(false);
  const [livenessChecking, setLivenessChecking] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadKycStatus();
  }, []);

  const loadKycStatus = async () => {
    try {
      const res = await api.get('/kyc/verification/status');
      setKycStatus(res.data);
    } catch (error) {
      console.error('Error loading KYC status:', error);
    }
  };

  const processDocument = async (documentType, file) => {
    setLoading(true);
    setScanning(true);
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = documentType === 'aadhaar'
        ? '/kyc/verification/aadhaar'
        : '/kyc/verification/address-proof';

      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setKycStatus(res.data);
      if (res.data.aadhaarNumber || res.data.panNumber) {
        setExtractedData({
          name: res.data.aadhaarName || res.data.panName,
          number: res.data.aadhaarNumber || res.data.panNumber,
          dob: res.data.aadhaarDob,
          address: res.data.aadhaarAddress
        });
      }

      clearInterval(progressInterval);
      setScanProgress(100);

      setTimeout(() => {
        setScanning(false);
        setCurrentStep(prev => Math.min(prev + 1, verificationSteps.length - 1));
      }, 1000);
    } catch (error) {
      console.error('Error processing document:', error);
      setScanning(false);
      clearInterval(progressInterval);
    } finally {
      setLoading(false);
    }
  };

  const startFaceVerification = async () => {
    setSelfieMode(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureSelfie = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

    setLivenessChecking(true);

    try {
      const res = await api.post('/kyc/verification/face', {
        selfieBase64: imageBase64
      });

      setKycStatus(res.data);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error in face verification:', error);
    } finally {
      setLivenessChecking(false);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setSelfieMode(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VERIFIED': return <FaCheck className="text-cyan-400" />;
      case 'FAILED': return <FaTimes className="text-pink-500" />;
      case 'PENDING': return <FaSpinner className="text-purple-400 animate-spin" />;
      default: return <FaExclamationTriangle className="text-slate-600" />;
    }
  };

  const getOverallProgress = () => {
    if (!kycStatus) return 0;
    let completed = 0;
    if (kycStatus.aadhaarStatus === 'VERIFIED') completed++;
    if (kycStatus.panStatus === 'VERIFIED') completed++;
    if (kycStatus.faceVerificationStatus === 'VERIFIED') completed++;
    if (kycStatus.addressProofStatus === 'VERIFIED') completed++;
    return (completed / 4) * 100;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 relative overflow-hidden bg-[#030014]">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-4">
            <FaTerminal className="text-cyan-400 text-xs" />
            <span className="text-cyan-300 text-[10px] font-mono tracking-widest uppercase">Quantum Verification Deck</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">Enhanced Biometric & OCR KYC</h1>
          <p className="text-slate-400 font-light">Real-time cryptographic analysis of neural security parameters</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8 border border-purple-500/10 glow-purple bg-slate-900/20"
        >
          <div className="flex items-center justify-between mb-4 font-mono">
            <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
              <FaShieldAlt className="text-cyan-400" />
              Security Protocol Progress
            </h3>
            <span className="text-xl font-bold text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              {Math.round(getOverallProgress())}%
            </span>
          </div>
          <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${getOverallProgress()}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {verificationSteps.map((step, idx) => {
              const status = kycStatus?.[step.id === 'aadhaar' ? 'aadhaarStatus' :
                               step.id === 'pan' ? 'panStatus' :
                               step.id === 'face' ? 'faceVerificationStatus' :
                               'addressProofStatus'];
              const isVerified = status === 'VERIFIED';
              const isCurrent = idx === currentStep;

              return (
                <div key={step.id} className="text-center font-mono p-3 rounded-xl border border-white/[0.02] bg-white/[0.01]">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 border transition-all
                    ${isVerified ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' :
                      status === 'FAILED' ? 'bg-pink-500/10 border-pink-500/30 text-pink-500' :
                      isCurrent ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                    <step.icon className="text-lg" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{step.label}</p>
                  {status ? (
                    <div className="flex justify-center mt-2 text-[10px] items-center gap-1.5 uppercase font-mono">
                      {getStatusIcon(status)}
                      <span className={`font-semibold ${isVerified ? 'text-cyan-400' : status === 'FAILED' ? 'text-pink-500' : 'text-purple-400'}`}>{status}</span>
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-600 mt-2 uppercase">LOCKED</p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Scanning Animation */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#030014]/90 backdrop-blur-md flex items-center justify-center z-50 px-4"
            >
              <div className="glass-card p-8 text-center max-w-sm w-full border border-cyan-500/30 glow-cyan bg-slate-900">
                <div className="relative w-48 h-48 mx-auto mb-6 bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  <div className="absolute inset-2 border border-dashed border-cyan-500/20 rounded-xl"></div>
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <FaMicrochip className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-cyan-400/30 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 font-mono uppercase tracking-widest">OCR Extraction Layer</h3>
                <p className="text-slate-400 text-xs font-light mb-6">Running semantic document analysis...</p>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mx-auto border border-white/5 mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-cyan-400">{Math.round(scanProgress)}% COMPLETE</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selfie Mode */}
        <AnimatePresence>
          {selfieMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#030014]/95 backdrop-blur-md flex items-center justify-center z-50 px-4"
            >
              <div className="glass-card p-6 w-full max-w-md border border-purple-500/30 glow-purple bg-slate-900">
                <h3 className="text-lg font-bold text-white mb-4 text-center font-mono uppercase tracking-wider">Secure Biometric Analyzer</h3>
                <div className="relative aspect-square bg-slate-950 rounded-2xl overflow-hidden mb-6 border border-purple-500/20 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Face outline overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 border-2 border-dashed border-purple-500/40 rounded-full shadow-[0_0_0_9999px_rgba(3,0,20,0.6)] flex items-center justify-center">
                      <div className="w-48 h-48 border border-purple-400/20 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Liveness detection overlay */}
                  {livenessChecking && (
                    <div className="absolute inset-0 bg-[#030014]/85 flex items-center justify-center backdrop-blur-xs">
                      <div className="text-center font-mono">
                        <FaSpinner className="text-3xl text-cyan-400 animate-spin mb-3 mx-auto" />
                        <p className="text-xs text-white uppercase tracking-widest">Running Liveness Diagnostics...</p>
                        <p className="text-[10px] text-purple-400 mt-1">SIMULATING RETINAL MATCH</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 font-mono">
                  <button
                    onClick={stopCamera}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase transition-colors"
                  >
                    Abort Capture
                  </button>
                  <button
                    onClick={captureSelfie}
                    disabled={livenessChecking}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs uppercase transition-colors"
                  >
                    {livenessChecking ? 'Analyzing...' : 'Commit Capture'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {verificationSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-6 border transition-all ${
                currentStep === idx
                  ? 'border-purple-500/30 bg-purple-950/5 glow-purple ring-1 ring-purple-500/20'
                  : 'border-white/5 bg-slate-900/10'
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  currentStep === idx
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}>
                  <step.icon className="text-xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white text-sm tracking-wide font-mono uppercase">{step.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    {step.id === 'aadhaar' && 'Upload high-resolution Aadhaar binary'}
                    {step.id === 'pan' && 'Upload government registered PAN document'}
                    {step.id === 'face' && 'Initiate secure camera terminal selfie capture'}
                    {step.id === 'address' && 'Upload secondary address validation ledger'}
                  </p>
                </div>
              </div>

              {step.id === 'face' ? (
                <div className="space-y-4">
                  {kycStatus?.faceVerificationStatus === 'VERIFIED' ? (
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 text-center font-mono">
                      <FaCheck className="text-cyan-400 text-3xl mb-3 mx-auto shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-500/10 w-12 h-12 rounded-full flex items-center justify-center" />
                      <p className="text-cyan-400 font-bold text-sm uppercase tracking-wider">Biometrics Verified</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        NEURAL MATCH ACCURACY: {Math.round(kycStatus.faceSimilarityScore || 0)}%
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={startFaceVerification}
                      className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-transparent"
                    >
                      <FaCamera />
                      Initialize Biometric Capture
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <DocumentUploader
                    documentType={step.id}
                    onUpload={(file) => processDocument(step.id, file)}
                    loading={loading}
                  />

                  {extractedData && step.id === 'aadhaar' && kycStatus?.aadhaarNumber && (
                    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-5 mt-4 text-left font-mono">
                      <h4 className="font-bold text-xs text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <FaFileAlt className="text-cyan-400" /> Decrypted Ledger Metadata
                      </h4>
                      <div className="space-y-2.5 text-xs text-slate-300">
                        <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                          <span className="text-slate-500">IDENTIFIER NAME:</span>
                          <span className="font-semibold text-white">{extractedData.name || 'UNRESOLVED'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                          <span className="text-slate-500">REGISTRATION NUM:</span>
                          <span className="font-mono font-semibold text-cyan-400 tracking-wide">{extractedData.number || 'UNRESOLVED'}</span>
                        </div>
                        {extractedData.dob && (
                          <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                            <span className="text-slate-500">TEMPORAL ORB BIRTH:</span>
                            <span className="font-semibold text-white">{extractedData.dob}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Risk Score Card */}
        {kycStatus?.overallStatus === 'VERIFIED' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 mt-8 border border-cyan-500/20 glow-cyan font-mono bg-slate-900/40"
          >
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <FaShieldVirus className="text-cyan-400 text-lg" />
              All Biometric Signatures Verified
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 text-center">
                <FaCheck className="text-cyan-400 text-xl mb-2 mx-auto" />
                <p className="font-semibold text-white text-xs uppercase">Aadhaar</p>
                <p className="text-[9px] text-slate-500 mt-0.5">COMPLETED</p>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 text-center">
                <FaCheck className="text-cyan-400 text-xl mb-2 mx-auto" />
                <p className="font-semibold text-white text-xs uppercase">PAN</p>
                <p className="text-[9px] text-slate-500 mt-0.5">COMPLETED</p>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 text-center">
                <FaCheck className="text-cyan-400 text-xl mb-2 mx-auto" />
                <p className="font-semibold text-white text-xs uppercase">Face</p>
                <p className="text-[9px] text-slate-500 mt-0.5">COMPLETED</p>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 text-center">
                <FaCheck className="text-cyan-400 text-xl mb-2 mx-auto" />
                <p className="font-semibold text-white text-xs uppercase">Address</p>
                <p className="text-[9px] text-slate-500 mt-0.5">COMPLETED</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DocumentUploader({ documentType, onUpload, loading }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  return (
    <div
      className={`border border-dashed rounded-2xl p-6 text-center transition-all ${
        dragActive ? 'border-purple-400 bg-purple-500/5 glow-purple' : 'border-white/10 hover:border-white/20 bg-slate-900/10'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <FaFingerprint className="text-3xl text-gray-400 mx-auto mb-2" />
      <p className="text-gray-400 mb-2">Drag & drop or click to upload</p>
      <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG (max 10MB)</p>
      <input
        type="file"
        id={`file-${documentType}`}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        disabled={loading}
      />
      <label
        htmlFor={`file-${documentType}`}
        className="btn-secondary text-sm py-2 inline-block cursor-pointer"
      >
        {loading ? 'Processing...' : 'Browse Files'}
      </label>
    </div>
  );
}