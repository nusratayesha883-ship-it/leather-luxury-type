import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const Hero: React.FC = () => {
  const { l } = useApp();
  const t = TRANSLATIONS.hero;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[62vh] min-h-[520px] max-h-[700px] overflow-hidden flex items-center justify-center group my-0">
      
      {/* 100% Genuine Full-Grain Luxury Leather Texture Background with Hover Zoom FX */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2400&q=85"
          alt="100% Genuine Full-Grain Luxury Leather Hide Texture"
          loading="lazy"
          className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        
        {/* Deep Cognac & Charcoal Gradient Overlay specifically preserving the genuine leather grain */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#231F20]/92 via-[#4B3F35]/80 to-[#231F20]/88" />
        {/* Subtle radial ambient warmth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_75%)]" />
      </div>

      {/* Content Container with generous padding so text never touches top or edges */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center flex flex-col items-center py-12">
        
        {/* Luxury Top Tag - NO B2B TEXT */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6F1]/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{l(t.badge)}</span>
        </motion.div>

        {/* H1 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-[#FAF6F1] tracking-tight leading-[1.18] max-w-4xl drop-shadow-md"
        >
          {l(t.h1)}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mt-4 sm:mt-5 font-normal leading-relaxed"
        >
          {l(t.subheadline)}
        </motion.p>

        {/* Dual CTAs with smooth hover FX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* CTA 1: Explore Catalog */}
          <button
            onClick={() => scrollToSection('catalog')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-gold text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>{l(t.ctaExplore)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* CTA 2: Request Custom Service */}
          <button
            onClick={() => scrollToSection('custom-service')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FAF6F1]/10 hover:bg-[#FAF6F1]/20 text-[#FAF6F1] hover:text-[#D4AF37] text-sm font-medium tracking-wide border border-[#FAF6F1]/25 hover:border-[#D4AF37] transition-all backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#D4AF37]" />
            <span>{l(t.ctaCustom)}</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
};
