import React, { useState } from 'react';
import { ShoppingBag, Search, User, MessageCircle, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    l,
    totalItemsCount,
    setIsCartOpen,
    setIsAuthOpen,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS.nav;

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    const text = language === 'BN' 
      ? 'হ্যালো LuxeHide Atelier! আমি চামড়া ও কাস্টম সার্ভিস সম্পর্কে জানতে চাই।'
      : 'Hello LuxeHide Atelier! I would like to inquire regarding bespoke leather supply and custom crafting.';
    window.open(`https://wa.me/8801700000000?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav shadow-xs transition-all">
      {/* Full width container across all screen sizes with generous padding */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Subtext in a SINGLE CLEAN LINE */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2E2018] flex items-center justify-center border border-[#D4AF37]/60 shadow-md group-hover:border-[#D4AF37] group-hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all shrink-0">
              <span className="font-heading text-lg font-bold text-[#D4AF37]">L</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#FDFBF7] whitespace-nowrap leading-none">
                {l(TRANSLATIONS.brand.name)}
              </span>
              <span className="hidden xl:inline-block w-px h-4 bg-[#D4AF37]/30" />
              <span className="hidden xl:inline-block text-[11px] uppercase tracking-widest text-[#D4C5B9]/80 font-semibold whitespace-nowrap">
                {l(TRANSLATIONS.brand.tagline)}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (strictly whitespace-nowrap so "Custom Service" never breaks) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-[#E2D7CC] shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              {l(t.home)}
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              {l(t.catalog)}
            </button>
            <button
              onClick={() => handleNavClick('custom-service')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              {l(t.customService)}
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              {l(t.calculator)}
            </button>
            <button
              onClick={() => handleNavClick('trust-strip')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap"
            >
              {l(t.about)}
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            
            {/* Desktop Search */}
            <div className="hidden 2xl:flex items-center relative w-60">
              <Search className="w-4 h-4 text-[#D4AF37]/70 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={l(t.searchPlaceholder)}
                className="w-full bg-[#221711] text-xs text-[#FDFBF7] pl-9 pr-7 py-2 rounded-full border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#A69282] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#D4C5B9]/60 hover:text-[#FDFBF7]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Language Switcher: Strict EN / BN */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-[#221711] border border-[#D4AF37]/30 shadow-inner">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  language === 'EN'
                    ? 'bg-[#D4AF37] text-[#170F0B] shadow-sm'
                    : 'text-[#D4C5B9] hover:text-[#FDFBF7]'
                }`}
                title="Switch to Pure English Mode (USD $)"
              >
                EN ($)
              </button>
              <button
                onClick={() => setLanguage('BN')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  language === 'BN'
                    ? 'bg-[#D4AF37] text-[#170F0B] shadow-sm'
                    : 'text-[#D4C5B9] hover:text-[#FDFBF7]'
                }`}
                title="বাংলা মোডে পরিবর্তন করুন (টাকা ৳)"
              >
                বাংলা (৳)
              </button>
            </div>

            {/* WhatsApp Concierge Button */}
            <button
              onClick={openWhatsApp}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/35 transition-all cursor-pointer whitespace-nowrap"
              title="Direct WhatsApp Support"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span>{l(t.whatsapp)}</span>
            </button>

            {/* Client Portal / Login Trigger */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-2 rounded-full hover:bg-[#2E2018] text-[#E2D7CC] hover:text-[#D4AF37] transition-colors cursor-pointer"
              title={l(t.clientPortal)}
              aria-label="Client Portal"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Trigger with Drawer */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full btn-gold cursor-pointer whitespace-nowrap"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-4 h-4 text-[#170F0B]" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-[#170F0B]">
                {l(t.cart)}
              </span>
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-extrabold bg-[#170F0B] text-[#D4AF37] rounded-full shadow-sm">
                {language === 'BN' ? (totalItemsCount === 0 ? '০' : totalItemsCount) : totalItemsCount}
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#E2D7CC] hover:text-[#D4AF37]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#D4AF37]/20 bg-[#1E140F] px-6 pt-3 pb-6 space-y-3"
          >
            {/* Mobile Search input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#D4AF37]/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={l(t.searchPlaceholder)}
                className="w-full bg-[#271B14] text-xs text-[#FDFBF7] pl-9 pr-4 py-2.5 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#A69282]"
              />
            </div>

            <div className="flex flex-col space-y-2 text-sm font-semibold text-[#FDFBF7]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap"
              >
                {l(t.home)}
              </button>
              <button
                onClick={() => handleNavClick('catalog')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap"
              >
                {l(t.catalog)}
              </button>
              <button
                onClick={() => handleNavClick('custom-service')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap"
              >
                {l(t.customService)}
              </button>
              <button
                onClick={() => handleNavClick('calculator')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap"
              >
                {l(t.calculator)}
              </button>
              <button
                onClick={() => handleNavClick('trust-strip')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap"
              >
                {l(t.about)}
              </button>
            </div>

            <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between">
              <button
                onClick={openWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{l(t.whatsapp)}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A1E17] text-[#E2D7CC] border border-[#D4AF37]/30 hover:text-[#D4AF37] text-xs font-semibold"
              >
                <User className="w-4 h-4" />
                <span>{l(t.clientPortal)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
