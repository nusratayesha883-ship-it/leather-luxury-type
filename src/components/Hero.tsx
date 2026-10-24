import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { MagneticButton } from './MagneticButton';
import { useSmoothScroll } from './SmoothScroll';

export const Hero: React.FC = () => {
  const { l, navigateTo } = useApp();
  const { scrollTo } = useSmoothScroll();
  const t = TRANSLATIONS.hero;
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scrolling for background hide texture
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  const scrollToSection = (id: string) => {
    scrollTo(`#${id}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[64vh] min-h-[520px] max-h-[720px] overflow-hidden flex items-center justify-center group my-0"
    >
      {/* 100% Genuine Full-Grain Luxury Leather Texture Background with Parallax & Hover Zoom FX */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2400&q=85"
          alt="100% Genuine Full-Grain Luxury Leather Hide Texture"
          loading="lazy"
          className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        
        {/* Deep Luxury Espresso & Cognac Gradient Overlay specifically preserving the genuine leather grain */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#170F0B]/95 via-[#2E1D14]/85 to-[#170F0B]/92" />
        {/* Subtle radial ambient warmth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.24)_0%,transparent_75%)]" />
      </motion.div>

      {/* Content Container with generous padding so text never touches top or edges */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 text-center flex flex-col items-center py-10 sm:py-12"
      >
        {/* Luxury Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#271B14]/85 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-5 sm:mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{l(t.badge)}</span>
        </motion.div>

        {/* H1 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#FDFBF7] tracking-tight leading-[1.2] max-w-4xl drop-shadow-lg break-words"
        >
          {l(t.h1)}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[#D4C5B9] text-xs sm:text-base md:text-lg max-w-2xl mt-3 sm:mt-5 font-normal leading-relaxed break-words"
        >
          {l(t.subheadline)}
        </motion.p>

        {/* Dual Magnetic CTAs with smooth shimmer & hover FX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
        >
          {/* CTA 1: Explore Catalog */}
          <MagneticButton
            onClick={() => scrollToSection('catalog')}
            className="w-full sm:w-auto min-h-[46px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full btn-gold text-xs sm:text-sm font-bold tracking-wide shadow-lg flex items-center justify-center gap-2"
          >
            <span>{l(t.ctaExplore)}</span>
            <ArrowRight className="w-4 h-4 text-[#170F0B]" />
          </MagneticButton>

          {/* CTA 2: Request Custom Service */}
          <MagneticButton
            onClick={() => navigateTo('/custom-order')}
            className="w-full sm:w-auto min-h-[46px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#271B14]/85 hover:bg-[#34241B] text-[#FDFBF7] hover:text-[#D4AF37] text-xs sm:text-sm font-medium tracking-wide border border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-md flex items-center justify-center gap-2"
          >
            <Sliders className="w-4 h-4 text-[#D4AF37]" />
            <span>{l(t.ctaCustom)}</span>
          </MagneticButton>
        </motion.div>

      </motion.div>
    </section>
  );
};
