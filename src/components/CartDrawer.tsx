import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice, formatNumberOnly } from '../data/formatters';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotalUSD,
    subtotalBDT,
    language,
    l,
    setIsCheckoutOpen,
  } = useApp();

  const t = TRANSLATIONS.cart;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#0D0806]/80 backdrop-blur-md"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-screen max-w-md bg-[#1C120D] border-l border-[#D4AF37]/30 flex flex-col shadow-2xl"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#241812]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#34241B] flex items-center justify-center border border-[#D4AF37]/40 shadow-inner">
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-[#FDFBF7]">
                      {l(t.title)}
                    </h2>
                    <span className="text-[11px] text-[#D4C5B9] font-medium">
                      {formatNumberOnly(cartItems.length, language)} {language === 'BN' ? 'টি আইটেম' : 'items selected'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg text-[#D4C5B9] hover:text-[#FDFBF7] hover:bg-[#34241B] transition-colors cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Tannery Assurance bar */}
              <div className="px-6 py-2.5 bg-[#261A13] border-b border-[#D4AF37]/20 flex items-center gap-2 text-xs text-[#D4C5B9]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{language === 'BN' ? '১০০% আসল ট্যানারি চামড়া ও সুরক্ষিত শিপিং' : '100% Genuine Tannery Guaranteed & Insured Supply'}</span>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#261A13] border border-[#D4AF37]/30 flex items-center justify-center mb-4 shadow-inner">
                      <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#FDFBF7]">
                      {l(t.emptyTitle)}
                    </h3>
                    <p className="text-xs text-[#D4C5B9] max-w-xs mt-1.5 mb-6">
                      {l(t.emptyDesc)}
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 rounded-full btn-gold text-xs font-bold tracking-wider uppercase cursor-pointer text-[#170F0B]"
                    >
                      {language === 'BN' ? 'ক্যাটালগ দেখুন' : 'Explore Catalog'}
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const isBelowMOQ = item.sqft < item.leather.moq;
                    const itemTotalUSD = item.leather.priceUSD * item.sqft;
                    const itemTotalBDT = item.leather.priceBDT * item.sqft;

                    return (
                      <motion.div
                        layout
                        key={`${item.leather.id}-${item.selectedColor.code}`}
                        className="p-4 rounded-2xl bg-[#261A13] border border-[#D4AF37]/25 shadow-md space-y-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.leather.image}
                            alt={l(item.leather.name)}
                            className="w-18 h-18 object-cover rounded-xl bg-stone-900 shrink-0 border border-[#D4AF37]/20"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-heading text-sm font-bold text-[#FDFBF7] truncate">
                                {l(item.leather.name)}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.leather.id, item.selectedColor.code)}
                                className="text-[#A69282] hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Color shade badge */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-[#D4AF37]/40 shrink-0"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span className="text-[11px] text-[#D4C5B9] font-medium">
                                {l(item.selectedColor.name)} ({item.selectedColor.code})
                              </span>
                            </div>

                            {/* Unit rate */}
                            <p className="text-[11px] text-[#E5C365] mt-1 font-semibold">
                              {formatPrice(item.leather.priceUSD, item.leather.priceBDT, language, { perSqft: true, decimals: true })}
                            </p>
                          </div>
                        </div>

                        {/* MOQ Warning if quantity is below MOQ */}
                        {isBelowMOQ && (
                          <div className="p-2.5 rounded-lg bg-amber-950/70 border border-amber-500/40 flex items-start gap-2 text-[11px] text-amber-200 leading-tight">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              {l(t.moqWarning).replace('{moq}', formatNumberOnly(item.leather.moq, language))}
                            </span>
                          </div>
                        )}

                        {/* Quantity and Line Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/20">
                          
                          {/* Sq.ft Stepper */}
                          <div className="flex items-center gap-2 bg-[#1A110C] rounded-lg border border-[#D4AF37]/30 px-2.5 py-1">
                            <button
                              onClick={() => updateQuantity(item.leather.id, item.selectedColor.code, -10)}
                              className="text-[#D4AF37] hover:text-[#FDFBF7] p-0.5 cursor-pointer"
                              title="Decrease 10 sq.ft"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-[#FDFBF7] min-w-[50px] text-center">
                              {formatNumberOnly(item.sqft, language)} {l(t.sqftCount)}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.leather.id, item.selectedColor.code, 10)}
                              className="text-[#D4AF37] hover:text-[#FDFBF7] p-0.5 cursor-pointer"
                              title="Increase 10 sq.ft"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-heading font-bold text-sm text-[#E5C365]">
                              {formatPrice(itemTotalUSD, itemTotalBDT, language, { decimals: true })}
                            </span>
                          </div>

                        </div>

                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#D4AF37]/20 bg-[#241812] space-y-4">
                  <div className="space-y-1.5 text-xs text-[#D4C5B9]">
                    <div className="flex justify-between">
                      <span>{language === 'BN' ? 'মোট আয়তন' : 'Total Leather Area'}</span>
                      <span className="font-bold text-[#FDFBF7]">
                        {formatNumberOnly(cartItems.reduce((acc, i) => acc + i.sqft, 0), language)} {l(t.sqftCount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'BN' ? 'ট্যানারি প্যাকিং ও ইনভয়েস' : 'Tannery Packaging & Inspection'}</span>
                      <span className="text-emerald-400 font-bold">{language === 'BN' ? 'বিনামূল্যে' : 'Included'}</span>
                    </div>
                    <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between text-base font-bold text-[#FDFBF7]">
                      <span className="font-heading">{l(t.subtotal)}</span>
                      <span className="font-heading text-lg text-[#E5C365]">
                        {formatPrice(subtotalUSD, subtotalBDT, language, { decimals: true })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider text-[#170F0B] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>{l(t.checkoutBtn)}</span>
                    <ArrowRight className="w-4 h-4 text-[#170F0B]" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
};
