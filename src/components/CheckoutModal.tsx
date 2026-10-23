import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Banknote, Smartphone, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice } from '../data/formatters';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotalUSD,
    subtotalBDT,
    clearCart,
    language,
    l,
  } = useApp();

  const t = TRANSLATIONS.checkout;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'mfs' | 'stripe'>('cod');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    deliveryAddress: '',
    mfsNumber: '',
    mfsTrxId: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderId(`LUXE-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSuccess(true);
      clearCart();
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsSuccess(false);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-[#231F20]/75 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#4B3F35]/15 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#4B3F35]/70 hover:text-[#231F20] hover:bg-[#FAF6F1] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#231F20]">
              {l(t.successTitle)}
            </h3>
            <p className="text-sm text-[#4B3F35]/80 max-w-md mx-auto leading-relaxed">
              {l(t.successMsg)}
            </p>
            <div className="p-4 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/10 max-w-sm mx-auto text-xs text-[#231F20]">
              <span className="text-[#4B3F35] block mb-1">
                {language === 'BN' ? 'অর্ডার ট্র্যাকিং আইডি:' : 'Order Tracking ID:'}
              </span>
              <strong className="text-sm font-mono text-[#D4AF37] font-bold">{orderId}</strong>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 px-8 py-3 rounded-full btn-gold text-xs font-bold uppercase tracking-wider text-[#231F20] cursor-pointer"
            >
              {language === 'BN' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Exploring'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                {l(t.subtitle)}
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#231F20]">
                {l(t.title)}
              </h3>
            </div>

            {/* Summary Banner */}
            <div className="p-4 rounded-2xl bg-[#FAF6F1] border border-[#4B3F35]/15 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#4B3F35] block">
                  {cartItems.length} {language === 'BN' ? 'টি আইটেম' : 'leather hides selected'}
                </span>
                <span className="font-bold text-[#231F20]">
                  {language === 'BN' ? 'সর্বমোট প্রদেয়:' : 'Payable Total:'}
                </span>
              </div>
              <div className="font-heading text-xl font-bold text-[#D4AF37]">
                {formatPrice(subtotalUSD, subtotalBDT, language, { decimals: true })}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1.5">
                  {l(t.companyName)}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Sterling Shoes Ltd."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs text-[#231F20] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1.5">
                  {l(t.contactPerson)} *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  required
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Marcus Sterling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs text-[#231F20] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1.5">
                  {l(t.phone)} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 17XX-XXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs text-[#231F20] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B3F35] mb-1.5">
                  {l(t.deliveryAddress)} *
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  required
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#4B3F35]/20 text-xs text-[#231F20] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2 border-t border-[#4B3F35]/10">
              <label className="block text-xs font-bold uppercase text-[#4B3F35]">
                {l(t.paymentMethodLabel)}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Cash on Delivery / Wire */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#4B3F35] bg-[#4B3F35] text-[#FAF6F1] ring-2 ring-[#D4AF37]'
                      : 'border-[#4B3F35]/20 bg-[#FAF6F1] text-[#231F20] hover:border-[#4B3F35]'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-2 text-[#D4AF37]" />
                  <span className="text-xs font-bold leading-tight">{l(t.cod)}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">Pay upon inspection</span>
                </button>

                {/* 2. bKash / Nagad / Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mfs')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'mfs'
                      ? 'border-[#4B3F35] bg-[#4B3F35] text-[#FAF6F1] ring-2 ring-[#D4AF37]'
                      : 'border-[#4B3F35]/20 bg-[#FAF6F1] text-[#231F20] hover:border-[#4B3F35]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-2 text-[#D4AF37]" />
                  <span className="text-xs font-bold leading-tight">{l(t.mfs)}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">Instant local MFS</span>
                </button>

                {/* 3. Stripe / Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'border-[#4B3F35] bg-[#4B3F35] text-[#FAF6F1] ring-2 ring-[#D4AF37]'
                      : 'border-[#4B3F35]/20 bg-[#FAF6F1] text-[#231F20] hover:border-[#4B3F35]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-2 text-[#D4AF37]" />
                  <span className="text-xs font-bold leading-tight">{l(t.stripe)}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">Global Visa / Mastercard</span>
                </button>

              </div>

              {/* Dynamic Payment Details Mock */}
              {paymentMethod === 'mfs' && (
                <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 text-xs space-y-2 text-[#231F20]">
                  <p className="font-semibold text-pink-900">
                    {language === 'BN'
                      ? 'বিকাশ / নগদ মার্চেন্ট নম্বর: 01700-000000 (Make Payment)'
                      : 'bKash / Nagad Merchant: 01700-000000 (Use "Make Payment" Option)'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      name="mfsNumber"
                      placeholder={language === 'BN' ? 'আপনার বিকাশ/নগদ নম্বর' : 'Your MFS Account Number'}
                      className="px-3 py-2 bg-white rounded-lg border border-pink-200 text-xs"
                    />
                    <input
                      type="text"
                      name="mfsTrxId"
                      placeholder={language === 'BN' ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                      className="px-3 py-2 bg-white rounded-lg border border-pink-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'stripe' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Stripe Secure Card Element</span>
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value="4242 •••• •••• 4242 (Stripe Test Simulator Active)"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl btn-gold text-xs font-bold uppercase tracking-wider text-[#231F20] flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <span>
                  {language === 'BN' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Wholesale Invoicing...'}
                </span>
              ) : (
                <>
                  <span>{l(t.confirmBtn)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </motion.div>
    </div>
  );
};
