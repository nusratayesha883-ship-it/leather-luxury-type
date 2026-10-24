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
  const { l } = useApp();
  const badges = TRANSLATIONS.trustBadges;

  return (
    <section id="trust-strip" className="w-full bg-[#1D130E] border-b border-[#D4AF37]/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[#261A13] border border-[#D4AF37]/20 shadow-md hover:shadow-xl hover:border-[#D4AF37]/60 hover:bg-[#2C1E16] transition-all"
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
