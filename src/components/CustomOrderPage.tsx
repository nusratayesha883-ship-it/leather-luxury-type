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
  AlertCircle,
  Database,
  FileSpreadsheet,
  Eye,
  Copy,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { formatPrice, formatNumberOnly } from '../data/formatters';
import type { DeliveryDestination, PaymentMethodType, LeatherItem, OrderRecord } from '../types';
import { insertOrderToSupabase, generateUniqueOrderId } from '../services/supabaseClient';
import { syncOrderToGoogleSheets } from '../services/googleSheetsService';
import { sendOrderConfirmationEmail, generateOrderConfirmationEmailHTML } from '../services/emailService';
import { MagneticButton } from './MagneticButton';
import { ScrollReveal, RevealItem } from './ScrollReveal';

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

  // UI Validation, Submitting & Success Modal State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [showReceiptEmailModal, setShowReceiptEmailModal] = useState<boolean>(false);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

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

  // Handle Order Submit & Auto WhatsApp Generation + Supabase + Google Sheets + Email Sync
  const handleSendOrder = async () => {
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
    if (!emailAddress.trim() || !emailAddress.includes('@')) {
      setValidationError(
        language === 'BN'
          ? 'স্বয়ংক্রিয় অর্ডার রিসিট ও ট্র্যাকিং আপডেটের জন্য অনুগ্রহ করে আপনার সঠিক ইমেইল অ্যাড্রেস লিখুন।'
          : 'Please enter a valid Email Address to receive your automated order confirmation receipt.'
      );
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    if (!streetAddress.trim() || !city.trim()) {
      setValidationError(language === 'BN' ? 'অনুগ্রহ করে পূর্ণ ডেলিভারি ঠিকানা ও শহরের নাম লিখুন।' : 'Please enter your complete Street Address and City.');
      window.scrollTo({ top: 600, behavior: 'smooth' });
      return;
    }
    setValidationError(null);
    setIsSubmitting(true);

    try {
      // 1. Generate Unique Order ID (e.g. #LHA-1001)
      const orderId = generateUniqueOrderId();

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
        paymentMethod === 'bkash' ? 'bKash (01353091099)' :
        paymentMethod === 'nagad' ? 'Nagad (01353091099)' :
        paymentMethod === 'bank' ? 'Bank Wire Transfer' : 'Card / Online Invoice';

      const fullAddressString = `${streetAddress.trim()}, ${city.trim()}${postalCode.trim() ? ` - ${postalCode.trim()}` : ''}, ${country.trim() || (deliveryDestination === 'domestic' ? 'Bangladesh' : 'International')}`;

      // 2. Prepare Order Record with initial status 'Pending'
      const orderRecord: OrderRecord = {
        order_id: orderId,
        customer_name: fullName.trim(),
        phone: phoneNumber.trim(),
        email: emailAddress.trim(),
        company_name: companyName.trim() || undefined,
        delivery_address: fullAddressString,
        street_address: streetAddress.trim(),
        city: city.trim(),
        postal_code: postalCode.trim() || undefined,
        country: country.trim() || (deliveryDestination === 'domestic' ? 'Bangladesh' : 'International'),
        delivery_destination: deliveryDestination,
        leather_id: selectedLeather.id,
        leather_name: l(selectedLeather.name),
        sqft,
        customization_specs: {
          colorName: selectedColorName,
          customPantone: customPantone.trim() || undefined,
          logoDebossingText: customLogoText.trim() || undefined,
          foilOption,
          thicknessOption,
          specialNotes: specialNotes.trim() || undefined,
        },
        itemized_costs: {
          leatherUnitPriceUSD: unitPriceUSD,
          leatherUnitPriceBDT: unitPriceBDT,
          baseLeatherUSD: leatherTotalUSD,
          baseLeatherBDT: leatherTotalBDT,
          customizationFeeUSD: 0,
          customizationFeeBDT: 0,
          deliveryFeeUSD: deliveryFeeUSD,
          deliveryFeeBDT: deliveryFeeBDT,
          currencySelected: deliveryDestination === 'domestic' ? 'BDT' : 'USD',
        },
        payment_method: paymentMethod,
        trx_id: paymentNote.trim() || 'Pending advance to 01353091099',
        grand_total_usd: grandTotalUSD,
        grand_total_bdt: grandTotalBDT,
        status: 'Pending',
        created_at: new Date().toISOString(),
      };

      // 3. Instantly insert order into Supabase orders table
      const supabaseResult = await insertOrderToSupabase(orderRecord);

      // 4. Trigger Google Sheets & Webhook Sync
      const sheetsResult = await syncOrderToGoogleSheets(orderRecord);

      // 5. Trigger Automated Order Confirmation Email
      const emailResult = await sendOrderConfirmationEmail(orderRecord);

      // 6. Build the WhatsApp message with exact requested note format
      const message = 
        `🏛️ *LUXEHIDE ATELIER — BESPOKE ORDER SUBMISSION*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 *ORDER DETAILS:*\n` +
        `• Order ID: *${orderId}*\n` +
        `• Status: *Pending*\n` +
        `• Client Name: *${fullName.trim()}*\n` +
        `• Phone: *${phoneNumber.trim()}*\n` +
        `• Email: *${emailAddress.trim()}*\n\n` +
        `💎 *LEATHER SPECIFICATIONS:*\n` +
        `• Leather Type: *${l(selectedLeather.name)}*\n` +
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
        `• Delivery Zone: *${destinationLabel}*\n` +
        `• Full Address: *${fullAddressString}*\n` +
        `• Dynamic Delivery Charge: *${dynamicRateNote}*\n\n` +
        `💳 *PAYMENT METHOD:*\n` +
        `• Channel: *${paymentLabel}*\n` +
        `• Official bKash/Nagad Number: *01353091099*\n` +
        `• TrxID: *${paymentNote.trim() || 'Advance sent to 01353091099'}*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 *ITEMIZED COST BREAKDOWN:*\n` +
        `• Base Leather: ${formatPrice(leatherTotalUSD, leatherTotalBDT, language, { decimals: true })}\n` +
        `• Customization: Complimentary ($0 / ৳0)\n` +
        `• Delivery Charge: ${dynamicRateNote}\n` +
        `• *GRAND TOTAL:* ${deliveryDestination === 'domestic' ? `৳${grandTotalBDT.toLocaleString()} ($${grandTotalUSD.toFixed(2)} USD)` : `$${grandTotalUSD.toFixed(2)} USD (৳${grandTotalBDT.toLocaleString()} BDT)`}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💬 *NOTE:* My order ${orderId} has been submitted. Looking forward to your response!\n` +
        `_Dispatched via LuxeHide Atelier Web Application_`;

      // 7. Save submitted order for instant receipt display & verification
      setSubmittedOrder({
        orderId,
        record: orderRecord,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: emailAddress.trim(),
        leatherName: l(selectedLeather.name),
        sqft,
        destinationLabel,
        dynamicDeliveryFeeFormatted: deliveryDestination === 'domestic' ? `৳${deliveryFeeBDT.toLocaleString()} (৳10 / sq.ft)` : `$${deliveryFeeUSD.toFixed(2)} ($1.50 / sq.ft)`,
        grandTotalFormatted: deliveryDestination === 'domestic' ? `৳${grandTotalBDT.toLocaleString()}` : `$${grandTotalUSD.toFixed(2)}`,
        grandTotalSecondary: deliveryDestination === 'domestic' ? `$${grandTotalUSD.toFixed(2)} USD` : `৳${grandTotalBDT.toLocaleString()} BDT`,
        supabaseSynced: supabaseResult.success,
        sheetsSynced: sheetsResult.success,
        emailSent: emailResult.success,
      });

      // 8. Auto open WhatsApp redirect
      const whatsappUrl = `https://wa.me/8801905206450?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('[Order Submission Error]', err);
      setValidationError(err?.message || 'Error processing order. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
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
        <ScrollReveal className="text-center max-w-4xl mx-auto mb-10">
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
        </ScrollReveal>

        {/* Validation Alert */}
        {validationError && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-sm flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main 2-Column Responsive Layout */}
        <ScrollReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" stagger={0.12}>
          
          {/* LEFT COLUMN: 4 Form Boxes with Two-Way Sync (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* BOX 1: Leather Type & Customization (Color, Logo/Debossing, Thickness) */}
            <RevealItem>
              <div className="luxury-order-box glass-sheen rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                      {language === 'BN' ? 'চামড়ার ধরণ ও কাস্টমাইজেশন' : 'Leather Type & Customization'}
                    </h3>
                    <p className="text-xs text-[#D4C5B9]">
                      {language === 'BN' ? 'চামড়া নির্বাচন, নির্দিষ্ট কালার শেড, লোগো ডিবসিং ও স্পেসিফিকেশন' : 'Color, Logo/Debossing, Thickness'}
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

                  {/* 1.2 Color Shade Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2.5">
                      {language === 'BN' ? '২. কালার শেড নির্বাচন করুন' : '2. Select Color Shade'}
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

                  {/* 1.3 Custom Logo / Debossing Text & Foil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                        {language === 'BN' ? '৩. লোগো / ডিবসিং টেক্সট' : '3. Custom Logo / Debossing Text'}
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
                        {language === 'BN' ? '৪. ফয়েল স্ট্যাম্পিং শৈলী' : '4. Foil Stamping Finish'}
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

                  {/* 1.4 Thickness & Special Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                        {language === 'BN' ? '৫. চামড়ার পুরুত্ব ও টেম্পার' : '5. Leather Thickness & Temper'}
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
                        {language === 'BN' ? '৬. বিশেষ ট্যানারি নোট' : '6. Special Tannery Instructions'}
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
            </RevealItem>

            {/* BOX 2: Shipping & Address (Full Name, Phone, Full Address, Inside Country / Outside Country selector) */}
            <RevealItem>
              <div className="luxury-order-box glass-sheen rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                      {language === 'BN' ? 'শিপিং ও ঠিকানা বিবরণ' : 'Shipping & Address'}
                    </h3>
                    <p className="text-xs text-[#D4C5B9]">
                      {language === 'BN' ? 'প্রাপকের যোগাযোগ, ডেলিভারি গন্তব্য ও পূর্ণ ঠিকানা' : 'Full Name, Phone, Full Address, Inside/Outside Country'}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  
                  {/* 2.1 Inside Country / Outside Country Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2.5">
                      {language === 'BN' ? 'ডেলিভারি গন্তব্য নির্বাচন করুন *' : 'Delivery Destination *'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Inside Country Option (Displayed in BDT) */}
                      <div
                        onClick={() => handleDestinationChange('domestic')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                          deliveryDestination === 'domestic'
                            ? 'bg-[#2E1E15] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg'
                            : 'bg-[#18100C] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#D4AF37]" />
                            <span className="font-bold text-xs sm:text-sm text-[#FDFBF7]">
                              {language === 'BN' ? 'দেশের ভেতরে (বাংলাদেশ)' : 'Inside Country (Bangladesh)'}
                            </span>
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-[#E5C365]">
                            ৳{deliveryFeeBDT.toLocaleString()}
                          </span>
                        </div>
                        <div className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#E5C365] text-[10px] font-mono font-bold mb-1">
                          ৳10 / sq.ft (Express Cargo)
                        </div>
                        <p className="text-[11px] text-[#D4C5B9] leading-snug">
                          {language === 'BN' ? 'বেস ফি ৳১০০ + প্রতি বর্গফুটে ৳১০' : 'Base ৳100 + ৳10 / sq.ft weight rate'}
                        </p>
                        {deliveryDestination === 'domestic' && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-400">
                            <Check className="w-3 h-3" />
                            {language === 'BN' ? 'সক্রিয় জোন' : 'Active Zone'}
                          </span>
                        )}
                      </div>

                      {/* Outside Country Option (Displayed in USD) */}
                      <div
                        onClick={() => handleDestinationChange('international')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                          deliveryDestination === 'international'
                            ? 'bg-[#2E1E15] border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg'
                            : 'bg-[#18100C] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#D4AF37]" />
                            <span className="font-bold text-xs sm:text-sm text-[#FDFBF7]">
                              {language === 'BN' ? 'দেশের বাইরে (আন্তর্জাতিক)' : 'Outside Country (International)'}
                            </span>
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-[#E5C365]">
                            ${deliveryFeeUSD.toFixed(2)} USD
                          </span>
                        </div>
                        <div className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#E5C365] text-[10px] font-mono font-bold mb-1">
                          $1.50 / sq.ft (Air Freight)
                        </div>
                        <p className="text-[11px] text-[#D4C5B9] leading-snug">
                          {language === 'BN' ? 'বেস $২০ + প্রতি বর্গফুটে $১.৫০ এয়ার কার্গো' : 'Base $20 + $1.50 / sq.ft air cargo rate'}
                        </p>
                        {deliveryDestination === 'international' && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-400">
                            <Check className="w-3 h-3" />
                            {language === 'BN' ? 'সক্রিয় জোন' : 'Active Zone'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2.2 Full Name & Phone Number (Required) */}
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

                  {/* 2.3 Email Address & Company */}
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

                  {/* 2.4 Full Street Address */}
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

                  {/* 2.5 City, Postal Code & Country */}
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
            </RevealItem>

            {/* BOX 3: Quantity & Sq.Ft Selection (Synced with the right-side summary box) */}
            <RevealItem>
              <div className="luxury-order-box glass-sheen rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                      {language === 'BN' ? 'পরিমাণ ও স্কয়ার ফিট নির্ধারণ' : 'Quantity & Sq.Ft Selection'}
                    </h3>
                    <p className="text-xs text-[#D4C5B9]">
                      {language === 'BN' ? 'ডানপাশের সারাংশ বক্সের সাথে লাইভ সমন্বয়কৃত' : 'Synced with the right-side summary box'}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* 3.1 Stepper & Slider */}
                  <div className="p-5 rounded-2xl bg-[#1A110C] border border-[#D4AF37]/30 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-[#D4AF37]">
                      <span className="uppercase tracking-wider">
                        {language === 'BN' ? 'প্রয়োজনীয় চামড়ার পরিমাণ (বর্গফুট) *' : 'Order Quantity in Square Feet (Sq.Ft) *'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E5C365] font-mono">
                        {language === 'BN' ? 'ন্যূনতম' : 'MOQ'}: {formatNumberOnly(selectedLeather.moq, language)} sq.ft
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-[#241710] rounded-xl border border-[#D4AF37]/40 px-3 py-2 shrink-0 shadow-inner">
                        <button
                          type="button"
                          onClick={() => handleSqftChange(Math.max(selectedLeather.moq, sqft - 10))}
                          className="p-1 text-[#D4C5B9] hover:text-[#D4AF37] cursor-pointer transition-colors"
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
                          className="w-16 text-center font-bold text-base bg-transparent text-[#FDFBF7] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSqftChange(sqft + 10)}
                          className="p-1 text-[#D4C5B9] hover:text-[#D4AF37] cursor-pointer transition-colors"
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

                  {/* 3.2 Dynamic Calculation Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#18100C] border border-[#D4AF37]/20 flex justify-between items-center">
                      <span className="text-[#A69282]">{language === 'BN' ? 'চামড়ার মূল হার:' : 'Leather Base Cost:'}</span>
                      <span className="font-bold text-[#FDFBF7]">
                        {formatPrice(leatherTotalUSD, leatherTotalBDT, language, { decimals: true })}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#18100C] border border-[#D4AF37]/20 flex justify-between items-center">
                      <span className="text-[#A69282]">
                        {deliveryDestination === 'domestic' ? (language === 'BN' ? 'ডেলিভারি চার্জ (বাংলাদেশ):' : 'Delivery Charge (Domestic):') : (language === 'BN' ? 'এয়ার ফ্রেইট চার্জ:' : 'Air Freight Charge:')}
                      </span>
                      <span className="font-bold text-[#E5C365]">
                        {deliveryDestination === 'domestic' ? `৳${deliveryFeeBDT.toLocaleString()}` : `$${deliveryFeeUSD.toFixed(2)} USD`}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#18100C]/70 border border-[#D4AF37]/15 flex items-center gap-2 text-[11px] text-[#A69282]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>
                      {language === 'BN'
                        ? '🔄 পরিমাণ পরিবর্তন করলে ডান পাশের লাইভ সামারি বক্স এবং ডেলিভারি ফি সাথে সাথে সমন্বয় হবে।'
                        : '🔄 Any change in quantity instantly syncs with the right-side summary box and recalculates weight-based freight.'}
                    </span>
                  </div>

                </div>
              </div>
            </RevealItem>

            {/* BOX 4: Payment Instructions & TrxID (bKash/Nagad number 01353091099, Payment Method selector, optional TrxID field) */}
            <RevealItem>
              <div className="luxury-order-box glass-sheen rounded-3xl p-6 sm:p-8 bg-[#221610] border border-[#D4AF37]/30 shadow-xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#342217] flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#FDFBF7]">
                      {language === 'BN' ? 'পেমেন্ট নির্দেশিকা ও ট্রানজ্যাকশন আইডি (TrxID)' : 'Payment Instructions & TrxID'}
                    </h3>
                    <p className="text-xs text-[#D4C5B9]">
                      {language === 'BN' ? 'অফিশিয়াল বিকাশ ও নগদ নম্বর: 01353091099' : 'bKash/Nagad 01353091099, Payment Method selector, TrxID'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  
                  {/* 4 Payment Options Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'bkash', label: 'bKash', num: '01353091099' },
                      { id: 'nagad', label: 'Nagad', num: '01353091099' },
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

                  {/* Explicit Official Payment Instruction Box for 01353091099 */}
                  <div className="p-4 rounded-2xl bg-[#18100C] border border-[#D4AF37]/35 text-xs text-[#D4C5B9] space-y-2">
                    {paymentMethod === 'bkash' && (
                      <div>
                        <div className="flex items-center gap-2 text-[#E5C365] font-bold mb-1">
                          <span>📱 bKash Official Account:</span>
                          <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FDFBF7]">
                            01353091099
                          </span>
                        </div>
                        <p className="leading-relaxed">
                          {language === 'BN'
                            ? 'অনুগ্রহ করে 01353091099 নম্বরে বিকাশ (Send Money / Payment)-এর মাধ্যমে অর্ডারের পেমেন্ট বা অগ্রিম পরিশোধ করুন এবং প্রাপ্ত ট্রানজ্যাকশন আইডি (TrxID) নিচের বক্সে লিখুন।'
                            : 'Please send payment or advance to 01353091099 via bKash (Personal/Merchant), then input your Transaction ID (TrxID) below before sending your order via WhatsApp.'}
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'nagad' && (
                      <div>
                        <div className="flex items-center gap-2 text-[#E5C365] font-bold mb-1">
                          <span>📱 Nagad Official Account:</span>
                          <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FDFBF7]">
                            01353091099
                          </span>
                        </div>
                        <p className="leading-relaxed">
                          {language === 'BN'
                            ? 'অনুগ্রহ করে 01353091099 নম্বরে নগদ (Send Money / Payment)-এর মাধ্যমে অর্ডারের পেমেন্ট বা অগ্রিম পরিশোধ করুন এবং প্রাপ্ত ট্রানজ্যাকশন আইডি (TrxID) নিচের বক্সে লিখুন।'
                            : 'Please send payment or advance to 01353091099 via Nagad (Personal/Merchant), then input your Transaction ID (TrxID) below before sending your order via WhatsApp.'}
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div>
                        <div className="text-[#E5C365] font-bold mb-1">
                          🏦 Official Tannery Bank Wire Transfer:
                        </div>
                        <p className="leading-relaxed">
                          {language === 'BN'
                            ? 'অর্ডার সাবমিট করলে অফিশিয়াল ট্যানারি প্রোফরমা ইনভয়েস (PI) ও BRAC / City Bank হিসাব নম্বর প্রদান করা হবে। নিচে আপনার ব্যাংক রেফারেন্স লিখুন।'
                            : 'Official Tannery Pro-forma Invoice (PI) with Swift / IBAN details will be generated upon submission. Enter your bank reference or "Invoice Required".'}
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div>
                        <div className="text-[#E5C365] font-bold mb-1">
                          💳 Secure Card / Online Gateway:
                        </div>
                        <p className="leading-relaxed">
                          {language === 'BN'
                            ? 'অনলাইন ভিসা/মাস্টারকার্ড পেমেন্ট লিংক আপনার হোয়াটসঅ্যাপ কনফার্মেশনের সাথে সরাসরি পাঠিয়ে দেওয়া হবে।'
                            : 'Secure online card payment link (Visa/Mastercard via Stripe) will be dispatched directly to your WhatsApp confirmation.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Note / Transaction ID Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                      {language === 'BN' ? 'পেমেন্ট নোট / ট্রানজ্যাকশন আইডি (TrxID) *' : 'Payment Note / Transaction ID (TrxID) *'}
                    </label>
                    <input
                      type="text"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder={language === 'BN' ? 'যেমন: 9B841A02 বা 01353091099 এ বিকাশ করেছি' : 'e.g. TRX9B841029 or "Advance sent via bKash to 01353091099"'}
                      className="w-full bg-[#18100C] text-xs text-[#FDFBF7] px-4 py-3 rounded-xl border border-[#D4AF37]/25 focus:outline-none focus:border-[#D4AF37] placeholder:text-[#8D7768]"
                    />
                  </div>

                </div>
              </div>
            </RevealItem>

        </div>

        {/* RIGHT COLUMN: Sticky Order Summary Box with 2-Way Synced Controls (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          
          <RevealItem>
            <div className="luxury-order-box glass-sheen rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#2E1E16] via-[#241710] to-[#1C120D] border-2 border-[#D4AF37]/40 shadow-2xl space-y-6">
              
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
                    className="w-full h-full object-cover leather-swatch-zoom"
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
                <MagneticButton
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSendOrder}
                  className={`w-full py-4 px-6 rounded-2xl btn-gold text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#170F0B] flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.6)] transition-all transform active:scale-98 ${
                    isSubmitting ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 text-[#170F0B] animate-spin" />
                      <span>{language === 'BN' ? 'অর্ডার প্রস্তুত ও ক্লাউড সিঙ্ক হচ্ছে...' : 'Saving to Supabase & Dispatched...'}</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 text-[#170F0B] fill-[#170F0B]/20" />
                      <span>{language === 'BN' ? 'অর্ডার পাঠান (Send Order)' : 'Send Order'}</span>
                    </>
                  )}
                </MagneticButton>

                <p className="text-[11px] text-center text-[#A69282] mt-2.5 leading-normal">
                  {language === 'BN'
                    ? '🔒 "Send Order" চাপলে স্বয়ংক্রিয়ভাবে সুপাবেস ডাটাবেসে সংরক্ষণ, গুগল শিটে সিঙ্ক, নিশ্চিতকরণ ইমেইল প্রেরণ এবং হোয়াটসঅ্যাপে (+8801905206450) পাঠানো হবে।'
                    : '🔒 "Send Order" saves order to Supabase orders table, syncs with Google Sheets webhook, dispatches confirmation email, and opens WhatsApp.'}
                </p>
              </div>

            </div>
          </RevealItem>

        </div>

      </ScrollReveal>

    </div>

      {/* Confirmation Receipt Modal upon Submission */}
      <AnimatePresence>
        {submittedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl luxury-card rounded-3xl p-6 sm:p-8 bg-[#221610] border-2 border-[#D4AF37]/50 shadow-2xl text-center space-y-5 my-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Status: Pending</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#FDFBF7] mt-1">
                  {language === 'BN' ? 'অর্ডার সফলভাবে নিবন্ধিত ও সংযুক্ত!' : 'Bespoke Order Dispatched & Registered!'}
                </h3>
                <p className="text-xs text-[#D4C5B9] mt-2 leading-relaxed">
                  {language === 'BN'
                    ? `অর্ডার নম্বর ${submittedOrder.orderId} তৈরি হয়েছে। সুপাবেস ডাটাবেসে সংরক্ষিত, গুগল শিট ও ইমেইল সিঙ্ক সফল এবং হোয়াটসঅ্যাপ উইন্ডো চালু হয়েছে।`
                    : `Order reference ${submittedOrder.orderId} has been registered into the atelier database and dispatched across all connected channels.`}
                </p>
              </div>

              {/* Order Details Summary Box */}
              <div className="p-4 rounded-2xl bg-[#18100C] border border-[#D4AF37]/25 text-xs text-left space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#D4AF37]/15">
                  <span className="text-[#A69282]">Order ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#E5C365] text-sm">{submittedOrder.orderId}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(submittedOrder.orderId);
                        setCopiedOrderId(true);
                        setTimeout(() => setCopiedOrderId(false), 2000);
                      }}
                      className="p-1 rounded bg-[#2A1E17] hover:bg-[#38281E] text-[#D4AF37] text-[10px] cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrderId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Customer Name:</span>
                  <span className="font-bold text-[#FDFBF7]">{submittedOrder.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Customer Email:</span>
                  <span className="font-bold text-[#FDFBF7]">{submittedOrder.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Leather & Volume:</span>
                  <span className="font-bold text-[#FDFBF7]">{submittedOrder.leatherName} ({submittedOrder.sqft} sq.ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A69282]">Dynamic Shipping:</span>
                  <span className="font-bold text-[#E5C365]">{submittedOrder.dynamicDeliveryFeeFormatted}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#D4AF37]/20 items-baseline">
                  <span className="text-[#D4AF37] font-bold">Grand Total:</span>
                  <span className="font-bold text-[#D4AF37] text-base">
                    {submittedOrder.grandTotalFormatted} <span className="text-[11px] text-[#A69282] font-normal">({submittedOrder.grandTotalSecondary})</span>
                  </span>
                </div>
              </div>

              {/* 4 Multi-Channel Sync Status Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-left">
                <div className="p-2.5 rounded-xl bg-[#1D140F] border border-emerald-500/30 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300 block">Supabase Storage</span>
                    <span className="text-[#A69282] text-[10px]">Saved (Status: Pending)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1D140F] border border-emerald-500/30 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300 block">Google Sheets</span>
                    <span className="text-[#A69282] text-[10px]">Webhook Row Synced</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1D140F] border border-emerald-500/30 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300 block">Confirmation Email</span>
                    <span className="text-[#A69282] text-[10px]">Receipt Dispatched</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1D140F] border border-emerald-500/30 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300 block">WhatsApp Direct</span>
                    <span className="text-[#A69282] text-[10px]">Redirect Opened</span>
                  </div>
                </div>
              </div>

              {/* Interactive Actions */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReceiptEmailModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2A1E17] hover:bg-[#38281E] text-[#D4AF37] hover:text-[#FDFBF7] text-xs font-bold border border-[#D4AF37]/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  <span>Preview Luxury Email Receipt</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedOrder(null);
                      navigateTo('/admin');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#18100C] hover:bg-[#2A1E17] text-[#E5C365] text-xs font-bold border border-[#D4AF37]/35 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View in Admin Dashboard</span>
                  </button>
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
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Luxury HTML Email Receipt Preview Modal */}
      <AnimatePresence>
        {showReceiptEmailModal && submittedOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl h-[88vh] bg-[#1C120D] border-2 border-[#D4AF37]/60 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#140D09] border-b border-[#D4AF37]/30">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#FDFBF7]">
                      Order Confirmation Receipt ({submittedOrder.orderId})
                    </h4>
                    <p className="text-[11px] text-[#A69282]">
                      Automated HTML email sent to: <strong className="text-[#E5C365]">{submittedOrder.email}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReceiptEmailModal(false)}
                  className="p-1.5 rounded-full bg-[#261811] hover:bg-[#382419] text-[#D4C5B9] hover:text-[#FDFBF7] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rendered HTML Receipt */}
              <div className="flex-1 bg-[#120B08] p-2 sm:p-4 overflow-hidden">
                <iframe
                  title="Confirmation Receipt Email"
                  srcDoc={generateOrderConfirmationEmailHTML(submittedOrder.record)}
                  className="w-full h-full rounded-xl border border-[#D4AF37]/20 bg-[#120B08]"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-3 bg-[#140D09] border-t border-[#D4AF37]/30 text-xs">
                <span className="text-[#A69282] hidden sm:inline">
                  Features unique Order ID, leather specs, shipping rate, and bKash/Nagad details (01353091099).
                </span>
                <button
                  type="button"
                  onClick={() => setShowReceiptEmailModal(false)}
                  className="px-5 py-2 rounded-xl btn-gold text-xs font-bold text-[#170F0B] cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
