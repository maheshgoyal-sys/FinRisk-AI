import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaBolt, FaChartLine, FaUserShield, FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';

export default function Landing() {
  const features = [
    {
      icon: <FaBolt className="text-2xl" />,
      title: 'Instant Approval',
      desc: 'Get loan decisions in as little as 2 minutes with our AI-powered system'
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: 'Risk Assessment',
      desc: 'Advanced algorithms analyze thousands of data points for accurate risk evaluation'
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: 'Smart Analytics',
      desc: 'Real-time insights into your financial health and loan eligibility'
    },
    {
      icon: <FaUserShield className="text-2xl" />,
      title: 'Secure KYC',
      desc: 'Bank-grade document verification with encrypted storage'
    }
  ];

  const stats = [
    { value: '98%', label: 'Accuracy Rate' },
    { value: '50K+', label: 'Happy Users' },
    { value: '2min', label: 'Avg. Approval' },
    { value: '$2B+', label: 'Loans Processed' }
  ];

  const testimonials = [
    {
      name: 'Alexandra Chen',
      role: 'Business Owner',
      content: 'The approval process was incredibly smooth. Got my business loan within hours, not weeks.',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Software Engineer',
      content: 'Best loan experience ever. The AI analysis was transparent and the rates were excellent.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Financial Analyst',
      content: 'Finally, a platform that understands financial needs. Premium service with premium results.',
      rating: 5
    }
  ];

  return (
    <div className="pt-20">
      {/* Premium Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-amber-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-violet-500/3 via-transparent to-transparent rounded-full blur-3xl"></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-[95vh] flex items-center justify-center relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-amber-300 text-sm font-medium tracking-wide">AI-Powered Elite Finance</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1]"
          >
            <span className="text-white">Unlock Your</span>
            <br />
            <span className="gradient-text">Financial Future</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Experience the pinnacle of intelligent lending.
            <br className="hidden md:block" />
            <span className="text-gray-300">Premium rates. Lightning approval. Absolute clarity.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link to="/register" className="group btn-primary text-base px-10 py-4.5 flex items-center gap-3">
              Apply Now
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-10 py-4.5">
              Member Login
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-amber-500/60" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="w-px h-4 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <FaBolt className="text-amber-500/60" />
              <span>2-Minute Approval</span>
            </div>
            <div className="w-px h-4 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <FaChartLine className="text-amber-500/60" />
              <span>Real-time Analytics</span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 border border-amber-500/10 rounded-full -rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 border border-indigo-500/10 rounded-full rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="glass p-6 md:p-8 text-center group hover:border-amber-500/30 transition-all duration-300">
                <div className="text-3xl md:text-5xl font-black gradient-text mb-2 premium-number">{stat.value}</div>
                <div className="text-gray-400 text-sm md:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Elite</span> Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Powered by advanced AI and decades of financial expertise,
              our platform delivers unmatched loan experiences.
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
                className="glass-card p-8 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Client <span className="gradient-text">Testimonials</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Join thousands of satisfied clients who trust us with their financial journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass-card p-8 relative"
              >
                <FaQuoteLeft className="absolute top-6 right-6 text-amber-500/20 text-3xl" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="border-t border-white/5 pt-4">
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-16 relative overflow-hidden premium-shine glow-gold"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-indigo-500/5"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready for <span className="gradient-text">Premium</span> Service?
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
                Join the elite circle of FinRisk members and experience
                financial excellence like never before.
              </p>
              <Link to="/register" className="btn-primary text-lg px-12 py-5 inline-flex items-center gap-3">
                Create Your Account
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <span className="text-black font-black text-xl">F</span>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">FinRisk AI</span>
                <div className="text-xs text-gray-500">Premium Financial Services</div>
              </div>
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-amber-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="hover:text-amber-400 transition-colors text-sm">Contact</a>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 FinRisk AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}