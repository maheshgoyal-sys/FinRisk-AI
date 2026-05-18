import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaCheck, FaTimes, FaUserShield, FaFingerprint } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-red-500/50', 'bg-orange-500/50', 'bg-yellow-500/50', 'bg-cyan-500/50', 'bg-purple-500/50', 'bg-purple-500'];
  const strengthLabels = ['Critical Vulnerability', 'Vulnerable', 'Weak Firewall', 'Secured', 'Highly Cryptographic', 'Quantum Encrypted'];
  const strengthColor = passwordStrength <= 1 ? 'text-red-400' : passwordStrength <= 2 ? 'text-orange-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-purple-400';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 py-12 relative overflow-hidden">
      {/* Decorative Cyber Orbs */}
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-10 glow-cyan border border-cyan-500/20">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <FaUserShield className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-wide text-white">Deploy <span className="gradient-text">Node</span></h1>
            <p className="text-slate-400 text-sm">Join the FinRisk decentralized trust network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                [ERROR] {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-3 text-slate-400 uppercase tracking-widest font-mono">Identifier (Full Name)</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-3 text-slate-400 uppercase tracking-widest font-mono">Communication Endpoint (Email)</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-3 text-slate-400 uppercase tracking-widest font-mono">Secure Dial (Phone)</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-3 text-slate-400 uppercase tracking-widest font-mono">Encryption Phrase (Password)</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-12 pr-12"
                  placeholder="Create cryptographic key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-slate-800'}`}
                      ></div>
                    ))}
                  </div>
                  <span className={`text-xs font-mono tracking-wider ${strengthColor}`}>
                    [{strengthLabels[passwordStrength]}]
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-3 text-slate-400 uppercase tracking-widest font-mono">Re-verify Phrase</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Repeat encryption key"
                  required
                />
                {formData.confirmPassword && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <FaCheck className="text-emerald-400" />
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                  </span>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-2 font-mono text-[11px] leading-relaxed">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-cyan-500/30"
              />
              <span className="text-slate-400">
                I authorize this node configuration under the{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Service Protocol</a>
                {' '}and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Shield</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 font-mono">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  DEPLOYING NODE...
                </span>
              ) : (
                'Deploy Node Configuration'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Node already configured?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Authorize login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}