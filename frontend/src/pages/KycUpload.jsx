import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFilePdf, FaImage, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
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

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await api.get('/kyc/status');
      setUploadedDocs(res.data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
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
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">KYC Document Upload</h1>
          <p className="text-gray-400">Upload required documents for verification</p>
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
                className={`glass p-6 ${isUploaded ? 'border-success/50' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{doc.label}</h3>
                  {isUploaded && (
                    <span className="status-approved flex items-center gap-1">
                      <FaCheck /> Verified
                    </span>
                  )}
                  {isPending && (
                    <span className="status-pending flex items-center gap-1">
                      Pending
                    </span>
                  )}
                  {isRejected && (
                    <span className="status-rejected flex items-center gap-1">
                      <FaTimes /> Rejected
                    </span>
                  )}
                </div>

                {uploadProgress[doc.id] !== null && uploadProgress[doc.id] !== undefined && (
                  <div className="mb-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-300"
                        style={{ width: `${uploadProgress[doc.id]}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Uploading... {uploadProgress[doc.id]}%</p>
                  </div>
                )}

                {isUploaded && docStatus.doc ? (
                  <div className="bg-success/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-2xl text-danger" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {docStatus.doc.fileName}
                          </p>
                          <p className="text-xs text-gray-400">
                            Uploaded {new Date(docStatus.doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(docStatus.doc._id)}
                        className="text-gray-400 hover:text-danger transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive === doc.id
                        ? 'border-accent-500 bg-accent-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(doc.id); }}
                    onDragLeave={() => setDragActive(null)}
                    onDrop={(e) => handleDrop(e, doc.id)}
                  >
                    <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG (max 10MB)</p>
                    <input
                      type="file"
                      id={`file-${doc.id}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(doc.id, e.target.files[0])}
                    />
                    <label
                      htmlFor={`file-${doc.id}`}
                      className="btn-secondary text-sm py-2 inline-block cursor-pointer"
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
          className="glass p-6 mt-8"
        >
          <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">
                {uploadedDocs.filter(d => d.status === 'VERIFIED').length}
              </div>
              <div className="text-sm text-gray-400">Verified</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <div className="text-2xl font-bold text-warning">
                {uploadedDocs.filter(d => d.status === 'PENDING').length}
              </div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-danger/10">
              <div className="text-2xl font-bold text-danger">
                {uploadedDocs.filter(d => d.status === 'REJECTED').length}
              </div>
              <div className="text-sm text-gray-400">Rejected</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10">
              <div className="text-2xl font-bold">
                {documentTypes.length - uploadedDocs.length}
              </div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}