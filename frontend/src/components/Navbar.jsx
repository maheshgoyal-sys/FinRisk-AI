import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaHome, FaFileAlt, FaIdCard, FaCrown, FaChartLine, FaShieldAlt, FaCalculator } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Only show these links for regular users, not admin
  const userLinks = user?.role !== 'ADMIN' ? [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/apply', label: 'Apply', icon: FaFileAlt },
    { path: '/calculator', label: 'Calculator', icon: FaCalculator },
    { path: '/kyc', label: 'KYC', icon: FaIdCard },
    { path: '/kyc-enhanced', label: 'Verify', icon: FaShieldAlt },
    { path: '/risk-dashboard', label: 'Risk', icon: FaChartLine },
  ] : [];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(5, 5, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-white font-black text-xl relative z-10">F</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-white tracking-wide">FinRisk <span className="gradient-text">AI</span></span>
            <div className="text-[10px] text-cyan-400/80 -mt-1 tracking-[0.2em] uppercase font-mono">Quantum Finance</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-cyan-400 transition-colors px-4 py-2 text-sm font-medium"
              >
                Admin Login
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm py-2.5 px-6"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {userLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-cyan-400 bg-cyan-500/10 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="text-xs" />
                  {link.label}
                </Link>
              ))}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-purple-400 bg-purple-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.2)] border border-purple-500/20 text-sm font-medium"
                >
                  <FaCrown className="text-xs" />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
                    <FaUser className="text-cyan-400 text-xs" />
                  </div>
                  <span className="text-gray-300 text-sm max-w-[120px] truncate">{user.fullName || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-pink-500 transition-colors p-2 rounded-lg hover:bg-pink-500/10"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}