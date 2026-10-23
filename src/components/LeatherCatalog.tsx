import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sliders, Check, Sparkles, X, Eye, Plus, Minus, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice, formatNumberOnly } from '../data/formatters';
import type { LeatherItem, LeatherColor } from '../types';

export const LeatherCatalog: React.FC = () => {
  const {
    language,
    l,
    addToCart,
    setSelectedCustomLeatherId,
    searchQuery,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalItem, setModalItem] = useState<LeatherItem | null>(null);
  const [modalColor, setModalColor] = useState<LeatherColor | null>(null);
  const [modalSqft, setModalSqft] = useState<number>(50);
  const [modalAdded, setModalAdded] = useState(false);

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

  const handleOpenModal = (item: LeatherItem) => {
    setModalItem(item);
    setModalColor(item.colors[0]);
    setModalSqft(item.moq);
    setModalAdded(false);
  };

  const handleCloseModal = () => {
    setModalItem(null);
  };

  const handleModalAddToCart = () => {
    if (!modalItem) return;
    const color = modalColor || modalItem.colors[0];
    addToCart(modalItem, modalSqft, color);
    setModalAdded(true);
    setTimeout(() => {
      setModalAdded(false);
    }, 1800);
  };

  const handleModalCustomize = () => {
    if (!modalItem) return;
    setSelectedCustomLeatherId(modalItem.id);
    setModalItem(null);
    const formElement = document.getElementById('custom-service');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="catalog" className="w-full py-16 sm:py-24 bg-[#FAF6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4B3F35]/10 border border-[#D4AF37]/40 text-[#4B3F35] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Artisan Tannery Standards</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#231F20] tracking-tight">
            {l(t.title)}
          </h2>
          <p className="text-sm sm:text-base text-[#4B3F35]/80 mt-3 font-normal leading-relaxed">
            {l(t.subtitle)}
          </p>
        </div>

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
                    ? 'bg-[#4B3F35] text-[#FAF6F1] shadow-md'
                    : 'bg-[#FFFFFF] text-[#4B3F35] hover:bg-[#4B3F35]/10 border border-[#4B3F35]/15'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCatalogCategoryPill"
                    className="absolute inset-0 bg-[#4B3F35] rounded-full -z-10 shadow-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Simplified 9 Leathers Grid: ONLY Image, Title, Base Price per sq.ft, and View Details */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                onClick={() => handleOpenModal(item)}
                className="luxury-card rounded-3xl overflow-hidden flex flex-col group border border-[#4B3F35]/15 bg-white cursor-pointer"
              >
                
                {/* High-Res Leather Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#231F20]">
                  <img
                    src={item.image}
                    alt={l(item.name)}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient & Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231F20]/75 via-transparent to-transparent opacity-70" />

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#D4AF37] text-[#231F20] rounded-full shadow-md">
                      {l(item.badge)}
                    </span>
                  )}

                  {/* Category pill */}
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#FAF6F1] bg-[#4B3F35]/80 backdrop-blur-md rounded-lg border border-[#FAF6F1]/20">
                    {l(item.category)}
                  </span>

                  {/* MOQ Pill */}
                  <div className="absolute bottom-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#FAF6F1]/90 text-[#231F20] text-[11px] font-extrabold tracking-wide shadow-sm">
                      {l(t.moqLabel)}: {formatNumberOnly(item.moq, language)} {l(t.sqftUnit)}
                    </span>
                  </div>
                </div>

                {/* Simplified Card Body: Title, Price & View Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#231F20] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {l(item.name)}
                    </h3>
                    <p className="text-xs text-[#4B3F35]/70 mt-1 line-clamp-1">
                      {l(item.description)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#4B3F35]/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#4B3F35]/70 block font-semibold">
                        {language === 'BN' ? 'প্রতি বর্গফুট' : 'Base Rate'}
                      </span>
                      <div className="font-heading text-2xl font-bold text-[#4B3F35]">
                        {formatPrice(item.priceUSD, item.priceBDT, language, { perSqft: true, decimals: true })}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(item);
                      }}
                      className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold text-[#231F20] flex items-center gap-1.5 shadow-sm group-hover:shadow-md transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{l(t.viewDetails)}</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Product Details Modal (Clean Popup Displaying Specs, Swatches & Add-To-Cart) */}
      <AnimatePresence>
        {modalItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-[#231F20]/75 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-[#4B3F35]/15 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#4B3F35]/70 hover:text-[#231F20] hover:bg-[#FAF6F1] transition-colors cursor-pointer z-10"
                aria-label="Close details modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left: Image & Category */}
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#231F20] shadow-md">
                    <img
                      src={modalItem.image}
                      alt={l(modalItem.name)}
                      className="w-full h-full object-cover object-center"
                    />
                    {modalItem.badge && (
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#D4AF37] text-[#231F20] rounded-full shadow-md">
                        {l(modalItem.badge)}
                      </span>
                    )}
                    <span className="absolute bottom-3.5 left-3.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#FAF6F1] bg-[#4B3F35]/85 backdrop-blur-md rounded-lg">
                      {l(modalItem.category)}
                    </span>
                  </div>

                  {/* Volume Tiers Table */}
                  <div className="mt-5 p-4 rounded-2xl bg-[#FAF6F1] border border-[#4B3F35]/15">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#4B3F35] mb-2 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {l(t.volumeTiers)}
                    </span>
                    <div className="space-y-1.5">
                      {modalItem.tieredPricing.map((tier, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-2 rounded-lg bg-white flex items-center justify-between border border-[#4B3F35]/10"
                        >
                          <span className="text-[#4B3F35] font-medium">{l(tier.label)}</span>
                          <span className="font-bold text-[#231F20]">
                            {formatPrice(tier.priceUSD, tier.priceBDT, language, { perSqft: true })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Technical Specs, Color Swatches, Quantity & Add To Cart */}
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                      {l(modalItem.category)}
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#231F20]">
                      {l(modalItem.name)}
                    </h3>
                    <div className="mt-2 text-xl font-heading font-extrabold text-[#4B3F35]">
                      {formatPrice(modalItem.priceUSD, modalItem.priceBDT, language, { perSqft: true, decimals: true })}
                    </div>
                    <p className="text-xs text-[#4B3F35]/80 mt-2 leading-relaxed">
                      {l(modalItem.description)}
                    </p>
                  </div>

                  {/* Key Technical Features (Thickness, Temper, Ideal uses) */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F1] border border-[#4B3F35]/15 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B3F35] block mb-1">
                      {l(t.featuresLabel)}
                    </span>
                    {modalItem.features.map((feat, fIdx) => (
                      <div key={fIdx} className="text-xs text-[#231F20] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                        <span>{l(feat)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color Swatches Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#4B3F35]">
                        {l(t.selectColor)}:
                      </span>
                      {modalColor && (
                        <span className="text-xs font-bold text-[#231F20]">
                          {l(modalColor.name)} <span className="text-[10px] text-[#4B3F35]/60 font-mono">({modalColor.code})</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5">
                      {modalItem.colors.map((color) => {
                        const isSelected = modalColor?.code === color.code;
                        return (
                          <button
                            key={color.code}
                            onClick={() => setModalColor(color)}
                            title={`${l(color.name)} (${color.code})`}
                            className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#4B3F35] scale-115 ring-2 ring-[#D4AF37]'
                                : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            aria-label={l(color.name)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Footage Quantity Counter */}
                  <div className="pt-3 border-t border-[#4B3F35]/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#4B3F35]">
                        {l(t.quantityFootage)}:
                      </span>
                      <span className="text-[11px] text-[#4B3F35]/70">
                        {l(t.moqLabel)}: {formatNumberOnly(modalItem.moq, language)} {l(t.sqftUnit)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      {/* Stepper */}
                      <div className="flex items-center gap-2 bg-[#FAF6F1] rounded-xl border border-[#4B3F35]/20 px-3 py-1.5">
                        <button
                          onClick={() => setModalSqft(Math.max(10, modalSqft - 10))}
                          className="text-[#4B3F35] hover:text-[#231F20] p-1 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-[#231F20] min-w-[60px] text-center">
                          {formatNumberOnly(modalSqft, language)} {l(t.sqftUnit)}
                        </span>
                        <button
                          onClick={() => setModalSqft(modalSqft + 10)}
                          className="text-[#4B3F35] hover:text-[#231F20] p-1 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Calculated Total */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-[#4B3F35]/70 font-semibold block">
                          {l(t.totalAmount)}
                        </span>
                        <span className="font-heading text-xl font-bold text-[#231F20]">
                          {formatPrice(modalSqft * modalItem.priceUSD, modalSqft * modalItem.priceBDT, language, { decimals: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Add to Cart & Custom Service */}
                  <div className="pt-4 flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleModalAddToCart}
                      className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                        modalAdded
                          ? 'bg-emerald-700 text-white'
                          : 'btn-gold text-[#231F20]'
                      }`}
                    >
                      {modalAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{l(t.added)}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-[#231F20]" />
                          <span>{l(t.addToCart)}</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      onClick={handleModalCustomize}
                      className="py-3.5 px-4 rounded-xl text-xs font-semibold bg-[#FAF6F1] hover:bg-[#4B3F35] text-[#4B3F35] hover:text-[#FAF6F1] border border-[#4B3F35]/30 hover:border-[#4B3F35] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{l(t.customize)}</span>
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
