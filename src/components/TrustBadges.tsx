import React from 'react';
import { ShieldCheck, Layers, Award, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

const ICONS = [
  <Award className="w-6 h-6 text-[#D4AF37]" />,
  <Layers className="w-6 h-6 text-[#D4AF37]" />,
  <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
  <Truck className="w-6 h-6 text-[#D4AF37]" />,
];

export const TrustBadges: React.FC = () => {
  const { l, language } = useApp();
  const badges = TRANSLATIONS.trustBadges;

  return (
    <section 
      id="about" 
      className="w-full bg-[#1D130E] border-b border-[#D4AF37]/20 py-12 sm:py-16 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dedicated About Atelier Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#261A13] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            <span>{language === 'BN' ? 'আমাদের ঐতিহ্য ও প্রতিশ্রুতি' : 'Heritage & Atelier Standards'}</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#FDFBF7] tracking-tight">
            {language === 'BN' ? 'লাক্সহাইড অ্যাটেলিয়ার সম্পর্কে' : 'About LuxeHide Atelier'}
          </h2>
          <p className="text-xs sm:text-sm text-[#D4C5B9] mt-2.5 font-normal leading-relaxed">
            {language === 'BN' 
              ? 'আন্তর্জাতিক মানের সার্টিফাইড ট্যানারি চামড়া সরবরাহ এবং মাস্টার কারিগরদের জন্য শতভাগ জেনুইন লেদার আর্ট।'
              : 'Direct tannery sourcing, eco-compliant chemical-free pit tanning, and certified wholesale supply for luxury global leathercraft.'}
          </p>
        </div>

        {/* 4 Trust Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 rounded-2xl bg-[#261A13] border border-[#D4AF37]/20 shadow-md hover:shadow-xl hover:border-[#D4AF37]/60 hover:bg-[#2C1E16] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#34231A] flex items-center justify-center shrink-0 border border-[#D4AF37]/40 shadow-inner">
                {ICONS[idx]}
              </div>
              <div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-[#FDFBF7] leading-snug">
                  {l(badge.title)}
                </h4>
                <p className="text-xs text-[#D4C5B9] mt-1 leading-normal">
                  {l(badge.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
