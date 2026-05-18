import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaBolt, FaChartLine, FaUserShield, FaArrowRight, FaStar, FaQuoteLeft, FaRobot, FaFingerprint } from 'react-icons/fa';

export default function Landing() {
  const features = [
    {
      icon: <FaRobot className="text-2xl" />,
      title: 'Quantum AI Analysis',
      desc: 'Neural networks process loan applications in milliseconds with unprecedented accuracy.'
    },
    {
      icon: <FaFingerprint className="text-2xl" />,
      title: 'Biometric Security',
      desc: 'Military-grade encryption and decentralized identity verification for total protection.'
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: 'Predictive Insights',
      desc: 'Real-time forecasting of market trends and personalized financial trajectories.'
    },
    {
      icon: <FaBolt className="text-2xl" />,
      title: 'Hyper-Speed Processing',
      desc: 'Instant liquidity access through our optimized blockchain-inspired ledger.'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'AI Accuracy' },
    { value: '1.2M+', label: 'Nodes Secured' },
    { value: '< 1s', label: 'Processing Time' },
    { value: '$5B+', label: 'Volume Handled' }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Tech Entrepreneur',
      content: 'The quantum analysis gave my startup the exact funding we needed in under 60 seconds. Absolutely revolutionary.',
      rating: 5
    },
    {
      name: 'David Chen',
      role: 'Data Scientist',
      content: 'As someone who understands the backend, FinRisk AI\'s predictive models are lightyears ahead of traditional banking.',
      rating: 5
    },
    {
      name: 'Elena Rodriguez',
      role: 'Venture Capitalist',
      content: 'The interface is stunning, but the real power is in the AI risk assessment. It\'s my go-to platform now.',
      rating: 5
    }
  ];

  return (
    <div className="pt-20 overflow-hidden relative">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="min-h-[95vh] flex items-center justify-center relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Cyber Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
              <span className="text-cyan-300 text-sm font-semibold tracking-widest uppercase">System Online: v3.14.2</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
          >
            <span className="text-white">Next Generation</span>
            <br />
            <span className="gradient-text">Financial Intelligence</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Harness the power of neural networks for instant risk assessment.
            <br className="hidden md:block" />
            <span className="text-slate-300 font-medium">Predictive modeling. Zero latency. Absolute control.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/register" className="group btn-primary text-base px-10 py-4 flex items-center gap-3 w-full sm:w-auto justify-center">
              Initialize Account
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-10 py-4 w-full sm:w-auto text-center">
              System Login
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-8 text-slate-500 text-sm font-mono tracking-wider"
          >
            <div className="flex items-center gap-2">
              <FaFingerprint className="text-purple-400/80 text-lg" />
              <span>AES-256 ENCRYPTED</span>
            </div>
            <div className="w-px h-4 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <FaRobot className="text-cyan-400/80 text-lg" />
              <span>AI NEURAL NET</span>
            </div>
            <div className="w-px h-4 bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <FaChartLine className="text-pink-400/80 text-lg" />
              <span>99.9% UPTIME</span>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Stats Section */}
      <section className="py-20 relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6 md:p-8 text-center group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="text-4xl md:text-5xl font-black gradient-text-pink mb-3 premium-number">{stat.value}</div>
                <div className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Core <span className="gradient-text">Architecture</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Engineered from the ground up to process complex financial models 
              with zero latency and maximum security.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 group hover:glow-purple transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-wide">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              System <span className="gradient-text-pink">Feedback</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Data logs from authorized nodes operating on the FinRisk network.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-card p-8 relative border-t-2 border-t-purple-500/30"
              >
                <FaQuoteLeft className="absolute top-6 right-6 text-cyan-500/10 text-4xl" />
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-cyan-400 text-sm" />
                  ))}
                </div>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white tracking-wide">{testimonial.name}</div>
                    <div className="text-xs text-cyan-400/80 font-mono tracking-wider">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-20 relative overflow-hidden text-center glow-cyan border border-cyan-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                Initialize Your <span className="gradient-text">Node</span>
              </h2>
              <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                Connect to the most advanced financial intelligence network.
                Process applications at quantum speeds.
              </p>
              <Link to="/register" className="btn-primary text-lg px-12 py-5 inline-flex items-center gap-3">
                Deploy Now
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-wide">FinRisk <span className="gradient-text">AI</span></span>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Quantum Network</div>
              </div>
            </div>
            <div className="flex gap-8 text-slate-400 font-mono text-xs uppercase tracking-wider">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Comms</a>
            </div>
            <div className="text-slate-500 text-xs font-mono">
              SYSTEM TIME: {new Date().getFullYear()} // ALL PROTOCOLS SECURED
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}