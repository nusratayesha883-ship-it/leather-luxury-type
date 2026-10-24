import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice, formatNumberOnly } from '../data/formatters';
import { ScrollReveal } from './ScrollReveal';
import { MagneticButton } from './MagneticButton';

export const LeatherCatalog: React.FC = () => {
  const {
    language,
    l,
    searchQuery,
    navigateTo,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const t = TRANSLATIONS.catalog;

  const categories = [
    { id: 'all', label: l(t.filterAll) },
    { id: 'Cowhide & Calf', label: l(t.filterCowhide) },
    { id: 'Nubuck & Suede', label: l(t.filterTextured) },
    { id: 'Veg-Tan & Specialty', label: l(t.filterSpecialty) },
    { id: 'Exotic & Grain', label: l(t.filterExotic) },
  ];

  const filteredLeathers = LEATHER_CATALOG.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category.en === activeCategory;
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      item.name.en.toLowerCase().includes(query) ||
      item.name.bn.toLowerCase().includes(query) ||
      item.description.en.toLowerCase().includes(query) ||
      item.description.bn.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="w-full py-16 sm:py-24 bg-[#170F0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-5xl xl:max-w-6xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#261A13] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Artisan Tannery Standards</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDFBF7] tracking-tight">
            {l(t.title)}
          </h2>
          <p className="text-sm sm:text-base text-[#D4C5B9] mt-3 font-normal leading-relaxed lg:whitespace-nowrap">
            {l(t.subtitle)}
          </p>
        </ScrollReveal>

        {/* Filter Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#170F0B] font-bold shadow-md'
                    : 'bg-[#241912] text-[#D4C5B9] hover:bg-[#32231A] hover:text-[#FDFBF7] border border-[#D4AF37]/25'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCatalogCategoryPill"
                    className="absolute inset-0 bg-[#D4AF37] rounded-full -z-10 shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Simplified 9 Leathers Grid: 1 col on mobile, 2 cols on tablet (sm:), 3 cols on desktop (lg:) */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredLeathers.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => navigateTo('/catalog/' + item.id)}
                className="luxury-card glass-sheen rounded-3xl overflow-hidden flex flex-col group border border-[#D4AF37]/25 bg-[#261A13] cursor-pointer"
              >
                
                {/* High-Res Leather Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#170F0B]">
                  <img
                    src={item.image}
                    alt={l(item.name)}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out leather-swatch-zoom"
                  />

                  {/* Gradient & Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#170F0B]/85 via-transparent to-transparent opacity-75" />

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#D4AF37] text-[#170F0B] rounded-full shadow-md">
                      {l(item.badge)}
                    </span>
                  )}

                  {/* Category pill */}
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#FDFBF7] bg-[#170F0B]/85 backdrop-blur-md rounded-lg border border-[#D4AF37]/30">
                    {l(item.category)}
                  </span>

                  {/* MOQ Pill */}
                  <div className="absolute bottom-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#170F0B]/90 text-[#FDFBF7] border border-[#D4AF37]/30 text-[11px] font-extrabold tracking-wide shadow-sm backdrop-blur-sm">
                      {l(t.moqLabel)}: {formatNumberOnly(item.moq, language)} {l(t.sqftUnit)}
                    </span>
                  </div>
                </div>

                {/* Simplified Card Body: Title, Price & View Details */}
                <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors line-clamp-1 break-words">
                      {l(item.name)}
                    </h3>
                    <p className="text-xs text-[#D4C5B9] mt-1 line-clamp-1 leading-normal">
                      {l(item.description)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#A69282] block font-semibold">
                        {language === 'BN' ? 'প্রতি বর্গফুট' : 'Base Rate'}
                      </span>
                      <div className="font-heading text-xl sm:text-2xl font-bold text-[#E5C365] break-words">
                        {formatPrice(item.priceUSD, item.priceBDT, language, { perSqft: true, decimals: true })}
                      </div>
                    </div>

                    {/* View Details Button (Navigates directly to dedicated PDP) */}
                    <MagneticButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('/catalog/' + item.id);
                      }}
                      className="px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl btn-gold text-xs font-bold text-[#170F0B] flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#170F0B]" />
                      <span>{l(t.viewDetails)}</span>
                    </MagneticButton>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
