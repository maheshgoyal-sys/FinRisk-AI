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

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/apply', label: 'Apply', icon: FaFileAlt },
    { path: '/calculator', label: 'Calculator', icon: FaCalculator },
    { path: '/kyc', label: 'KYC', icon: FaIdCard },
    { path: '/kyc-enhanced', label: 'Verify', icon: FaShieldAlt },
    { path: '/risk-dashboard', label: 'Risk', icon: FaChartLine },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-amber-500/20">
            <span className="text-black font-black text-xl">F</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold gradient-text">FinRisk AI</span>
            <div className="text-[10px] text-amber-500/60 -mt-1 tracking-wider uppercase">Premium Finance</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-amber-400 transition-colors px-4 py-2 text-sm font-medium"
              >
                Login
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
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-amber-400 bg-amber-500/10'
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-amber-400 bg-amber-500/10 text-sm font-medium"
                >
                  <FaCrown className="text-xs" />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <FaUser className="text-amber-400 text-xs" />
                  </div>
                  <span className="text-gray-300 text-sm max-w-[120px] truncate">{user.fullName || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
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