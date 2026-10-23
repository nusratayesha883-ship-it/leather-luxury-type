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
    <section id="trust-strip" className="w-full bg-[#FAF6F1] border-b border-[#4B3F35]/15 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#4B3F35]/10 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#4B3F35]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                {ICONS[idx]}
              </div>
              <div>
                <h4 className="font-heading text-sm sm:text-base font-bold text-[#231F20] leading-snug">
                  {l(badge.title)}
                </h4>
                <p className="text-xs text-[#4B3F35]/75 mt-1 leading-normal">
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
