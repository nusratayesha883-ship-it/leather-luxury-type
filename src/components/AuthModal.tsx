import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, Building, User, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, language, l } = useApp();
  const t = TRANSLATIONS.auth;

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    setTimeout(() => {
      setAuthenticated(false);
      setIsAuthOpen(false);
    }, 1800);
  };

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAuthOpen(false)}
        className="fixed inset-0 bg-[#231F20]/75 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#4B3F35]/15 shadow-2xl z-10"
      >
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#4B3F35]/70 hover:text-[#231F20] hover:bg-[#FAF6F1]"
          aria-label="Close auth modal"
        >
          <X className="w-5 h-5" />
        </button>

        {authenticated ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#231F20]">
              {language === 'BN' ? 'সফলভাবে লগইন সম্পন্ন হয়েছে!' : 'Portal Authentication Successful!'}
            </h3>
            <p className="text-xs text-[#4B3F35]/70">
              {language === 'BN'
                ? 'স্বাগতম। আপনার ক্লায়েন্ট ড্যাশবোর্ড ও অর্ডার হিস্ট্রি সক্রিয় হয়েছে।'
                : 'Welcome back. Your client portal and order history are now unlocked.'}
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#4B3F35] flex items-center justify-center mx-auto mb-2.5">
                <Lock className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#231F20]">
                {l(t.title)}
              </h3>
              <p className="text-xs text-[#4B3F35]/70 mt-1">
                {l(t.subtitle)}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/10 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-[#4B3F35] text-white shadow-sm'
                    : 'text-[#4B3F35] hover:text-[#231F20]'
                }`}
              >
                {l(t.tabLogin)}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-[#4B3F35] text-white shadow-sm'
                    : 'text-[#4B3F35] hover:text-[#231F20]'
                }`}
              >
                {l(t.tabRegister)}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1">
                      {language === 'BN' ? 'আপনার নাম' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#4B3F35]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Marcus Sterling"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1">
                      {language === 'BN' ? 'কোম্পানি / ব্র্যান্ডের নাম' : 'Company / Brand Name'}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#4B3F35]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Sterling Footwear & Goods Ltd."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1">
                  {l(t.email)}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4B3F35]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="atelier@company.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1">
                  {l(t.password)}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4B3F35]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider text-[#231F20] cursor-pointer shadow-md mt-2"
              >
                {activeTab === 'login' ? l(t.loginBtn) : l(t.registerBtn)}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
