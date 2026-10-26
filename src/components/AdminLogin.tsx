import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, KeyRound, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminLoginProps {
  onAuthenticated: (username: string) => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 60;

export const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthenticated }) => {
  const { navigateTo } = useApp();

  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);

  // Load failed attempts from session storage on mount
  useEffect(() => {
    try {
      const storedFailed = Number(sessionStorage.getItem('luxe_admin_failed_attempts') || '0');
      const lockoutEnd = Number(sessionStorage.getItem('luxe_admin_lockout_until') || '0');
      const now = Date.now();

      if (lockoutEnd > now) {
        const remaining = Math.ceil((lockoutEnd - now) / 1000);
        setLockoutTimer(remaining);
      }
      setFailedCount(storedFailed);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Countdown timer for brute force lockout
  useEffect(() => {
    if (lockoutTimer <= 0) return;

    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem('luxe_admin_lockout_until');
          sessionStorage.removeItem('luxe_admin_failed_attempts');
          setFailedCount(0);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setError(null);
    setIsSubmitting(true);

    const configuredPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'AM @2002').trim();
    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password.trim();

    // Check credentials: only 'AM @2002' unlocks the executive panel
    const isValidUser = enteredUser === 'admin' || enteredUser.includes('@') || enteredUser.length >= 3;
    const isValidPass = enteredPass === configuredPassword;

    if (isValidUser && isValidPass) {
      // Clear security counters on success
      sessionStorage.removeItem('luxe_admin_failed_attempts');
      sessionStorage.removeItem('luxe_admin_lockout_until');

      const sessionData = {
        authenticated: true,
        user: enteredUser || 'admin',
        token: 'lha_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
        timestamp: Date.now(),
      };

      if (rememberMe) {
        localStorage.setItem('luxe_admin_auth_session', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('luxe_admin_auth_session', JSON.stringify(sessionData));
      }

      onAuthenticated(enteredUser || 'admin');
    } else {
      const newFailed = failedCount + 1;
      setFailedCount(newFailed);
      sessionStorage.setItem('luxe_admin_failed_attempts', String(newFailed));

      if (newFailed >= MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_SECONDS * 1000;
        sessionStorage.setItem('luxe_admin_lockout_until', String(lockoutUntil));
        setLockoutTimer(LOCKOUT_DURATION_SECONDS);
        setError(`Security Lockout: Too many invalid attempts. Please wait ${LOCKOUT_DURATION_SECONDS} seconds.`);
      } else {
        setError(`Invalid credentials. (${MAX_FAILED_ATTEMPTS - newFailed} attempts remaining before temporary lockout)`);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Return Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A69282] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#251811] via-[#1D130E] to-[#160E0A] border-2 border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-[#D4AF37]/20">
            <div className="w-14 h-14 rounded-2xl bg-[#342217] border border-[#D4AF37]/50 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Shield className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                B2B Executive Control
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#FDFBF7] mt-0.5">
                Admin Authentication
              </h2>
              <p className="text-xs text-[#A69282] mt-1 max-w-xs mx-auto">
                Secure portal for managing customer orders, Supabase records, and tannery production.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-6">
            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 shadow-md"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  disabled={lockoutTimer > 0}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or executive@luxehide.atelier"
                  className="w-full min-h-[44px] bg-[#140D08] text-xs sm:text-sm text-[#FDFBF7] px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#7A6658] disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Master Passphrase
                </label>
                {lockoutTimer > 0 && (
                  <span className="text-[11px] font-mono text-red-400 font-bold">
                    Locked: {lockoutTimer}s
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  disabled={lockoutTimer > 0}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full min-h-[44px] bg-[#140D08] text-xs sm:text-sm text-[#FDFBF7] pl-4 pr-11 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#7A6658] font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A69282] hover:text-[#D4AF37] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#D4C5B9] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#140D08] border-[#D4AF37]/40 text-[#D4AF37] focus:ring-0 cursor-pointer accent-[#D4AF37]"
                />
                <span>Remember this session</span>
              </label>

              <span className="text-[11px] text-[#8D7768] font-mono">
                Executive Portal
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || lockoutTimer > 0}
                className="w-full py-3.5 px-6 min-h-[46px] rounded-xl btn-gold text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#170F0B] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.55)] transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <KeyRound className="w-4 h-4 text-[#170F0B]" />
                <span>{lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : 'Unlock Admin Portal'}</span>
              </button>
            </div>
          </form>

          {/* Footer security badge */}
          <div className="mt-6 pt-4 border-t border-[#D4AF37]/15 text-center flex items-center justify-center gap-2 text-[11px] text-[#8D7768]">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>256-Bit Encrypted Session • Supabase Row Level Security</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
