import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  MapPin,
  Phone,
  User,
  Mail,
  Building,
  Check,
  ChevronRight,
  Globe,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { formatPrice, formatNumberOnly } from '../data/formatters';
import type { DeliveryDestination, PaymentMethodType, LeatherItem } from '../types';

export const CustomOrderPage: React.FC = () => {
  const { language, l, currentPath, navigateTo, customOrderDraft, updateCustomOrderDraft } = useApp();

  // Scroll to top when loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPath]);

  // Selected Leather State (Pre-filled from Calculator Draft)
  const [selectedLeatherId, setSelectedLeatherId] = useState<string>(
    customOrderDraft.leatherId || 'full-grain-cowhide'
  );
  const [sqft, setSqft] = useState<number>(customOrderDraft.sqft || 50);

  const selectedLeather = useMemo<LeatherItem>(() => {
    return LEATHER_CATALOG.find((item) => item.id === selectedLeatherId) || LEATHER_CATALOG[0];
  }, [selectedLeatherId]);

  // Handle Leather selection change with two-way sync
  const handleLeatherChange = (newLeatherId: string) => {
    setSelectedLeatherId(newLeatherId);
    const found = LEATHER_CATALOG.find((item) => item.id === newLeatherId);
    if (found) {
      if (sqft < found.moq) {
        setSqft(found.moq);
      }
      if (found.colors[0]) {
        setSelectedColorName(l(found.colors[0].name));
      }
      updateCustomOrderDraft({
        leatherId: newLeatherId,
        sqft: Math.max(sqft, found.moq),
        totalUSD: Math.max(sqft, found.moq) * found.priceUSD,
        totalBDT: Math.max(sqft, found.moq) * found.priceBDT,
      });
    }
  };

  // Handle SqFt quantity change with two-way sync
  const handleSqftChange = (newSqft: number) => {
    const val = Math.max(1, newSqft);
    setSqft(val);
    updateCustomOrderDraft({
      sqft: val,
      totalUSD: val * selectedLeather.priceUSD,
      totalBDT: val * selectedLeather.priceBDT,
    });
  };

  // Customization Options State
  const [selectedColorName, setSelectedColorName] = useState<string>(
    customOrderDraft.colorName || (selectedLeather.colors[0]?.name ? l(selectedLeather.colors[0].name) : 'Natural')
  );
  const [customPantone, setCustomPantone] = useState<string>('');
  const [customLogoText, setCustomLogoText] = useState<string>(customOrderDraft.debossingText || '');
  const [foilOption, setFoilOption] = useState<string>(customOrderDraft.foilOption || 'blind');
  const [thicknessOption, setThicknessOption] = useState<string>(
    customOrderDraft.thickness || 'standard'
  );
  const [specialNotes, setSpecialNotes] = useState<string>(customOrderDraft.notes || '');

  // Shipping Information State
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('Bangladesh');

  // Delivery Destination (Inside Country vs Outside Country)
  const [deliveryDestination, setDeliveryDestination] = useState<DeliveryDestination>('domestic');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bkash');
  const [paymentNote, setPaymentNote] = useState<string>('');

  // UI Validation & Success Modal State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  // Sync country default when destination changes
  const handleDestinationChange = (dest: DeliveryDestination) => {
    setDeliveryDestination(dest);
    if (dest === 'domestic') {
      setCountry('Bangladesh');
    } else if (country === 'Bangladesh') {
      setCountry('');
    }
  };

  // Base calculations
  const unitPriceUSD = selectedLeather.priceUSD;
  const unitPriceBDT = selectedLeather.priceBDT;
  const leatherTotalUSD = sqft * unitPriceUSD;
  const leatherTotalBDT = sqft * unitPriceBDT;

  // DYNAMIC WEIGHT / SQ.FT BASED DELIVERY FEE CALCULATION:
  // Inside Country (Bangladesh): Base ৳100 + ৳10 per sq.ft (Minimum ৳150)
  // Outside Country (International Air Freight): Base $20.00 + $1.50 per sq.ft (Minimum $35.00)
  const deliveryFeeBDT = deliveryDestination === 'domestic'
    ? Math.max(150, 100 + sqft * 10)
    : Math.max(4200, 2400 + sqft * 180);

  const deliveryFeeUSD = deliveryDestination === 'domestic'
    ? Math.max(1.25, 0.83 + sqft * 0.083)
    : Math.max(35.00, 20.00 + sqft * 1.50);

  // Grand Totals: Base Leather Price + Customization Fee (৳0 / $0 Complimentary) + Dynamic Delivery Charge
  const grandTotalUSD = leatherTotalUSD + deliveryFeeUSD;
  const grandTotalBDT = leatherTotalBDT + deliveryFeeBDT;

  // Handle Order Submit & Auto WhatsApp Generation
  const handleSendOrder = () => {
    // Form Validation
    if (!fullName.trim()) {
      setValidationError(language === 'BN' ? 'অনুগ্রহ করে আপনার পুরো নাম প্রদান করুন।' : 'Please enter your Full Name.');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError(language === 'BN' ? 'অনুগ্রহ করে আপনার ফোন / হোয়াটসঅ্যাপ নম্বর প্রদান করুন।' : 'Please enter your Phone or WhatsApp Number.');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    if (!streetAddress.trim() || !city.trim()) {
      setValidationError(language === 'BN' ? 'অনুগ্রহ করে পূর্ণ ডেলিভারি ঠিকানা ও শহরের নাম লিখুন।' : 'Please enter your complete Street Address and City.');
      window.scrollTo({ top: 600, behavior: 'smooth' });
      return;
    }
    setValidationError(null);

    const orderId = `LH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const effectiveColor = customPantone.trim()
      ? `${selectedColorName} (${customPantone.trim()})`
      : selectedColorName;

    const foilLabel = 
      foilOption === 'gold' ? '24k Gold Foil Stamping' :
      foilOption === 'silver' ? 'Silver Foil Stamping' :
      foilOption === 'blind' ? 'Blind Debossing (Deep Relief)' : 'Raw / None';

    const thicknessLabel =
      thicknessOption === 'standard' ? 'Standard 1.4 - 1.6 mm (3.5 - 4.0 oz)' :
      thicknessOption === 'lining' ? 'Garment & Lining 0.8 - 1.0 mm (2.0 - 2.5 oz)' :
      thicknessOption === 'heavy' ? 'Heavy Belt & Saddlery 2.0 - 2.4 mm (5.0 - 6.0 oz)' : 'Custom Tannery Splitting';

    const destinationLabel = deliveryDestination === 'domestic' 
      ? 'Inside Country (Bangladesh Domestic Express)' 
      : 'Outside Country (International Priority Air Freight)';

    const dynamicRateNote = deliveryDestination === 'domestic'
      ? `৳${deliveryFeeBDT.toLocaleString()} (Rate: ৳10 / sq.ft)`
      : `$${deliveryFeeUSD.toFixed(2)} USD (Rate: $1.50 / sq.ft Air Cargo)`;

    const paymentLabel = 
      paymentMethod === 'bkash' ? 'bKash (01905206450)' :
      paymentMethod === 'nagad' ? 'Nagad (01905206450)' :
      paymentMethod === 'bank' ? 'Bank Wire Transfer' : 'Card / Online Invoice';

    // Build the structured WhatsApp message with transparent itemized cost breakdown
    const message = 
      `🏛️ *LUXEHIDE ATELIER — BESPOKE ORDER SUBMISSION*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *ORDER DETAILS:*\n` +
      `• Order Ref: *${orderId}*\n` +
      `• Leather Hide: *${l(selectedLeather.name)}*\n` +
      `• Quantity: *${sqft} sq.ft*\n` +
      `• Base Rate: *${formatPrice(unitPriceUSD, unitPriceBDT, language, { perSqft: true, decimals: true })}*\n` +
      `• Base Leather Total: *${formatPrice(leatherTotalUSD, leatherTotalBDT, language, { decimals: true })}*\n\n` +
      `🎨 *CUSTOM SPECIFICATIONS:*\n` +
      `• Color Shade: *${effectiveColor}*\n` +
      `• Logo / Debossing: *${customLogoText.trim() ? `"${customLogoText.trim()}"` : 'None / Raw'}* (${foilLabel})\n` +
      `• Thickness / Grade: *${thicknessLabel}*\n` +
      `• Customization Fee: *Complimentary ($0 / ৳0)*\n` +
      (specialNotes.trim() ? `• Atelier Notes: *${specialNotes.trim()}*\n\n` : `\n`) +
      `📍 *SHIPPING & DESTINATION:*\n` +
      `• Recipient: *${fullName}*\n` +
      `• Phone / WhatsApp: *${phoneNumber}*\n` +
      (emailAddress.trim() ? `• Email: *${emailAddress.trim()}*\n` : '') +
      (companyName.trim() ? `• Company: *${companyName.trim()}*\n` : '') +
      `• Delivery Zone: *${destinationLabel}*\n` +
      `• Full Address: *${streetAddress}, ${city} ${postalCode}, ${country}*\n` +
      `• Dynamic Delivery Charge: *${dynamicRateNote}*\n\n` +
      `💳 *PAYMENT METHOD:*\n` +
      `• Channel: *${paymentLabel}*\n` +
      `• TrxID / Note: *${paymentNote.trim() || 'Pending Invoice / PI'}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *ITEMIZED COST BREAKDOWN:*\n` +
      `• Base Leather: ${formatPrice(leatherTotalUSD, leatherTotalBDT, language, { decimals: true })}\n` +
      `• Customization: Complimentary ($0 / ৳0)\n` +
      `• Delivery Charge: ${dynamicRateNote}\n` +
      `• *GRAND TOTAL:* ${deliveryDestination === 'domestic' ? `৳${grandTotalBDT.toLocaleString()} ($${grandTotalUSD.toFixed(2)} USD)` : `$${grandTotalUSD.toFixed(2)} USD (৳${grandTotalBDT.toLocaleString()} BDT)`}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Submitted directly via LuxeHide Atelier Web Application_`;

    // Save submitted order for instant receipt display
    setSubmittedOrder({
      orderId,
      fullName,
      phoneNumber,
      leatherName: l(selectedLeather.name),
      sqft,
      destinationLabel,
      dynamicDeliveryFeeFormatted: deliveryDestination === 'domestic' ? `৳${deliveryFeeBDT.toLocaleString()} (৳10 / sq.ft)` : `$${deliveryFeeUSD.toFixed(2)} ($1.50 / sq.ft)`,
      grandTotalFormatted: deliveryDestination === 'domestic' ? `৳${grandTotalBDT.toLocaleString()}` : `$${grandTotalUSD.toFixed(2)}`,
      grandTotalSecondary: deliveryDestination === 'domestic' ? `$${grandTotalUSD.toFixed(2)} USD` : `৳${grandTotalBDT.toLocaleString()} BDT`,
    });

    // Auto open WhatsApp with the structured message
    const whatsappUrl = `https://wa.me/8801905206450?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-h-screen bg-[#170F0B] text-[#FDFBF7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#241710] hover:bg-[#322016] text-[#D4AF37] hover:text-[#FDFBF7] text-xs font-bold border border-[#D4AF37]/35 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'BN' ? 'হোম পেজে ফিরে যান' : 'Back to Home / Atelier'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#A69282]">
            <span onClick={() => navigateTo('/')} className="cursor-pointer hover:text-[#D4AF37]">
              {language === 'BN' ? 'হোম' : 'Home'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/60" />
            <span className="text-[#D4AF37] font-semibold">
              {language === 'BN' ? 'কাস্টম অর্ডার চেকআউট' : 'Custom Order Checkout'}
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#261A13] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'BN' ? 'বেসপোক ট্যানারি অর্ডার সিস্টেম' : 'Bespoke Tannery Checkout'}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FDFBF7] tracking-tight">
            {language === 'BN' ? 'কাস্টম লেদার অর্ডার ও চেকআউট' : 'Bespoke Leather Order & Checkout'}
          </h1>
          <p className="text-sm sm:text-base text-[#D4C5B9] mt-3 font-normal max-w-2xl mx-auto leading-relaxed">
            {language === 'BN'
              ? 'চামড়ার ধরণ, পরিমাণ, নির্দিষ্ট কালার শেড, লোগো এমবসিং ও শিপিং তথ্য নির্বাচন করুন। ডানপাশের সামারির সাথে তাৎক্ষণিক সমন্বয় হবে।'
              : 'Select leather hide, footage, custom finishes, and delivery country with instant real-time two-way syncing and transparent cost breakdown.'}
          </p>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-sm flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: 4 Form Boxes with Two-Way Sync (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* BOX 1: Leather Type, Sq.Ft Quantity & Customization Options */}
            <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                    {language === 'BN' ? 'চামড়ার ধরণ, পরিমাণ ও কাস্টমাইজেশন' : 'Leather Hide & Customization Specs'}
                  </h3>
                  <p className="text-xs text-[#D4C5B9]">
                    {language === 'BN' ? 'চামড়া নির্বাচন, স্কয়ার ফিট পরিমাণ ও ফিনিশিং নির্ধারণ করুন' : 'Select hide, square footage, shade, and debossing'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* 1.1 Leather Type Selector (Two-Way Synced) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                    {language === 'BN' ? '১. চামড়ার ধরণ নির্বাচন করুন *' : '1. Select Leather Hide *'}
                  </label>
                  <select
                    value={selectedLeatherId}
                    onChange={(e) => handleLeatherChange(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#18100C] border border-[#D4AF37]/30 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] font-semibold cursor-pointer transition-all shadow-inner"
                  >
                    {LEATHER_CATALOG.map((item) => (
                      <option key={item.id} value={item.id} className="bg-[#18100C]">
                        {l(item.name)} — {formatPrice(item.priceUSD, item.priceBDT, language, { perSqft: true, decimals: true })} (MOQ: {item.moq} sq.ft)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 1.2 Required Sq.Ft Stepper & Slider (Two-Way Synced) */}
                <div className="p-4 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/25 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-[#D4AF37]">
                    <span className="uppercase tracking-wider">
                      {language === 'BN' ? '২. প্রয়োজনীয় চামড়ার পরিমাণ (বর্গফুট) *' : '2. Required Leather Area (Sq.Ft) *'}
                    </span>
                    <span className="text-[11px] text-[#A69282] font-normal">
                      {language === 'BN' ? 'ন্যূনতম' : 'MOQ'}: {formatNumberOnly(selectedLeather.moq, language)} sq.ft
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#241710] rounded-xl border border-[#D4AF37]/40 px-3 py-1.5 shrink-0 shadow-inner">
                      <button
                        type="button"
                        onClick={() => handleSqftChange(Math.max(selectedLeather.moq, sqft - 10))}
                        className="p-1 text-[#D4C5B9] hover:text-[#D4AF37] cursor-pointer"
                        title="Decrease by 10 sq.ft"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={sqft}
                        onChange={(e) => handleSqftChange(Number(e.target.value))}
                        className="w-16 text-center font-bold text-sm bg-transparent text-[#FDFBF7] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSqftChange(sqft + 10)}
                        className="p-1 text-[#D4C5B9] hover:text-[#D4AF37] cursor-pointer"
                        title="Increase by 10 sq.ft"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <input
                        type="range"
                        min={selectedLeather.moq}
                        max="400"
                        step="5"
                        value={sqft}
                        onChange={(e) => handleSqftChange(Number(e.target.value))}
                        className="w-full accent-[#D4AF37] cursor-pointer h-2.5 bg-[#241710] rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-[#8D7768] mt-1 font-mono">
                        <span>{selectedLeather.moq} sq.ft</span>
                        <span>200 sq.ft</span>
                        <span>400+ sq.ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.3 Color Shade Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2.5">
                    {language === 'BN' ? '৩. কালার শেড নির্বাচন করুন' : '3. Select Color Shade'}
                  </label>
                  <div className="flex flex-wrap gap-2.5 mb-3">
                    {selectedLeather.colors.map((c) => {
                      const isSelected = selectedColorName === l(c.name);
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedColorName(l(c.name));
                            setCustomPantone('');
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#3A271C] text-[#FDFBF7] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                              : 'bg-[#18100C] text-[#D4C5B9] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{l(c.name)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Or Custom Pantone Input */}
                  <input
                    type="text"
                    value={customPantone}
                    onChange={(e) => setCustomPantone(e.target.value)}
                    placeholder={language === 'BN' ? 'অথবা কাস্টম প্যানটোন কোড লিখুন (যেমন: Pantone 19-1217 TCX)' : 'Or specify bespoke Pantone / Hex (e.g. Pantone 19-1217 TCX)'}
                    className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768] transition-all"
                  />
                </div>

                {/* 1.4 Custom Logo / Debossing Text & Foil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? '৪. লোগো / ডিবসিং টেক্সট' : '4. Custom Logo / Debossing Text'}
                    </label>
                    <input
                      type="text"
                      value={customLogoText}
                      onChange={(e) => setCustomLogoText(e.target.value)}
                      placeholder={language === 'BN' ? 'যেমন: Atelier Verona 2026' : 'e.g. Atelier Verona 2026'}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? '৫. ফয়েল স্ট্যাম্পিং শৈলী' : '5. Foil Stamping Finish'}
                    </label>
                    <select
                      value={foilOption}
                      onChange={(e) => setFoilOption(e.target.value)}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] font-semibold cursor-pointer transition-all"
                    >
                      <option value="blind" className="bg-[#18100C]">Blind Deboss (Deep Impression)</option>
                      <option value="gold" className="bg-[#18100C]">24k Gold Foil Hot-Stamp</option>
                      <option value="silver" className="bg-[#18100C]">Silver Foil Hot-Stamp</option>
                      <option value="none" className="bg-[#18100C]">Raw / No Stamping</option>
                    </select>
                  </div>
                </div>

                {/* 1.5 Thickness & Special Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? '৬. চামড়ার পুরুত্ব ও টেম্পার' : '6. Leather Thickness & Temper'}
                    </label>
                    <select
                      value={thicknessOption}
                      onChange={(e) => setThicknessOption(e.target.value)}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] font-semibold cursor-pointer transition-all"
                    >
                      <option value="standard" className="bg-[#18100C]">Standard 1.4 - 1.6 mm (Bespoke Goods)</option>
                      <option value="lining" className="bg-[#18100C]">Garment & Lining 0.8 - 1.0 mm (Ultra Supple)</option>
                      <option value="heavy" className="bg-[#18100C]">Heavy Belts & Saddlery 2.0 - 2.4 mm (Rigid)</option>
                      <option value="custom" className="bg-[#18100C]">Custom Mill Splitting (Specified Below)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? '৭. বিশেষ ট্যানারি নোট' : '7. Special Tannery Instructions'}
                    </label>
                    <input
                      type="text"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder={language === 'BN' ? 'যেমন: এজ বার্নিশ উপযোগী, নরম টেম্পার' : 'e.g. Edge burnishable, extra oil pull-up'}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768] transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* BOX 2: Complete Shipping Details Card */}
            <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                    {language === 'BN' ? 'ডেলিভারি ও প্রাপকের পূর্ণ তথ্য' : 'Complete Shipping Details'}
                  </h3>
                  <p className="text-xs text-[#D4C5B9]">
                    {language === 'BN' ? 'পণ্য পাঠানোর জন্য গ্রাহকের যোগাযোগ ও পূর্ণ ঠিকানা দিন' : 'Enter recipient contact and physical address'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Full Name & Phone Number (Required) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'পুরো নাম *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={language === 'BN' ? 'আপনার পূর্ণ নাম' : 'e.g. Tanvir Ahmed'}
                        className="w-full bg-[#18100C] text-xs text-[#FDFBF7] pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'ফোন / হোয়াটসঅ্যাপ নম্বর *' : 'Phone / WhatsApp Number *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={language === 'BN' ? '+880 1XXX-XXXXXX' : '+880 1XXX-XXXXXX / +1 ...'}
                        className="w-full bg-[#18100C] text-xs text-[#FDFBF7] pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="atelier@craftstudio.com"
                        className="w-full bg-[#18100C] text-xs text-[#FDFBF7] pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'প্রতিষ্ঠান / স্টুডিওর নাম' : 'Company / Atelier Name'}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={language === 'BN' ? 'ঐচ্ছিক' : 'Optional'}
                        className="w-full bg-[#18100C] text-xs text-[#FDFBF7] pl-10 pr-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                      />
                    </div>
                  </div>
                </div>

                {/* Full Street Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                    {language === 'BN' ? 'পূর্ণ সড়ক ঠিকানা / ডেলিভারি পয়েন্ট *' : 'Street Address / Delivery Point *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      required
                      rows={2}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder={language === 'BN' ? 'বাড়ি নং, রোড নং, এরিয়া বা এলাকা' : 'House / Suite number, Street name, District'}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] pl-10 pr-4 py-2.5 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768] resize-none"
                    />
                  </div>
                </div>

                {/* City, Postal Code & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'শহর *' : 'City *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={language === 'BN' ? 'যেমন: ঢাকা / চট্টগ্রাম' : 'e.g. Dhaka, London, Milan'}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'পোস্টাল / জিপ কোড *' : 'Postal / Zip Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1205"
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'দেশ' : 'Country'}
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={deliveryDestination === 'domestic' ? 'Bangladesh' : 'e.g. United Kingdom, USA'}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* BOX 3: Delivery Destination & Dynamic Weight/Sq.Ft Rate Selection Card */}
            <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                    {language === 'BN' ? 'ডেলিভারি গন্তব্য ও ওজনভিত্তিক ডায়নামিক চার্জ' : 'Dynamic Weight / Sq.Ft Delivery Fee'}
                  </h3>
                  <p className="text-xs text-[#D4C5B9]">
                    {language === 'BN' ? 'স্কয়ার ফিট ওজনের ওপর ভিত্তি করে ডেলিভারি চার্জ হিসাব করা হয়' : 'Delivery fee automatically scales with ordered square footage'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Inside Country Option (Displayed in BDT) */}
                <div
                  onClick={() => handleDestinationChange('domestic')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    deliveryDestination === 'domestic'
                      ? 'bg-[#2E1E15] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg'
                      : 'bg-[#18100C] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold text-sm text-[#FDFBF7]">
                        {language === 'BN' ? 'দেশের ভেতরে (বাংলাদেশ)' : 'Inside Country (Bangladesh)'}
                      </span>
                    </div>
                    {/* Explicitly displayed in BDT */}
                    <span className="font-bold text-sm text-[#E5C365]">
                      ৳{deliveryFeeBDT.toLocaleString()}
                    </span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#E5C365] text-[11px] font-mono font-bold mb-1.5">
                    ৳10 / sq.ft (Express Cargo)
                  </div>
                  <p className="text-xs text-[#D4C5B9] leading-relaxed">
                    {language === 'BN' ? 'বেস ফি ৳১০০ + প্রতি বর্গফুটে ৳১০ (২-৩ কার্যদিবসে হোম ডেলিভারি)' : 'Base ৳100 + ৳10 per sq.ft weight rate (2-3 business days doorstep)'}
                  </p>
                  {deliveryDestination === 'domestic' && (
                    <span className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      {language === 'BN' ? 'সক্রিয় ডেলিভারি মাধ্যম' : 'Active Delivery Zone'}
                    </span>
                  )}
                </div>

                {/* Outside Country Option (Displayed in USD) */}
                <div
                  onClick={() => handleDestinationChange('international')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    deliveryDestination === 'international'
                      ? 'bg-[#2E1E15] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg'
                      : 'bg-[#18100C] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold text-sm text-[#FDFBF7]">
                        {language === 'BN' ? 'দেশের বাইরে (আন্তর্জাতিক)' : 'Outside Country (International)'}
                      </span>
                    </div>
                    {/* Explicitly displayed in USD */}
                    <span className="font-bold text-sm text-[#E5C365]">
                      ${deliveryFeeUSD.toFixed(2)} USD
                    </span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#E5C365] text-[11px] font-mono font-bold mb-1.5">
                    $1.50 / sq.ft (Air Freight)
                  </div>
                  <p className="text-xs text-[#D4C5B9] leading-relaxed">
                    {language === 'BN' ? 'বেস $২০ + প্রতি বর্গফুটে $১.৫০ এয়ার কার্গো চার্জ (৫-৭ কার্যদিবস)' : 'Base $20 + $1.50 per sq.ft air cargo rate (5-7 business days with export docs)'}
                  </p>
                  {deliveryDestination === 'international' && (
                    <span className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-bold text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      {language === 'BN' ? 'সক্রিয় ডেলিভারি মাধ্যম' : 'Active Delivery Zone'}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* BOX 4: Payment Method Integration Card */}
            <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                  4
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                    {language === 'BN' ? 'পেমেন্ট মাধ্যম নির্বাচন ও ট্রানজ্যাকশন নোট' : 'Payment Method & Transaction Note'}
                  </h3>
                  <p className="text-xs text-[#D4C5B9]">
                    {language === 'BN' ? 'বিকাশ, নগদ, ব্যাংক ওয়্যার অথবা কার্ড' : 'Select bKash, Nagad, Bank Wire, or Card'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* 4 Payment Options Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'bkash', label: 'bKash', num: '01905206450' },
                    { id: 'nagad', label: 'Nagad', num: '01905206450' },
                    { id: 'bank', label: 'Bank Wire', num: 'BRAC / City Bank' },
                    { id: 'card', label: 'Card / Gateway', num: 'Visa / Mastercard' },
                  ].map((p) => {
                    const isSelected = paymentMethod === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as PaymentMethodType)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#322016] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                            : 'bg-[#18100C] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#FDFBF7] block mb-1">{p.label}</span>
                        <span className="text-[10px] text-[#A69282] font-mono">{p.num}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Account Details Box */}
                <div className="p-3.5 rounded-xl bg-[#18100C] border border-[#D4AF37]/20 text-xs text-[#D4C5B9] space-y-1">
                  {paymentMethod === 'bkash' && (
                    <p>
                      📱 <strong>bKash Send/Payment:</strong> <span className="text-[#E5C365] font-mono font-bold">01905206450</span> (Personal/Merchant). Enter your bKash TrxID below.
                    </p>
                  )}
                  {paymentMethod === 'nagad' && (
                    <p>
                      📱 <strong>Nagad Send/Payment:</strong> <span className="text-[#E5C365] font-mono font-bold">01905206450</span>. Enter your Nagad TrxID below.
                    </p>
                  )}
                  {paymentMethod === 'bank' && (
                    <p>
                      🏦 <strong>Bank Wire Transfer:</strong> Official Tannery Pro-forma Invoice (PI) with Swift / IBAN will be generated upon submission.
                    </p>
                  )}
                  {paymentMethod === 'card' && (
                    <p>
                      💳 <strong>Card Payment:</strong> Direct online invoice payment link (Visa/Mastercard via Stripe) will be shared directly with your confirmation.
                    </p>
                  )}
                </div>

                {/* Payment Note / Transaction ID Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                    {language === 'BN' ? 'পেমেন্ট নোট / ট্রানজ্যাকশন আইডি (TrxID)' : 'Payment Note / Transaction ID (TrxID)'}
                  </label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder={language === 'BN' ? 'যেমন: 9B841A02 বা ইনভয়েসের পর পরিশোধ করব' : 'e.g. TRX9B841029 or "Will wire after Pro-forma invoice"'}
                    className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Order Summary Box with 2-Way Synced Controls (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#2E1E16] via-[#241710] to-[#1C120D] border-2 border-[#D4AF37]/40 shadow-2xl space-y-6">
              
              <div className="pb-4 border-b border-[#D4AF37]/25 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                    {language === 'BN' ? 'লাইভ অর্ডার সারাংশ' : 'Live Order Summary'}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-[#FDFBF7]">
                    {language === 'BN' ? 'স্বয়ংক্রিয় সমন্বয় হিসাব' : 'Two-Way Synced Overview'}
                  </h3>
                </div>
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>

              {/* Pre-Filled Product Card with 4:3 Swatch Image */}
              <div className="flex gap-4 items-center p-3 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/20">
                <div className="w-20 h-16 rounded-xl overflow-hidden aspect-[4/3] bg-black/40 border border-[#D4AF37]/30 shrink-0">
                  <img
                    src={selectedLeather.image}
                    alt={l(selectedLeather.name)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading text-sm font-bold text-[#FDFBF7] truncate">
                    {l(selectedLeather.name)}
                  </h4>
                  <p className="text-[11px] text-[#A69282] uppercase tracking-wider">
                    {l(selectedLeather.category)}
                  </p>
                  <p className="text-xs font-bold text-[#E5C365] mt-0.5">
                    {formatPrice(unitPriceUSD, unitPriceBDT, language, { perSqft: true, decimals: true })}
                  </p>
                </div>
              </div>

              {/* TWO-WAY SYNC 1: Leather Switcher Dropdown (syncs with Box 1) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5">
                  {language === 'BN' ? 'চামড়ার ধরণ (বাম পাশের সাথে সিঙ্ক):' : 'Leather Type (Synced with Form):'}
                </label>
                <select
                  value={selectedLeatherId}
                  onChange={(e) => handleLeatherChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#18100C] border border-[#D4AF37]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] font-medium cursor-pointer"
                >
                  {LEATHER_CATALOG.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#18100C]">
                      {l(item.name)} — {formatPrice(item.priceUSD, item.priceBDT, language, { perSqft: true, decimals: true })}
                    </option>
                  ))}
                </select>
              </div>

              {/* TWO-WAY SYNC 2: Square Footage Stepper & Slider (syncs with Box 1) */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-[#D4AF37]">
                  <span>{language === 'BN' ? 'পরিমাণ (বর্গফুট)' : 'Order Footage (sq.ft)'}</span>
                  <span className="text-[11px] text-[#A69282] font-normal">
                    {language === 'BN' ? 'ন্যূনতম' : 'MOQ'}: {formatNumberOnly(selectedLeather.moq, language)} sq.ft
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#18100C] rounded-xl border border-[#D4AF37]/30 px-3 py-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSqftChange(Math.max(selectedLeather.moq, sqft - 10))}
                      className="p-1 hover:text-[#D4AF37] cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-[#FDFBF7]">
                      {sqft}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSqftChange(sqft + 10)}
                      className="p-1 hover:text-[#D4AF37] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="range"
                    min={selectedLeather.moq}
                    max="400"
                    step="5"
                    value={sqft}
                    onChange={(e) => handleSqftChange(Number(e.target.value))}
                    className="flex-1 accent-[#D4AF37] cursor-pointer h-2 bg-[#18100C] rounded-lg"
                  />
                </div>
              </div>

              {/* TWO-WAY SYNC 3: Delivery Country Selector inside Summary Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5">
                  {language === 'BN' ? 'ডেলিভারি গন্তব্য (বাম পাশের সাথে সিঙ্ক):' : 'Delivery Destination (Synced):'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDestinationChange('domestic')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      deliveryDestination === 'domestic'
                        ? 'bg-[#3A271C] text-[#FDFBF7] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'bg-[#18100C] text-[#D4C5B9] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Inside Country (৳10/sqft)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationChange('international')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                      deliveryDestination === 'international'
                        ? 'bg-[#3A271C] text-[#FDFBF7] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'bg-[#18100C] text-[#D4C5B9] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Outside Country ($1.50/sqft)</span>
                  </button>
                </div>
              </div>

              {/* Live Specs Badges from Left Form */}
              <div className="p-3 rounded-xl bg-[#18100C] border border-[#D4AF37]/20 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#A69282]">{language === 'BN' ? 'নির্বাচিত শেড:' : 'Color Shade:'}</span>
                  <span className="font-semibold text-[#FDFBF7]">{customPantone ? `${selectedColorName} (${customPantone})` : selectedColorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">{language === 'BN' ? 'ডিবসিং ও ফয়েল:' : 'Debossing / Foil:'}</span>
                  <span className="font-semibold text-[#FDFBF7]">
                    {customLogoText.trim() ? `"${customLogoText}"` : 'None'} ({foilOption === 'gold' ? '24k Gold' : foilOption === 'silver' ? 'Silver' : foilOption === 'blind' ? 'Blind' : 'Raw'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">{language === 'BN' ? 'প্রাপকের ঠিকানা:' : 'Ship To:'}</span>
                  <span className="font-semibold text-[#FDFBF7] truncate max-w-[160px]">
                    {fullName.trim() ? `${fullName}${city.trim() ? `, ${city}` : ''}` : (language === 'BN' ? 'ঠিকানা পূরণ করুন' : 'Fill Address')}
                  </span>
                </div>
              </div>

              {/* Transparent Itemized Financial Calculation Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-[#D4AF37]/20 text-xs">
                
                {/* 1. Base Leather Price */}
                <div className="flex justify-between items-center text-[#D4C5B9]">
                  <span>{language === 'BN' ? '১. বেস চামড়ার মূল্য' : '1. Base Leather Price'}:</span>
                  <span className="font-semibold text-[#FDFBF7]">
                    {formatPrice(leatherTotalUSD, leatherTotalBDT, language, { decimals: true })}
                  </span>
                </div>
                <div className="text-[10px] text-[#A69282] text-right">
                  {sqft} sq.ft × {formatPrice(unitPriceUSD, unitPriceBDT, language, { perSqft: true, decimals: true })}
                </div>

                {/* 2. Customization Fee */}
                <div className="flex justify-between items-center text-[#D4C5B9]">
                  <span>{language === 'BN' ? '২. কাস্টম ডিবসিং ও মিলিং' : '2. Customization Fee'}:</span>
                  <span className="text-emerald-400 font-semibold">
                    {language === 'BN' ? 'কমপ্লিমেন্টারি (৳০ / $০)' : 'Complimentary ($0 / ৳0)'}
                  </span>
                </div>

                {/* 3. Dynamic Weight/Sq.Ft Delivery Charge */}
                <div className="flex justify-between items-center text-[#D4C5B9]">
                  <span className="flex items-center gap-1.5">
                    {deliveryDestination === 'domestic' ? <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{deliveryDestination === 'domestic' ? (language === 'BN' ? '৩. দেশের ভেতরে ডেলিভারি চার্জ' : '3. Domestic Delivery Charge') : (language === 'BN' ? '৩. আন্তর্জাতিক এয়ার ফ্রেইট' : '3. International Air Freight')}:</span>
                  </span>
                  {/* Displayed in BDT for domestic and in USD for international */}
                  <span className="font-bold text-[#E5C365]">
                    {deliveryDestination === 'domestic' ? `+৳${deliveryFeeBDT.toLocaleString()}` : `+$${deliveryFeeUSD.toFixed(2)} USD`}
                  </span>
                </div>
                <div className="text-[10px] text-[#E5C365]/90 text-right font-mono">
                  {deliveryDestination === 'domestic' ? `৳10 / sq.ft (50+ sqft weight rate)` : `$1.50 / sq.ft (air cargo weight rate)`}
                </div>

                {/* Grand Total Price */}
                <div className="pt-3 border-t-2 border-[#D4AF37]/30 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] block">
                      {language === 'BN' ? 'সর্বমোট প্রদেয় মূল্য' : 'Grand Total Price'}
                    </span>
                    <span className="text-[10px] text-[#A69282]">
                      Base + Custom + Dynamic Delivery
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#FDFBF7] drop-shadow-md">
                      {deliveryDestination === 'domestic' ? `৳${grandTotalBDT.toLocaleString()}` : `$${grandTotalUSD.toFixed(2)}`}
                    </div>
                    <div className="text-[11px] text-[#A69282] font-mono mt-0.5">
                      {deliveryDestination === 'domestic' ? `$${grandTotalUSD.toFixed(2)} USD` : `৳${grandTotalBDT.toLocaleString()} BDT`}
                    </div>
                  </div>
                </div>

              </div>

              {/* Prominent Action Button: Send Order */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendOrder}
                  className="w-full py-4 px-6 rounded-2xl btn-gold text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#170F0B] flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] transition-all transform active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 text-[#170F0B] fill-[#170F0B]/20" />
                  <span>{language === 'BN' ? 'অর্ডার পাঠান (Send Order)' : 'Send Order'}</span>
                </button>

                <p className="text-[11px] text-center text-[#A69282] mt-2.5 leading-normal">
                  {language === 'BN'
                    ? '🔒 "Send Order" চাপলে স্বয়ংক্রিয়ভাবে সকল পণ্যের বিবরণ, পূর্ণ ঠিকানা, ডায়নামিক শিপিং ও সর্বমোট মূল্যসহ সরাসরি আমাদের অফিসিয়াল হোয়াটসঅ্যাপে (01905206450) পাঠানো হবে।'
                    : '🔒 "Send Order" compiles all itemized specs, full address, dynamic shipping, and grand total into a direct WhatsApp message to +8801905206450.'}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Receipt Modal upon Submission */}
      <AnimatePresence>
        {submittedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg luxury-card rounded-3xl p-6 sm:p-8 bg-[#221610] border-2 border-[#D4AF37]/50 shadow-2xl text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  {language === 'BN' ? 'অর্ডার সফলভাবে তৈরি হয়েছে!' : 'Order Dispatched Successfully!'}
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#FDFBF7] mt-1">
                  {language === 'BN' ? 'হোয়াটসঅ্যাপ চ্যাটে পাঠানো হচ্ছে...' : 'WhatsApp Chat Connected...'}
                </h3>
                <p className="text-xs text-[#D4C5B9] mt-2 leading-relaxed">
                  {language === 'BN'
                    ? `অর্ডার নম্বর #${submittedOrder.orderId} তৈরি করা হয়েছে। আপনার হোয়াটসঅ্যাপ উইন্ডোটি স্বয়ংক্রিয়ভাবে চালু হয়েছে।`
                    : `Order reference #${submittedOrder.orderId} generated. Your WhatsApp chat has been initiated with the complete specification summary.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#18100C] border border-[#D4AF37]/20 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Order Ref:</span>
                  <span className="font-mono font-bold text-[#E5C365]">{submittedOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Client:</span>
                  <span className="font-bold text-[#FDFBF7]">{submittedOrder.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Leather & Footage:</span>
                  <span className="font-bold text-[#FDFBF7]">{submittedOrder.leatherName} ({submittedOrder.sqft} sq.ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Delivery Fee:</span>
                  <span className="font-bold text-[#E5C365]">{submittedOrder.dynamicDeliveryFeeFormatted}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#D4AF37]/20">
                  <span className="text-[#D4AF37] font-bold">Grand Total:</span>
                  <span className="font-bold text-[#D4AF37] text-sm">
                    {submittedOrder.grandTotalFormatted} <span className="text-[10px] text-[#A69282]">({submittedOrder.grandTotalSecondary})</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedOrder(null);
                    navigateTo('/');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider text-[#170F0B] cursor-pointer"
                >
                  {language === 'BN' ? 'হোম পেজে ফিরুন' : 'Return to Home'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedOrder(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#18100C] hover:bg-[#2A1E17] text-[#D4C5B9] text-xs font-semibold border border-[#D4AF37]/30 cursor-pointer"
                >
                  {language === 'BN' ? 'এই পাতায় থাকুন' : 'Stay on this Page'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
