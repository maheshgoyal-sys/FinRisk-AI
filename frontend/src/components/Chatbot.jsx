import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaTimes, FaPaperPlane, FaRobot, FaStar, FaTerminal } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM READY: I am your FinRisk quantum model assistant. Specify your query parameters.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [isOpen, messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        message: userMessage,
        userId: user?._id
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'TELEMETRY FAULT: Failed to process request. Re-transmit query.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    'Analyze my eligibility',
    'Review my credit score',
    'Amortize sample EMI',
    'Optimize risk factor logs'
  ];

  const handleQuickAction = (action) => {
    setInput(action);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] z-50 group border border-purple-400/20"
      >
        <FaComment size={18} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#030014] animate-pulse"></span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] glass-card flex flex-col z-50 border border-purple-500/20 glow-purple bg-slate-950/95 font-mono text-xs"
            style={{ maxWidth: 'calc(100vw - 3rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-white/10">
                  <FaRobot className="text-white text-base" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white tracking-wide uppercase text-[11px]">Neural Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                    <p className="text-[9px] text-cyan-400 uppercase tracking-widest">Active Node</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5"
              >
                <FaTimes size={12} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl border leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-transparent shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                        : 'bg-slate-900/60 text-slate-300 border-white/5'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2.5 flex flex-wrap gap-1.5 border-t border-white/5 bg-slate-900/20 text-left">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="text-[9px] px-3 py-1.5 rounded-lg bg-purple-500/5 border border-purple-500/20 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all font-mono"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-slate-900/40">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-[#030014] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white flex items-center justify-center hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all disabled:opacity-40"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}