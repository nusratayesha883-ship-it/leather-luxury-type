import React from 'react';
import { Award, Layers, ShieldCheck, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScrollReveal, RevealItem } from './ScrollReveal';

export const TrustBadges: React.FC = () => {
  const { language } = useApp();

  const features = [
    {
      icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
      title: language === 'BN' ? '১০০% আসল ট্যানারি চামড়া' : '100% Genuine Tannery Leather',
      desc: language === 'BN' 
        ? 'কোনো সিন্থেটিক বা বন্ডেড চামড়া নয়, সরাসরি বিশ্বমানের ট্যানারি' 
        : 'Zero synthetic blends or bonded fillers, direct master tannery supply',
    },
    {
      icon: <Layers className="w-6 h-6 text-[#D4AF37]" />,
      title: language === 'BN' ? 'পাইকারি স্তরভিত্তিক মূল্যছাড়' : 'Tiered Wholesale Pricing',
      desc: language === 'BN' 
        ? '১৫০ বর্গফুটের বেশি বৃহৎ অর্ডারে স্তরভিত্তিক বিশেষ পাইকারি ছাড়' 
        : 'Deep bulk discounts for volume commercial orders over 150 sq.ft',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: language === 'BN' ? 'আইএসও সার্টিফাইড মান' : 'ISO Certified Quality',
      desc: language === 'BN' 
        ? 'কঠোর আন্তর্জাতিক টেনসিল ও পরিবেশবান্ধব কেমিক্যালমুক্ত ট্যানিং' 
        : 'Strict tensile strength & eco-compliant pit tanning protocols',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#D4AF37]" />,
      title: language === 'BN' ? 'বিশ্বব্যাপী ও স্থানীয় ডেলিভারি' : 'Global & Local Delivery',
      desc: language === 'BN' 
        ? 'আন্তর্জাতিক বিমান কার্গো ও দেশব্যাপী দ্রুত নিরাপদ কুরিয়ার সুবিধা' 
        : 'Priority air freight exports & nationwide express insured couriers',
    },
  ];

  return (
    <section 
      id="about" 
      className="w-full bg-[#170F0B] py-10 sm:py-14 border-b border-[#D4AF37]/20 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly ONLY the 4 Quality Feature Cards (Top texts completely hidden/removed) */}
        <ScrollReveal 
          direction="up" 
          distance={20}
          stagger={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {features.map((feature, idx) => (
            <RevealItem key={idx}>
              <div className="h-full luxury-card glass-sheen bg-[#221610] border border-[#D4AF37]/25 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:border-[#D4AF37]/60 hover:shadow-[0_10px_30px_rgba(212,175,55,0.14)] transition-all duration-300 flex flex-col justify-start">
                <div className="w-12 h-12 rounded-xl bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 shadow-inner mb-4 shrink-0">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-sm sm:text-base md:text-lg font-bold text-[#FDFBF7] leading-snug break-words">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#D4C5B9] mt-2 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
};
