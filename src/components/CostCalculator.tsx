import React, { useState, useMemo } from 'react';
import { Calculator, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice, formatNumberOnly } from '../data/formatters';
import { MagneticButton } from './MagneticButton';
import { ScrollReveal } from './ScrollReveal';

export const CostCalculator: React.FC = () => {
  const { language, l, addToCart, proceedToCustomOrder } = useApp();
  const t = TRANSLATIONS.calculator;

  const [selectedLeatherId, setSelectedLeatherId] = useState<string>('full-grain-cowhide');
  const [sqftRequired, setSqftRequired] = useState<number>(50);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const selectedLeather = useMemo(
    () => LEATHER_CATALOG.find((item) => item.id === selectedLeatherId) || LEATHER_CATALOG[0],
    [selectedLeatherId]
  );

  // Simplified Calculation: Total = Sq.ft Price × Required Sq.ft
  const totalPriceUSD = sqftRequired * selectedLeather.priceUSD;
  const totalPriceBDT = sqftRequired * selectedLeather.priceBDT;

  const handleAddToCart = () => {
    addToCart(selectedLeather, sqftRequired, selectedLeather.colors[0]);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleProceedToOrder = () => {
    proceedToCustomOrder(selectedLeather.id, sqftRequired, totalPriceUSD, totalPriceBDT);
  };

  return (
    <section id="calculator" className="w-full py-20 bg-[#170F0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - NO B2B text */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#261A13] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{l(t.badge)}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDFBF7] tracking-tight">
            {l(t.title)}
          </h2>
          <p className="text-sm sm:text-base text-[#D4C5B9] mt-3 font-normal leading-relaxed">
            {l(t.subtitle)}
          </p>
        </ScrollReveal>

        {/* Simplified Calculator Box */}
        <ScrollReveal className="max-w-4xl mx-auto">
          <div className="luxury-card glass-sheen rounded-3xl p-6 sm:p-10 bg-[#261A13] border border-[#D4AF37]/30 shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="space-y-6">
              
              {/* 1. Leather Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.leatherSelectLabel)}
                </label>
                <select
                  value={selectedLeatherId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedLeatherId(newId);
                    const found = LEATHER_CATALOG.find((item) => item.id === newId);
                    if (found && sqftRequired < found.moq) {
                      setSqftRequired(found.moq);
                    }
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] font-semibold cursor-pointer transition-all"
                >
                  {LEATHER_CATALOG.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#1A110C] text-[#FDFBF7]">
                      {l(item.name)} — {formatPrice(item.priceUSD, item.priceBDT, language, { perSqft: true, decimals: true })}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Required Sq.Ft Slider & Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    {l(t.sqftSliderLabel)}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      step="5"
                      value={sqftRequired}
                      onChange={(e) => setSqftRequired(Math.max(1, Number(e.target.value)))}
                      className="w-20 text-center font-bold text-sm bg-[#1A110C] border border-[#D4AF37]/25 rounded-lg py-1 px-2 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <span className="text-xs font-semibold text-[#D4C5B9]">
                      {language === 'BN' ? 'বর্গফুট' : 'sq.ft'}
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={sqftRequired}
                  onChange={(e) => setSqftRequired(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer h-2.5 bg-[#1A110C] rounded-lg mt-2"
                />

                <div className="flex justify-between text-[11px] text-[#A69282] mt-2 font-medium">
                  <span>10 {language === 'BN' ? 'বর্গফুট' : 'sq.ft'}</span>
                  <span>150 {language === 'BN' ? 'বর্গফুট' : 'sq.ft'}</span>
                  <span>300+ {language === 'BN' ? 'বর্গফুট' : 'sq.ft'}</span>
                </div>
              </div>

              {/* Unit Rate & MOQ Summary */}
              <div className="p-4 rounded-2xl bg-[#1F1510] border border-[#D4AF37]/20 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#D4C5B9] font-medium">{l(t.rateLabel)}:</span>
                  <span className="font-bold text-[#E5C365]">
                    {formatPrice(selectedLeather.priceUSD, selectedLeather.priceBDT, language, { perSqft: true, decimals: true })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#D4C5B9] font-medium">{l(t.moqNotice)}:</span>
                  <span className="font-bold text-[#D4AF37]">
                    {formatNumberOnly(selectedLeather.moq, language)} {language === 'BN' ? 'বর্গফুট' : 'sq.ft'}
                  </span>
                </div>
              </div>

            </div>

            {/* Total Output Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#38261B] via-[#2D1E16] to-[#20150F] text-[#FDFBF7] shadow-2xl border border-[#D4AF37]/50 flex flex-col justify-between text-center space-y-6">
              
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-2">
                  {l(t.totalPrice)}
                </span>
                
                {/* Big Calculated Price */}
                <div className="font-heading text-4xl sm:text-5xl font-extrabold text-[#FDFBF7] drop-shadow-md">
                  {formatPrice(totalPriceUSD, totalPriceBDT, language, { decimals: true })}
                </div>

                <p className="text-xs text-[#D4C5B9] mt-3 font-normal opacity-90">
                  {formatNumberOnly(sqftRequired, language)} {language === 'BN' ? 'বর্গফুট' : 'sq.ft'} × {formatPrice(selectedLeather.priceUSD, selectedLeather.priceBDT, language, { perSqft: true, decimals: true })}
                </p>
              </div>

              {/* Formula note */}
              <div className="p-3 rounded-xl bg-[#140D09]/60 text-[11px] text-[#D4C5B9] leading-normal border border-[#D4AF37]/20">
                {l(t.formulaNote)}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <MagneticButton
                  type="button"
                  onClick={handleProceedToOrder}
                  className="w-full py-4 px-6 rounded-2xl btn-gold text-xs sm:text-sm font-bold uppercase tracking-wider text-[#170F0B] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] transition-all group"
                >
                  <span>{language === 'BN' ? 'কাস্টম অর্ডারে এগিয়ে যান' : 'Proceed to Custom Order'}</span>
                  <ArrowRight className="w-4 h-4 text-[#170F0B] group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl bg-[#1F1510] hover:bg-[#2A1E17] text-[#FDFBF7] hover:text-[#D4AF37] text-xs font-semibold tracking-wide border border-[#D4AF37]/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedFeedback ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">{language === 'BN' ? 'ব্যাগে যোগ হয়েছে!' : 'Added to Bag!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{l(t.addToCartBtn)}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
