// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect query parameter
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@nirmaan.com');
    setPassword('demo123');
  };

  return (
    <>
      <Helmet>
        <title>Sign In – Nirmaan Aluminium House</title>
      </Helmet>

      <div className="pt-28 pb-24 px-6 min-h-screen bg-[#061411] flex items-center justify-center text-[#EFEBDD]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[#0A1F1A] border border-[#C9A15A]/30 rounded-3xl p-8 md:p-10 shadow-2xl relative"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-2">
              Client Portal Sign In
            </h1>
            <p className="text-xs text-white/50">
              Access your architectural orders, specifications, and invoices
            </p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-black/40 border border-[#C9A15A]/30 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#C9A15A] font-semibold block flex items-center gap-1.5">
                <Sparkles size={13} /> Demo Client Credentials:
              </span>
              <span className="text-white/60 font-mono text-[11px]">demo@nirmaan.com / demo123</span>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="px-3 py-1.5 rounded-lg bg-[#C9A15A]/20 hover:bg-[#C9A15A]/30 text-[#E2C285] font-semibold text-[11px] transition shrink-0"
            >
              Fill Demo
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-white/80 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A15A] to-[#E2C285] text-[#061411] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg shadow-[#C9A15A]/20 pt-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#061411] border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/60">
            <span>Don't have a fabrication account? </span>
            <Link
              to={`/register${location.search}`}
              className="text-[#C9A15A] hover:underline font-semibold"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
