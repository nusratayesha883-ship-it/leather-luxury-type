import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  Database,
  Mail,
  Loader2,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  signInAdminWithSupabase,
  isSupabaseConfigured,
  getAdminSession,
} from '../services/supabaseClient';

interface AdminLoginProps {
  onAuthenticated: (username: string) => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 60;

export const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthenticated }) => {
  const { navigateTo } = useApp();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);

  // Preload saved email & check failed lockout on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('luxe_admin_remember_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }

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

  // Check if an existing valid Supabase session is already present
  useEffect(() => {
    let mounted = true;
    const checkActiveSession = async () => {
      try {
        const session = await getAdminSession();
        if (session?.user?.email && mounted) {
          onAuthenticated(session.user.email);
        }
      } catch (err) {
        console.warn('[AdminLogin] Session check error:', err);
      }
    };
    checkActiveSession();
    return () => {
      mounted = false;
    };
  }, [onAuthenticated]);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0 || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const enteredEmail = email.trim();
    const enteredPass = password.trim();

    const configuredMasterPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'AM @2002').trim();

    // 1. Emergency local bypass check (for local development or offline maintenance)
    const isEmergencyUser = enteredEmail.toLowerCase() === 'admin' || enteredEmail.toLowerCase() === 'executive';
    if (isEmergencyUser && enteredPass === configuredMasterPassword) {
      sessionStorage.removeItem('luxe_admin_failed_attempts');
      sessionStorage.removeItem('luxe_admin_lockout_until');

      const sessionData = {
        authenticated: true,
        user: enteredEmail,
        token: 'lha_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
        timestamp: Date.now(),
      };

      if (rememberMe) {
        localStorage.setItem('luxe_admin_auth_session', JSON.stringify(sessionData));
        localStorage.setItem('luxe_admin_remember_email', enteredEmail);
      } else {
        sessionStorage.setItem('luxe_admin_auth_session', JSON.stringify(sessionData));
      }

      onAuthenticated(enteredEmail);
      setIsSubmitting(false);
      return;
    }

    // 2. Validate email structure for Supabase Auth
    if (!enteredEmail.includes('@')) {
      setError('Please enter a valid Supabase email address (e.g. name@domain.com).');
      setIsSubmitting(false);
      return;
    }

    // 3. Supabase Auth authentication
    if (isSupabaseConfigured()) {
      try {
        const { success, user, error: authError } = await signInAdminWithSupabase(
          enteredEmail,
          enteredPass
        );

        if (success && user) {
          // Clear security counters on success
          sessionStorage.removeItem('luxe_admin_failed_attempts');
          sessionStorage.removeItem('luxe_admin_lockout_until');

          const userEmail = user.email || enteredEmail;

          const sessionData = {
            authenticated: true,
            user: userEmail,
            userId: user.id,
            timestamp: Date.now(),
          };

          if (rememberMe) {
            localStorage.setItem('luxe_admin_auth_session', JSON.stringify(sessionData));
            localStorage.setItem('luxe_admin_remember_email', userEmail);
          } else {
            sessionStorage.setItem('luxe_admin_auth_session', JSON.stringify(sessionData));
            localStorage.removeItem('luxe_admin_remember_email');
          }

          onAuthenticated(userEmail);
          setIsSubmitting(false);
          return;
        }

        // Supabase Auth failed — format user-friendly error message
        let failureMsg = authError || 'Invalid credentials.';
        if (failureMsg.toLowerCase().includes('invalid login credentials')) {
          failureMsg = 'Invalid email or password. Please check your Supabase Auth user credentials.';
        } else if (failureMsg.toLowerCase().includes('email not confirmed')) {
          failureMsg = 'Email not confirmed in Supabase. Please confirm in your Supabase Auth dashboard or disable "Confirm email" in Auth Settings.';
        }

        const newFailed = failedCount + 1;
        setFailedCount(newFailed);
        sessionStorage.setItem('luxe_admin_failed_attempts', String(newFailed));

        if (newFailed >= MAX_FAILED_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION_SECONDS * 1000;
          sessionStorage.setItem('luxe_admin_lockout_until', String(lockoutUntil));
          setLockoutTimer(LOCKOUT_DURATION_SECONDS);
          setError(`Security Lockout: Too many invalid attempts. Please wait ${LOCKOUT_DURATION_SECONDS} seconds.`);
        } else {
          setError(`${failureMsg} (${MAX_FAILED_ATTEMPTS - newFailed} attempts remaining before temporary lockout)`);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to authenticate with Supabase Auth.');
      }
    } else {
      // Supabase is not configured
      setError('Supabase is not configured in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    setIsSubmitting(false);
  };

  const isSupabaseLive = isSupabaseConfigured();

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
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  Executive Control Panel
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isSupabaseLive
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                  }`}
                >
                  <Database className="w-2.5 h-2.5" />
                  {isSupabaseLive ? 'Supabase Auth' : 'Supabase Offline'}
                </span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#FDFBF7] mt-0.5">
                Admin Authentication
              </h2>
              <p className="text-xs text-[#A69282] mt-1 max-w-xs mx-auto">
                Sign in using your Supabase account email and password to access executive order management.
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

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5">
                Supabase Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  disabled={lockoutTimer > 0 || isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full min-h-[44px] bg-[#140D08] text-xs sm:text-sm text-[#FDFBF7] pl-10 pr-4 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#7A6658] disabled:opacity-50 transition-colors"
                />
                <Mail className="w-4 h-4 text-[#A69282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Supabase Password
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
                  autoComplete="current-password"
                  value={password}
                  disabled={lockoutTimer > 0 || isSubmitting}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full min-h-[44px] bg-[#140D08] text-xs sm:text-sm text-[#FDFBF7] pl-10 pr-11 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#7A6658] font-mono disabled:opacity-50 transition-colors"
                />
                <Lock className="w-4 h-4 text-[#A69282] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A69282] hover:text-[#D4AF37] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Helper info */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#D4C5B9] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={isSubmitting}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#140D08] border-[#D4AF37]/40 text-[#D4AF37] focus:ring-0 cursor-pointer accent-[#D4AF37]"
                />
                <span>Remember this session</span>
              </label>

              <span className="text-[11px] text-[#A69282] flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
                Supabase Auth
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || lockoutTimer > 0}
                className="w-full py-3.5 px-6 min-h-[46px] rounded-xl btn-gold text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#170F0B] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.55)] transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#170F0B] animate-spin" />
                    <span>Signing in with Supabase...</span>
                  </>
                ) : lockoutTimer > 0 ? (
                  <>
                    <Lock className="w-4 h-4 text-[#170F0B]" />
                    <span>Locked ({lockoutTimer}s)</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#170F0B]" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Setup Hint */}
          <div className="mt-6 pt-4 border-t border-[#D4AF37]/15">
            <div className="p-3 rounded-xl bg-[#140D08]/60 border border-[#D4AF37]/20 flex items-start gap-2 text-[11px] text-[#A69282]">
              <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#D4AF37] block">Supabase Auth User Setup:</span>
                Create or manage your admin credentials in the Supabase Dashboard under{' '}
                <strong className="text-[#FDFBF7]">Authentication &gt; Users</strong>.
              </div>
            </div>
          </div>

          {/* Footer security badge */}
          <div className="mt-4 text-center flex items-center justify-center gap-2 text-[11px] text-[#8D7768]">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Encrypted Supabase JWT Session • Row Level Security</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
