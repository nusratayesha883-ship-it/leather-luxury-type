import React, { useState, useEffect, useRef } from 'react';
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
    currentPath,
    navigateTo,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS.nav;

  // Click outside and Escape key listener to smoothly collapse desktop search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (!searchQuery) {
          setDesktopSearchOpen(false);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchQuery, setSearchQuery]);

  // Auto-focus search input when expanded
  useEffect(() => {
    if (desktopSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [desktopSearchOpen]);

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    if (currentPath !== '/') {
      navigateTo('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'custom-order' || id === 'custom-service') {
      navigateTo('/custom-order');
      return;
    }
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav shadow-md transition-all">
      {/* Full width container across all screen sizes with adaptive padding */}
      <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 max-w-full">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-3 min-w-0">
          
          {/* Brand Logo & Subtext in a SINGLE CLEAN LINE */}
          <div 
            onClick={handleHomeClick}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#2E2018] flex items-center justify-center border border-[#D4AF37]/60 shadow-md group-hover:border-[#D4AF37] group-hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all shrink-0">
              <span className="font-heading text-base sm:text-lg font-bold text-[#D4AF37]">L</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-heading text-sm sm:text-base lg:text-xl font-bold tracking-tight text-[#FDFBF7] whitespace-nowrap leading-none">
                {language === 'BN' ? (
                  <>লাক্স<span className="text-[#D4AF37]">হাইড</span> অ্যাটেলিয়ার</>
                ) : (
                  <>Luxe<span className="text-[#D4AF37]">Hide</span> Atelier</>
                )}
              </span>
              <span className="hidden min-[1680px]:inline-block w-px h-4 bg-[#D4AF37]/30" />
              <span className="hidden min-[1680px]:inline-block text-[11px] uppercase tracking-widest text-[#D4C5B9]/80 font-semibold whitespace-nowrap">
                {l(TRANSLATIONS.brand.tagline)}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (Visible on screens >= 1024px (lg:), with zero-overlap layout) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 2xl:gap-5 text-xs xl:text-sm font-medium text-[#E2D7CC] shrink-0">
            <button
              onClick={handleHomeClick}
              className={`transition-colors cursor-pointer whitespace-nowrap px-1.5 py-1 min-h-[44px] flex items-center ${currentPath === '/' ? 'text-[#D4AF37] font-bold' : 'hover:text-[#D4AF37]'}`}
            >
              {l(t.home)}
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap px-1.5 py-1 min-h-[44px] flex items-center"
            >
              {l(t.catalog)}
            </button>
            <button
              onClick={() => navigateTo('/custom-order')}
              className={`transition-colors cursor-pointer whitespace-nowrap px-1.5 py-1 min-h-[44px] flex items-center ${currentPath === '/custom-order' ? 'text-[#D4AF37] font-bold' : 'hover:text-[#D4AF37]'}`}
            >
              {l(t.customService)}
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap px-1.5 py-1 min-h-[44px] flex items-center"
            >
              {l(t.calculator)}
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer whitespace-nowrap px-1.5 py-1 min-h-[44px] flex items-center"
            >
              {l(t.about)}
            </button>
          </nav>

          {/* Right Action Bar - Adaptive layout preventing any collision & keeping hamburger always visible */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Desktop Expandable Luxury Search (Visible on screens >= 1024px (lg:)) */}
            <div ref={searchContainerRef} className="hidden lg:flex items-center relative">
              <AnimatePresence initial={false}>
                {desktopSearchOpen || searchQuery ? (
                  <motion.div
                    key="desktop-search-input"
                    initial={{ width: 38, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 38, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="relative flex items-center overflow-hidden"
                  >
                    <Search className="w-3.5 h-3.5 text-[#D4AF37]/80 absolute left-3 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (currentPath !== '/') {
                          navigateTo('/');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (currentPath !== '/') {
                            navigateTo('/');
                          }
                          setTimeout(() => {
                            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                      placeholder={l(t.searchPlaceholder)}
                      className="w-full bg-[#221711] text-xs text-[#FDFBF7] pl-8 pr-7 py-2 rounded-full border border-[#D4AF37]/45 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#A69282] shadow-inner transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setDesktopSearchOpen(false);
                      }}
                      className="absolute right-2 text-[#D4C5B9]/60 hover:text-[#FDFBF7] p-0.5 rounded-full hover:bg-[#2A1E17] cursor-pointer"
                      aria-label="Clear and close search"
                      title="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="desktop-search-trigger"
                    type="button"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={() => {
                      setDesktopSearchOpen(true);
                      if (currentPath !== '/') {
                        navigateTo('/');
                        setTimeout(() => {
                          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[#2E2018] text-[#E2D7CC] hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                    title={l(t.searchPlaceholder)}
                    aria-label="Open search"
                  >
                    <Search className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Compact Language Switcher (< 640px) */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="sm:hidden px-2.5 py-1.5 min-h-[38px] flex items-center gap-1 rounded-full bg-[#221711] border border-[#D4AF37]/40 text-[11px] font-bold shadow-inner shrink-0 cursor-pointer"
              title={language === 'EN' ? 'বাংলা মোডে পরিবর্তন করুন' : 'Switch to English'}
              aria-label="Toggle language mode"
            >
              <span className={language === 'EN' ? 'text-[#D4AF37] font-extrabold' : 'text-[#A69282]'}>EN</span>
              <span className="text-[#D4AF37]/40">/</span>
              <span className={language === 'BN' ? 'text-[#D4AF37] font-extrabold' : 'text-[#A69282]'}>বাং</span>
            </button>

            {/* Desktop / Tablet Language Switcher (>= 640px) */}
            <div className="hidden sm:inline-flex shrink-0 items-center p-0.5 rounded-full bg-[#221711] border border-[#D4AF37]/30 shadow-inner">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 sm:px-2.5 py-1.5 min-h-[38px] sm:min-h-[40px] flex items-center text-[11px] sm:text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
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
                className={`px-2 sm:px-2.5 py-1.5 min-h-[38px] sm:min-h-[40px] flex items-center text-[11px] sm:text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  language === 'BN'
                    ? 'bg-[#D4AF37] text-[#170F0B] shadow-sm'
                    : 'text-[#D4C5B9] hover:text-[#FDFBF7]'
                }`}
                title="বাংলা মোডে পরিবর্তন করুন (টাকা ৳)"
              >
                বাংলা (৳)
              </button>
            </div>

            {/* WhatsApp Direct Chat Link (Visible on sm+, full label on min-[1680px]) */}
            <a
              href="https://wa.me/8801905206450"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[40px] rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/35 transition-all shrink-0 whitespace-nowrap"
              title="Direct WhatsApp Support: 8801905206450"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 shrink-0" />
              <span className="hidden min-[1680px]:inline">{l(t.whatsapp)}</span>
            </a>

            {/* Client Portal / Login Trigger with 44px touch target (Visible on md+, available in drawer on mobile) */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hidden md:flex min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] items-center justify-center rounded-full hover:bg-[#2E2018] text-[#E2D7CC] hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0"
              title={l(t.clientPortal)}
              aria-label="Client Portal"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Cart Trigger with Drawer and min-h-[38px] on mobile */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] sm:min-h-[44px] rounded-full btn-gold cursor-pointer whitespace-nowrap shrink-0"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#170F0B]" />
              <span className="hidden min-[1600px]:inline text-xs font-bold uppercase tracking-wider text-[#170F0B]">
                {l(t.cart)}
              </span>
              <span className="flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 px-1 text-[10px] sm:text-[11px] font-extrabold bg-[#170F0B] text-[#D4AF37] rounded-full shadow-sm">
                {language === 'BN' ? (totalItemsCount === 0 ? '০' : totalItemsCount) : totalItemsCount}
              </span>
            </motion.button>

            {/* Mobile / Tablet Menu Toggle: ALWAYS properly visible & aligned on the top right */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 text-[#D4AF37] hover:text-[#FDFBF7] bg-[#241710] sm:bg-transparent border border-[#D4AF37]/45 sm:border-transparent shrink-0 cursor-pointer rounded-xl hover:bg-[#2E2018] transition-all shadow-sm"
              aria-label="Toggle navigation menu"
              title="Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible on screens < 1024px: lg:hidden) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#D4AF37]/20 bg-[#1E140F] px-4 sm:px-6 pt-3 pb-6 space-y-3"
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

            <div className="flex flex-col space-y-1.5 text-sm font-semibold text-[#FDFBF7]">
              <button
                onClick={handleHomeClick}
                className="text-left py-2.5 px-3 min-h-[44px] flex items-center rounded-xl hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                {l(t.home)}
              </button>
              <button
                onClick={() => handleNavClick('catalog')}
                className="text-left py-2.5 px-3 min-h-[44px] flex items-center rounded-xl hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                {l(t.catalog)}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('/custom-order');
                }}
                className="text-left py-2.5 px-3 min-h-[44px] flex items-center rounded-xl hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                {l(t.customService)}
              </button>
              <button
                onClick={() => handleNavClick('calculator')}
                className="text-left py-2.5 px-3 min-h-[44px] flex items-center rounded-xl hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                {l(t.calculator)}
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-left py-2.5 px-3 min-h-[44px] flex items-center rounded-xl hover:bg-[#2A1E17] hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                {l(t.about)}
              </button>
            </div>

            <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3">
              <a
                href="https://wa.me/8801905206450"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{l(t.whatsapp)}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#2A1E17] text-[#E2D7CC] border border-[#D4AF37]/30 hover:text-[#D4AF37] text-xs font-semibold shrink-0 cursor-pointer"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{l(t.clientPortal)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
