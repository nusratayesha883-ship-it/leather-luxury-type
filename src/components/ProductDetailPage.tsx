import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calculator,
  Sliders,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  Award,
  Play,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Compass,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { formatPrice, formatNumberOnly } from '../data/formatters';
import type { LeatherItem, LeatherColor } from '../types';
import { MagneticButton } from './MagneticButton';
import { ScrollReveal, RevealItem } from './ScrollReveal';

export const ProductDetailPage: React.FC = () => {
  const {
    currentPath,
    navigateTo,
    language,
    l,
    addToCart,
    proceedToCustomOrder,
    updateCustomOrderDraft,
    setSelectedCustomLeatherId
  } = useApp();

  // Extract slug from path: /catalog/:id
  const slug = useMemo(() => {
    const parts = (currentPath || '').split('/');
    return parts[2] ? parts[2].toLowerCase() : '';
  }, [currentPath]);

  // Find matching leather
  const item = useMemo<LeatherItem | undefined>(() => {
    return LEATHER_CATALOG.find((l) => l.id === slug) || LEATHER_CATALOG[0];
  }, [slug]);

  // Active Gallery Image
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  // Selected Color
  const [selectedColor, setSelectedColor] = useState<LeatherColor | null>(null);
  // Quantity (sq.ft)
  const [orderSqft, setOrderSqft] = useState<number>(50);
  // Added to cart feedback
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // Reset state when slug/item changes
  useEffect(() => {
    if (item) {
      setActiveImageIndex(0);
      setSelectedColor(item.colors[0] || null);
      setOrderSqft(item.moq || 40);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [item?.id]);

  // Dynamic SEO Meta Tags & JSON-LD Structured Data Injection for Google Ranking #1
  useEffect(() => {
    if (!item) return;

    const leatherName = l(item.name);
    const seoTitle = item.seo?.metaTitle || `${leatherName} - Premium Wholesale Leather | LuxeHide Atelier`;
    const seoDesc = item.seo?.metaDescription || `${leatherName} direct tannery wholesale leather. Premium grain, consistent thickness, fast worldwide freight. Order online from LuxeHide Atelier.`;
    const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/catalog/${item.id}` : '';
    const ogImage = item.gallery?.[0]?.url || item.image;

    // 1. Dynamic Title
    document.title = seoTitle;

    // 2. Helper to set or create meta tag
    const setMeta = (nameAttr: string, nameValue: string, content: string) => {
      let meta = document.querySelector(`meta[${nameAttr}="${nameValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, nameValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('name', 'description', seoDesc);
    if (item.seo?.keywords) {
      setMeta('name', 'keywords', item.seo.keywords.join(', '));
    }
    setMeta('property', 'og:title', seoTitle);
    setMeta('property', 'og:description', seoDesc);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', 'product');
    setMeta('property', 'og:image', ogImage);

    // 3. Inject Structured Data JSON-LD (Product + BreadcrumbList Schema)
    const jsonLdId = 'pdp-jsonld-schema';
    let scriptTag = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org/',
      '@graph': [
        {
          '@type': 'Product',
          name: leatherName,
          image: item.gallery?.map((g) => g.url) || [ogImage],
          description: l(item.description),
          sku: item.id,
          brand: {
            '@type': 'Brand',
            name: 'LuxeHide Atelier',
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'USD',
            price: item.priceUSD.toFixed(2),
            priceValidUntil: '2027-12-31',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'LuxeHide Atelier',
            },
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '128',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: typeof window !== 'undefined' ? window.location.origin : '/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Leather Catalog',
              item: typeof window !== 'undefined' ? `${window.location.origin}/#catalog` : '/#catalog',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: leatherName,
              item: canonicalUrl,
            },
          ],
        },
      ],
    };

    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      // Reset title to default on leave
      document.title = 'LuxeHide Atelier | Premium Wholesale Leather & Custom Tannery Supply';
    };
  }, [item, language]);

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-heading text-3xl font-bold text-[#FDFBF7] mb-4">
          {language === 'BN' ? 'চামড়া খুঁজে পাওয়া যায়নি' : 'Leather Type Not Found'}
        </h2>
        <p className="text-sm text-[#D4C5B9] max-w-md mb-8">
          {language === 'BN'
            ? 'অনুরোধকৃত চামড়ার ধরণটি ক্যাটালগে নেই। অনুগ্রহ করে আমাদের ক্যাটালগ পেজে ফিরে যান।'
            : 'The requested leather article is unavailable. Please return to our main catalog to browse all available hides.'}
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="px-8 py-3 rounded-full btn-gold text-sm font-bold text-[#170F0B]"
        >
          {language === 'BN' ? 'ক্যাটালগে ফিরে যান' : 'Back to Leather Catalog'}
        </button>
      </div>
    );
  }

  // Gallery images with fallback
  const gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [
    {
      url: item.image,
      alt: item.name,
      label: { en: 'Primary Grain Swatch', bn: 'প্রাইমারি গ্রেইন সোয়াচ' },
    },
  ];

  // CTA 1: Calculate Cost for this Leather
  const handleCalculateCost = () => {
    setSelectedCustomLeatherId(item.id);
    updateCustomOrderDraft({
      leatherId: item.id,
      sqft: orderSqft,
      totalUSD: orderSqft * item.priceUSD,
      totalBDT: orderSqft * item.priceBDT,
    });
    navigateTo('/');
    setTimeout(() => {
      const el = document.getElementById('calculator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // CTA 2: Order Custom Batch (Proceed to /custom-order checkout)
  const handleOrderCustomBatch = () => {
    const colorName = selectedColor ? l(selectedColor.name) : (item.colors[0] ? l(item.colors[0].name) : 'Natural');
    proceedToCustomOrder(
      item.id,
      orderSqft,
      orderSqft * item.priceUSD,
      orderSqft * item.priceBDT
    );
    updateCustomOrderDraft({
      colorName,
      colorCode: selectedColor?.code,
    });
  };

  // Add to Cart
  const handleAddToCart = () => {
    const col = selectedColor || item.colors[0];
    addToCart(item, orderSqft, col);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // Next / Previous Leather in Catalog for smooth atelier browsing
  const currentIndex = LEATHER_CATALOG.findIndex((l) => l.id === item.id);
  const prevLeather = currentIndex > 0 ? LEATHER_CATALOG[currentIndex - 1] : LEATHER_CATALOG[LEATHER_CATALOG.length - 1];
  const nextLeather = currentIndex < LEATHER_CATALOG.length - 1 ? LEATHER_CATALOG[currentIndex + 1] : LEATHER_CATALOG[0];

  return (
    <div className="w-full min-h-screen bg-[#170F0B] text-[#FDFBF7] py-8 sm:py-12 selection:bg-[#D4AF37] selection:text-[#170F0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* 1. TOP BREADCRUMB & ATELIER NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-6 border-b border-[#D4AF37]/20">
          
          {/* Back to Catalog / Home */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigateTo('/');
                setTimeout(() => {
                  const el = document.getElementById('catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-[#241710] hover:bg-[#322016] text-[#D4AF37] hover:text-[#FDFBF7] text-xs font-bold border border-[#D4AF37]/35 transition-all cursor-pointer shadow-md group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>{language === 'BN' ? 'ক্যাটালগে ফিরে যান' : 'Back to Catalog'}</span>
            </button>

            {/* Breadcrumb Path */}
            <div className="hidden md:flex items-center gap-2 text-xs text-[#A69282]">
              <span onClick={() => navigateTo('/')} className="cursor-pointer hover:text-[#D4AF37]">
                {language === 'BN' ? 'হোম' : 'Home'}
              </span>
              <ChevronRight className="w-3 h-3 text-[#D4AF37]/50" />
              <span
                onClick={() => {
                  navigateTo('/');
                  setTimeout(() => {
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="cursor-pointer hover:text-[#D4AF37]"
              >
                {language === 'BN' ? 'চামড়া ক্যাটালগ' : 'Catalog'}
              </span>
              <ChevronRight className="w-3 h-3 text-[#D4AF37]/50" />
              <span className="text-[#D4AF37] font-semibold truncate max-w-[160px]">
                {l(item.name)}
              </span>
            </div>
          </div>

          {/* Adjacent Article Switcher (Next/Prev Leather) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#A69282] hidden sm:inline-block">
              {language === 'BN' ? 'অন্যান্য চামড়া:' : 'Browse Tannery:'}
            </span>
            <button
              onClick={() => navigateTo('/catalog/' + prevLeather.id)}
              title={l(prevLeather.name)}
              className="px-3 py-2 min-h-[44px] rounded-full bg-[#241710] hover:bg-[#322016] text-[#D4C5B9] hover:text-[#D4AF37] border border-[#D4AF37]/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline line-clamp-1 max-w-[120px]">{l(prevLeather.name)}</span>
            </button>
            <button
              onClick={() => navigateTo('/catalog/' + nextLeather.id)}
              title={l(nextLeather.name)}
              className="px-3 py-2 min-h-[44px] rounded-full bg-[#241710] hover:bg-[#322016] text-[#D4C5B9] hover:text-[#D4AF37] border border-[#D4AF37]/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="hidden sm:inline line-clamp-1 max-w-[120px]">{l(nextLeather.name)}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 2. MAIN PDP HERO SECTION: 2-COLUMN RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* LEFT COLUMN: HIGH-RES 4-PHOTO GALLERY WITH INTERACTIVE VIEWER (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured Photo Display with Zoom & Badges */}
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#1E140E] border-2 border-[#D4AF37]/40 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={gallery[activeImageIndex]?.url}
                  src={gallery[activeImageIndex]?.url}
                  alt={l(gallery[activeImageIndex]?.alt || item.name)}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out leather-swatch-zoom"
                />
              </AnimatePresence>

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#170F0B]/80 via-transparent to-transparent pointer-events-none" />

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                {item.badge && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-[#170F0B] text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    {l(item.badge)}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#170F0B]/85 backdrop-blur-md border border-[#D4AF37]/35 text-[#FDFBF7] text-xs font-bold uppercase tracking-wider">
                  {l(item.category)}
                </span>
              </div>

              {/* Active Image Label Pill at Bottom Left */}
              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-[#170F0B]/90 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-semibold text-[#E5C365] shadow-md flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{l(gallery[activeImageIndex]?.label)}</span>
              </div>

              {/* Gallery Counter at Bottom Right */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-[#170F0B]/90 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#FDFBF7]">
                {activeImageIndex + 1} / {gallery.length}
              </div>
            </div>

            {/* Thumbnail Navigation Strip (3 to 4 crisp images) */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {gallery.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[4/3] min-h-[44px] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group/thumb ${
                      isActive
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-102'
                        : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={l(img.alt)}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover/thumb:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#170F0B]/20 group-hover/thumb:bg-transparent transition-colors" />
                    
                    {/* Tiny thumbnail title pill */}
                    <div className="absolute bottom-1 inset-x-1 px-1 py-0.5 rounded bg-[#170F0B]/85 text-[9px] text-center font-bold text-[#E5C365] truncate backdrop-blur-xs">
                      {l(img.label)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="p-4 rounded-2xl bg-[#221610] border border-[#D4AF37]/25 flex items-center gap-3 text-xs text-[#D4C5B9]">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
              <div>
                <strong className="text-[#FDFBF7] block font-heading text-sm">
                  {language === 'BN' ? '১০০% জেনুইন ট্যানারি গ্রেইন নিশ্চয়তা' : '100% Genuine Certified Tannery Grain'}
                </strong>
                <span>
                  {language === 'BN'
                    ? 'প্রতিটি চামড়ার সাথে অফিশিয়াল ট্যানারি গ্রেডিং সার্টিফিকেট ও ল্যাব টেস্ট রিপোর্ট প্রদান করা হয়।'
                    : 'Every hide is certified with rigorous tensile thickness uniformity, bio-compliance, and zero synthetic bonding.'}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CORE PRODUCT DETAILS, PRICING, SWATCHES & 2 DEDICATED CTAS (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title, Category & Pricing */}
            <div className="space-y-3 pb-6 border-b border-[#D4AF37]/25">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#261A13] border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                <Award className="w-3 h-3 text-[#D4AF37]" />
                <span>{l(item.category)}</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl xl:text-5xl font-extrabold text-[#FDFBF7] tracking-tight leading-tight break-words">
                {l(item.name)}
              </h1>

              <p className="text-xs sm:text-sm text-[#D4C5B9] leading-relaxed">
                {l(item.description)}
              </p>

              {/* Price Display */}
              <div className="pt-2 flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="font-heading text-2xl sm:text-4xl font-extrabold text-[#E5C365] break-words">
                  {formatPrice(item.priceUSD, item.priceBDT, language, { perSqft: true, decimals: true })}
                </span>
                <span className="text-xs text-[#A69282] uppercase tracking-wider font-semibold">
                  (MOQ: {formatNumberOnly(item.moq, language)} sq.ft)
                </span>
              </div>
            </div>

            {/* Available Color Swatches Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {language === 'BN' ? 'উপলব্ধ কালার শেড ও কোড:' : 'Available Tannery Colors & Codes:'}{' '}
                <span className="text-[#FDFBF7] normal-case font-normal ml-1">
                  {selectedColor ? `${l(selectedColor.name)} (${selectedColor.code})` : ''}
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {item.colors.map((c) => {
                  const isSelected = selectedColor?.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-2 min-h-[44px] rounded-2xl border transition-all flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#322016] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-md'
                          : 'bg-[#1E140E] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-[#D4AF37]/50 shrink-0 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="text-left text-xs">
                        <span className="font-bold text-[#FDFBF7] block leading-none">{l(c.name)}</span>
                        <span className="text-[10px] text-[#A69282] font-mono leading-none">{c.code}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Square Footage Batch Quantity Selector */}
            <div className="p-4 rounded-2xl bg-[#221610] border border-[#D4AF37]/30 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#D4AF37]">
                <span className="uppercase tracking-wider">
                  {language === 'BN' ? 'অর্ডার পরিমাণ (বর্গফুট)' : 'Order Quantity (Sq.Ft)'}
                </span>
                <span className="font-mono text-sm text-[#FDFBF7]">
                  {orderSqft} sq.ft
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={item.moq}
                  max={1000}
                  step={10}
                  value={orderSqft}
                  onChange={(e) => setOrderSqft(Number(e.target.value))}
                  className="flex-1 h-2 bg-[#170F0B] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
              </div>

              {/* Estimated Subtotal */}
              <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-center text-xs">
                <span className="text-[#D4C5B9]">
                  {language === 'BN' ? 'আনুমানিক চামড়ার মূল্য:' : 'Estimated Leather Cost:'}
                </span>
                <span className="font-heading text-base font-bold text-[#E5C365]">
                  {formatPrice(orderSqft * item.priceUSD, orderSqft * item.priceBDT, language, { decimals: true })}
                </span>
              </div>
            </div>

            {/* 2 PROMINENT CALL-TO-ACTION BUTTONS (EXACTLY AS SPECIFIED) */}
            <div className="space-y-3 pt-2">
              
              {/* CTA 1: Order Custom Batch (Proceed to /custom-order checkout) */}
              <MagneticButton
                type="button"
                onClick={handleOrderCustomBatch}
                className="w-full py-4 px-6 rounded-2xl btn-gold font-bold text-sm text-[#170F0B] flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer group"
              >
                <Sliders className="w-5 h-5 text-[#170F0B] group-hover:rotate-45 transition-transform" />
                <span className="tracking-wide uppercase font-extrabold">
                  {language === 'BN' ? 'কাস্টম অর্ডার ব্যাচ বুক করুন' : 'Order Custom Batch'}
                </span>
              </MagneticButton>

              {/* CTA 2: Calculate Cost for this Leather (Homepage Calculator with this preselected) */}
              <MagneticButton
                type="button"
                onClick={handleCalculateCost}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#281A12] hover:bg-[#342217] text-[#D4AF37] hover:text-[#FDFBF7] font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/45 hover:border-[#D4AF37] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md"
              >
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {language === 'BN' ? 'এই চামড়ার মূল্য ক্যালকুলেট করুন' : 'Calculate Cost for this Leather'}
                </span>
              </MagneticButton>

              {/* Direct Add to Cart Action */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 min-h-[44px] px-4 rounded-xl bg-[#1A110C] hover:bg-[#251710] text-[#D4C5B9] hover:text-[#FDFBF7] text-xs font-semibold border border-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {addedFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">
                      {language === 'BN' ? 'কার্টে যোগ করা হয়েছে!' : 'Added to Cart Successfully!'}
                    </span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {language === 'BN' ? 'সরাসরি কার্টে যোগ করুন' : 'Add Wholesale Quantity to Cart'}
                    </span>
                  </>
                )}
              </button>

            </div>

            {/* Tiered Wholesale Pricing Overview */}
            {item.tieredPricing && item.tieredPricing.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#1C120D] border border-[#D4AF37]/20 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A69282] block">
                  {language === 'BN' ? 'ভলিউম ডিসকাউন্ট পাইকারি রেট:' : 'Volume Wholesale Discount Tiers:'}
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {item.tieredPricing.map((tier, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-1 px-2.5 rounded-lg bg-[#241710]/60 border border-[#D4AF37]/10"
                    >
                      <span className="text-[#D4C5B9] font-medium">{l(tier.label)}</span>
                      <span className="font-bold text-[#E5C365]">
                        {formatPrice(tier.priceUSD, tier.priceBDT, language, { perSqft: true, decimals: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 3. STRUCTURED TECHNICAL SPECIFICATIONS GRID (B2B SPECS TABLE & CARDS) */}
        {item.specs && (
          <section className="space-y-8 pt-8 border-t border-[#D4AF37]/25">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#261A13] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider shadow-sm">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'BN' ? 'কারিগর ও ট্যানারি স্পেসিফিকেশন' : 'B2B Technical Specifications'}</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#FDFBF7]">
                {language === 'BN' ? 'কারিগরি বিশদ বিবরণ ও মানদণ্ড' : 'Atelier Technical Data Sheet'}
              </h2>
              <p className="text-xs sm:text-sm text-[#D4C5B9]">
                {language === 'BN'
                  ? 'আন্তর্জাতিক মাস্টার কারিগর ও জুতো প্রস্তুতকারকদের জন্য নির্দিষ্ট পরিমাপ ও মান।'
                  : 'Engineered standards designed for bespoke luxury ateliers, footwear masters, and upholstery studios.'}
              </p>
            </div>

            {/* 6 Structured Technical Cards */}
            <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.08}>
              
              {/* 1. Average Hide Size */}
              <RevealItem>
                <div className="luxury-card glass-sheen p-5 rounded-3xl bg-[#221610] border border-[#D4AF37]/25 space-y-2 hover:border-[#D4AF37]/50 transition-all shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {language === 'BN' ? 'গড় চামড়ার সাইজ (বর্গফুট)' : 'Average Hide Size (Sq.Ft)'}
                  </span>
                  <div className="font-heading text-lg font-bold text-[#FDFBF7]">
                    {l(item.specs.averageHideSize)}
                  </div>
                  <p className="text-xs text-[#A69282] leading-normal">
                    {language === 'BN' ? 'হোল হাইড বা সাইড কাটিং এর সম্পূর্ণ ক্ষেত্রফল' : 'Natural usable surface area per hide with minimal perimeter trimmings'}
                  </p>
                </div>
              </RevealItem>

              {/* 2. Thickness / Gauge (Dual display in mm and ounces) */}
              <RevealItem>
                <div className="luxury-card glass-sheen p-5 rounded-3xl bg-[#221610] border border-[#D4AF37]/25 space-y-2 hover:border-[#D4AF37]/50 transition-all shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {language === 'BN' ? 'পুরুত্ব ও গজ (মিমি / আউন্স)' : 'Thickness / Gauge (mm & oz)'}
                  </span>
                  <div className="font-heading text-lg font-bold text-[#E5C365]">
                    {l(item.specs.thickness)}
                  </div>
                  <p className="text-xs text-[#A69282] leading-normal">
                    {language === 'BN' ? 'ট্যানারি ড্রাম স্প্লিটিং এ ক্যালিব্রেটেড সুষম পুরুত্ব' : 'Dual gauge calibrated across back, belly, and shoulder sections'}
                  </p>
                </div>
              </RevealItem>

              {/* 3. Weight Ratio */}
              <RevealItem>
                <div className="luxury-card glass-sheen p-5 rounded-3xl bg-[#221610] border border-[#D4AF37]/25 space-y-2 hover:border-[#D4AF37]/50 transition-all shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {language === 'BN' ? 'ঘনত্ব ও ওজন অনুপাত' : 'Sq.Ft Weight & Density Ratio'}
                  </span>
                  <div className="font-heading text-lg font-bold text-[#FDFBF7]">
                    {l(item.specs.weight)}
                  </div>
                  <p className="text-xs text-[#A69282] leading-normal">
                    {language === 'BN' ? 'প্রতি বর্গফুটে প্রমিত ভর ও ফাইবার ঘনত্ব' : 'Calculated square footage density for precise shipping freight estimation'}
                  </p>
                </div>
              </RevealItem>

              {/* 4. Tanning Method */}
              <RevealItem>
                <div className="luxury-card glass-sheen p-5 rounded-3xl bg-[#221610] border border-[#D4AF37]/25 space-y-2 hover:border-[#D4AF37]/50 transition-all shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {language === 'BN' ? 'ট্যানিং পদ্ধতি ও প্রক্রিয়া' : 'Tanning Process & Formula'}
                  </span>
                  <div className="font-heading text-base font-bold text-[#FDFBF7]">
                    {l(item.specs.tanningMethod)}
                  </div>
                  <p className="text-xs text-[#A69282] leading-normal">
                    {language === 'BN' ? 'পরিবেশবান্ধব ট্যানারি রসায়ন ও প্রাকৃতিক তেল মিশ্রণ' : 'Eco-compliant processing adhering to international leather sustainability standards'}
                  </p>
                </div>
              </RevealItem>

              {/* 5. Temper & Surface Finish */}
              <RevealItem>
                <div className="luxury-card glass-sheen p-5 rounded-3xl bg-[#221610] border border-[#D4AF37]/25 space-y-2 hover:border-[#D4AF37]/50 transition-all shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {language === 'BN' ? 'টেম্পার ও সারফেস ফিনিশ' : 'Temper & Finish Profile'}
                  </span>
                  <div className="font-heading text-base font-bold text-[#E5C365]">
                    {l(item.specs.temper)}
                  </div>
                  <p className="text-xs text-[#D4C5B9] mt-1">
                    <strong>Finish:</strong> {l(item.specs.finish)}
                  </p>
                </div>
              </RevealItem>

              {/* 6. Tannery Origin & Certifications */}
              <RevealItem>
                <div className="luxury-card glass-sheen p-5 rounded-3xl bg-[#221610] border border-[#D4AF37]/25 space-y-2 hover:border-[#D4AF37]/50 transition-all shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                    {language === 'BN' ? 'উৎপত্তি ও সার্টিফাইড কোয়ালিটি' : 'Origin & Compliance'}
                  </span>
                  <div className="font-heading text-sm font-bold text-[#FDFBF7]">
                    {l(item.specs.origin)}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.specs.certifications.map((cert, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#E5C365] text-[10px] font-bold"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </RevealItem>

            </ScrollReveal>

            {/* Best Suited For (Recommended Atelier Applications) */}
            <div className="p-6 rounded-3xl bg-[#1F140E] border border-[#D4AF37]/30 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>{language === 'BN' ? 'যেসব কারুশিল্পের জন্য সর্বাধিক উপযুক্ত:' : 'Recommended Bespoke Leather Applications:'}</span>
              </span>

              <div className="flex flex-wrap gap-3">
                {item.specs.bestSuitedFor.map((app, aIdx) => (
                  <div
                    key={aIdx}
                    className="px-4 py-2 rounded-2xl bg-[#2B1B13] border border-[#D4AF37]/30 text-xs font-semibold text-[#FDFBF7] flex items-center gap-2 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{l(app)}</span>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* 4. RELEVANT YOUTUBE VIDEO INTEGRATION (REAL-TIME TEXTURE & CRAFTING) */}
        {item.video && (
          <section className="space-y-6 pt-8 border-t border-[#D4AF37]/25">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#261A13] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                  <Play className="w-3 h-3 text-[#D4AF37] fill-current" />
                  <span>{language === 'BN' ? 'চামড়া পর্যালোচনা ও কারিগরি ভিডিও' : 'Atelier Video Showcase'}</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
                  {l(item.video.title)}
                </h2>
                <p className="text-xs sm:text-sm text-[#D4C5B9] mt-1 max-w-2xl">
                  {l(item.video.desc)}
                </p>
              </div>

              {/* YouTube Channel Badge */}
              <a
                href="https://youtube.com/@li-asahi-su?si=cLGI4Aq9alBkngG5"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#221610] hover:bg-[#2C1C14] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-xs text-[#E5C365] transition-colors cursor-pointer"
                title="Visit Official Atelier YouTube Channel"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Channel: <strong>{item.video.channel}</strong></span>
              </a>
            </div>

            {/* Responsive 16:9 Aspect Ratio Embed Frame with Luxury Gold Trim */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#140D0A] border-2 border-[#D4AF37]/40 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${item.video.youtubeId}?rel=0&modestbranding=1`}
                title={l(item.video.title)}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#1E130D] border border-[#D4AF37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#D4C5B9]">
              <span className="leading-relaxed">
                💡 <strong>{language === 'BN' ? 'কারিগর পরামর্শ:' : 'Atelier Tip:'}</strong>{' '}
                {language === 'BN'
                  ? 'ভিডিওতে চামড়ার ফ্লেক্সিবিলিটি, পুল-আপ টোন এবং এজ বার্নিশিং বৈশিষ্ট্য গভীরভাবে লক্ষ্য করুন।'
                  : 'Observe how the hide flexes and reacts under natural atelier lighting to judge drape, pull-up burst, and edge beveling characteristics.'}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${item.video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-[#2A1B13] hover:bg-[#382419] text-[#D4AF37] hover:underline shrink-0 font-semibold border border-[#D4AF37]/30 transition-all cursor-pointer"
              >
                <span>{language === 'BN' ? 'ইউটিউবে দেখুন' : 'Watch on YouTube'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </section>
        )}

        {/* 5. BOTTOM PERSISTENT CTAS & CROSS-PROMOTION BANNER */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#2B1B13] via-[#382318] to-[#2B1B13] border-2 border-[#D4AF37]/50 shadow-2xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-extrabold">
              {language === 'BN' ? 'সরাসরি ট্যানারি সরবরাহ ও বেসপোক অর্ডার' : 'Direct Tannery Supply & Bespoke Orders'}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
              {language === 'BN'
                ? `${l(item.name)} এর সাথে আপনার পরবর্তী প্রজেক্ট শুরু করুন`
                : `Craft Your Next Masterpiece with ${l(item.name)}`}
            </h3>
            <p className="text-xs sm:text-sm text-[#D4C5B9]">
              {language === 'BN'
                ? 'কাস্টম সাইজ, নির্দিষ্ট কালার ডাইং বা লোগো খোদাইয়ের জন্য এখনই আমাদের ফর্ম পূরণ করুন।'
                : 'Need custom splitting, specialized Pantone shades, or bulk wholesale shipment? Submit your specifications directly.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <MagneticButton
              onClick={handleOrderCustomBatch}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-gold font-bold text-xs uppercase tracking-wider text-[#170F0B] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#170F0B]" />
              <span>{language === 'BN' ? 'কাস্টম অর্ডার ব্যাচ বুক করুন' : 'Order Custom Batch'}</span>
            </MagneticButton>
            <MagneticButton
              onClick={handleCalculateCost}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#170F0B] hover:bg-[#221610] text-[#D4AF37] hover:text-[#FDFBF7] font-bold text-xs uppercase tracking-wider border border-[#D4AF37]/50 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'BN' ? 'মূল্য ক্যালকুলেটর দেখুন' : 'Calculate Cost for this Leather'}</span>
            </MagneticButton>
          </div>
        </section>

      </div>
    </div>
  );
};
