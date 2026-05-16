import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCamera, FaIdCard, FaUser, FaMapMarkerAlt, FaCheck, FaTimes,
  FaSpinner, FaShieldAlt, FaExclamationTriangle, FaFileAlt,
  FaFingerprint, FaVideo, FaIdCardAlt, FaHome, FaShieldVirus
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
      case 'VERIFIED': return <FaCheck className="text-success" />;
      case 'FAILED': return <FaTimes className="text-danger" />;
      case 'PENDING': return <FaSpinner className="text-warning animate-spin" />;
      default: return <FaExclamationTriangle className="text-gray-400" />;
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
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Enhanced KYC Verification</h1>
          <p className="text-gray-400">Complete all verification steps for loan approval</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FaShieldAlt className="text-accent-500" />
              Verification Progress
            </h3>
            <span className="text-2xl font-bold text-accent-500">
              {Math.round(getOverallProgress())}%
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${getOverallProgress()}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {verificationSteps.map((step, idx) => {
              const status = kycStatus?.[step.id === 'aadhaar' ? 'aadhaarStatus' :
                               step.id === 'pan' ? 'panStatus' :
                               step.id === 'face' ? 'faceVerificationStatus' :
                               'addressProofStatus'];
              return (
                <div key={step.id} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2
                    ${status === 'VERIFIED' ? 'bg-success/20' :
                      status === 'FAILED' ? 'bg-danger/20' :
                      idx === currentStep ? 'bg-accent-500/20' : 'bg-white/10'}`}>
                    <step.icon className={`${status === 'VERIFIED' ? 'text-success' :
                      status === 'FAILED' ? 'text-danger' :
                      idx === currentStep ? 'text-accent-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-xs text-gray-400">{step.label}</p>
                  {status && (
                    <div className="flex justify-center mt-1">
                      {getStatusIcon(status)}
                    </div>
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
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <div className="glass p-8 text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 border-2 border-accent-500/30 rounded-lg"></div>
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-primary"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <FaCamera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-accent-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scanning Document...</h3>
                <p className="text-gray-400 mb-4">Extracting information using OCR</p>
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <motiondiv
                    className="h-full bg-gradient-primary"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{Math.round(scanProgress)}%</p>
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
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            >
              <div className="glass p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-center">Face Verification</h3>
                <div className="relative aspect-square bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Face outline overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-accent-500/50 rounded-full"></div>
                  </div>

                  {/* Liveness detection overlay */}
                  {livenessChecking && (
                    <div className="absolute inset-0 bg-accent-500/20 flex items-center justify-center">
                      <div className="text-center">
                        <FaSpinner className="text-4xl text-white animate-spin mb-2 mx-auto" />
                        <p className="text-white">Checking liveness...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={stopCamera}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={captureSelfie}
                    disabled={livenessChecking}
                    className="flex-1 btn-primary"
                  >
                    {livenessChecking ? 'Verifying...' : 'Capture'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Document Upload Cards */}
          {verificationSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-6 ${currentStep === idx ? 'ring-2 ring-accent-500' : ''}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center">
                  <step.icon className="text-accent-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold">{step.label}</h3>
                  <p className="text-sm text-gray-400">
                    {step.id === 'aadhaar' && 'Upload front side of Aadhaar'}
                    {step.id === 'pan' && 'Upload PAN card'}
                    {step.id === 'face' && 'Take a selfie for face matching'}
                    {step.id === 'address' && 'Upload address proof document'}
                  </p>
                </div>
              </div>

              {step.id === 'face' ? (
                <div className="space-y-4">
                  {kycStatus?.faceVerificationStatus === 'VERIFIED' ? (
                    <div className="bg-success/10 rounded-lg p-4 text-center">
                      <FaCheck className="text-success text-2xl mb-2 mx-auto" />
                      <p className="text-success font-medium">Face Verified</p>
                      <p className="text-sm text-gray-400">
                        Similarity: {Math.round(kycStatus.faceSimilarityScore || 0)}%
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={startFaceVerification}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <FaCamera />
                      Start Face Verification
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
                    <div className="bg-accent-500/10 rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <FaFileAlt /> Extracted Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span>{extractedData.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Number:</span>
                          <span className="font-mono">{extractedData.number || 'N/A'}</span>
                        </div>
                        {extractedData.dob && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">DOB:</span>
                            <span>{extractedData.dob}</span>
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
            className="glass p-6 mt-8"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaShieldVirus className="text-success" />
              KYC Verification Complete
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <FaCheck className="text-success text-2xl mb-2 mx-auto" />
                <p className="font-medium">Aadhaar</p>
                <p className="text-sm text-gray-400">Verified</p>
              </div>
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <FaCheck className="text-success text-2xl mb-2 mx-auto" />
                <p className="font-medium">PAN</p>
                <p className="text-sm text-gray-400">Verified</p>
              </div>
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <FaCheck className="text-success text-2xl mb-2 mx-auto" />
                <p className="font-medium">Face</p>
                <p className="text-sm text-gray-400">Verified</p>
              </div>
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <FaCheck className="text-success text-2xl mb-2 mx-auto" />
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-400">Verified</p>
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
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive ? 'border-accent-500 bg-accent-500/10' : 'border-white/20'
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