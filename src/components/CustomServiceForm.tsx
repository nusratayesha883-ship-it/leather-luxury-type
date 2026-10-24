import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEATHER_CATALOG } from '../data/leatherCatalog';
import { TRANSLATIONS } from '../data/translations';

export const CustomServiceForm: React.FC = () => {
  const { language, l, selectedCustomLeatherId } = useApp();
  const t = TRANSLATIONS.customService;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    leatherTypeId: selectedCustomLeatherId || 'full-grain-cowhide',
    colorCode: 'CG-801 (Cognac)',
    quantitySqft: 100,
    customLogoText: '',
    details: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedCustomLeatherId) {
      setFormData((prev) => ({ ...prev, leatherTypeId: selectedCustomLeatherId }));
    }
  }, [selectedCustomLeatherId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedLeather = LEATHER_CATALOG.find(
      (item) => item.id === formData.leatherTypeId
    );
    const leatherName = selectedLeather
      ? l(selectedLeather.name)
      : formData.leatherTypeId;

    const message = language === 'BN'
      ? `*নতুন কাস্টম লেদার ইনকোয়ারি (লাক্সহাইড অ্যাটেলিয়ার)*\n\n` +
        `👤 *নাম / প্রতিষ্ঠান:* ${formData.name}\n` +
        `📧 *ইমেইল:* ${formData.email}\n` +
        `📱 *হোয়াটসঅ্যাপ:* ${formData.whatsapp}\n` +
        `🐂 *চামড়ার ধরণ:* ${leatherName}\n` +
        `🎨 *কালার / শেড কোড:* ${formData.colorCode}\n` +
        `📐 *পরিমাণ (বর্গফুট):* ${formData.quantitySqft} sq.ft\n` +
        `✒️ *কাস্টম লোগো / এমবসিং:* ${formData.customLogoText || 'প্রযোজ্য নয়'}\n` +
        `📝 *বিস্তারিত বিবরণ:* ${formData.details || 'মানসম্পন্ন নমুনা প্রয়োজন'}\n\n` +
        `_LuxeHide Atelier ওয়েব পোর্টাল থেকে প্রেরিত_`
      : `*NEW CUSTOM LEATHER INQUIRY (LuxeHide Atelier)*\n\n` +
        `👤 *Client / Atelier:* ${formData.name}\n` +
        `📧 *Email:* ${formData.email}\n` +
        `📱 *WhatsApp:* ${formData.whatsapp}\n` +
        `🐂 *Leather Selection:* ${leatherName}\n` +
        `🎨 *Pantone / Color Code:* ${formData.colorCode}\n` +
        `📐 *Required Area:* ${formData.quantitySqft} sq.ft\n` +
        `✒️ *Debossed Logo / Text:* ${formData.customLogoText || 'None / Standard'}\n` +
        `📝 *Technical Scope:* ${formData.details || 'Standard luxury specification'}\n\n` +
        `_Generated via LuxeHide Atelier Web Application_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/8801700000000?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="custom-service" className="w-full py-20 bg-[#1C120D] border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#261A13] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{l(t.badge)}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#FDFBF7] tracking-tight">
            {l(t.title)}
          </h2>
          <p className="text-sm sm:text-base text-[#D4C5B9] mt-3 font-normal leading-relaxed">
            {l(t.subtitle)}
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-4xl mx-auto luxury-card rounded-3xl p-6 sm:p-10 bg-[#261A13] border border-[#D4AF37]/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.nameLabel)} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === 'BN' ? 'যেমন: আহমেদ ক্রাফটস বা রাফাত চৌধুরী' : 'e.g. Atelier Veloce or Marcus Sterling'}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.emailLabel)} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.whatsappLabel)} *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+880 17XX-XXXXXX / +1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
                />
              </div>

              {/* Leather Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.leatherTypeLabel)} *
                </label>
                <select
                  name="leatherTypeId"
                  value={formData.leatherTypeId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all cursor-pointer font-medium"
                >
                  {LEATHER_CATALOG.map((leather) => (
                    <option key={leather.id} value={leather.id} className="bg-[#1A110C] text-[#FDFBF7]">
                      {l(leather.name)} (MOQ: {leather.moq} sq.ft)
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Code / Pantone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.colorCodeLabel)}
                </label>
                <input
                  type="text"
                  name="colorCode"
                  value={formData.colorCode}
                  onChange={handleChange}
                  placeholder="e.g. Pantone 19-1220 TCX / Cognac Brown"
                  className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  {l(t.quantityLabel)} *
                </label>
                <input
                  type="number"
                  name="quantitySqft"
                  min="10"
                  max="10000"
                  step="10"
                  required
                  value={formData.quantitySqft}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
                />
              </div>

            </div>

            {/* Custom Logo / Debossing Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                {l(t.customLogoLabel)}
              </label>
              <input
                type="text"
                name="customLogoText"
                value={formData.customLogoText}
                onChange={handleChange}
                placeholder={language === 'BN' ? 'লোগোর টেক্সট বা হট-স্ট্যাম্প বিবরণ' : 'e.g. "ATELIER VELOCE" Hot-Foil Stamp'}
                className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
              />
            </div>

            {/* Project Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                {l(t.detailsLabel)}
              </label>
              <textarea
                name="details"
                rows={3}
                value={formData.details}
                onChange={handleChange}
                placeholder={language === 'BN' ? 'চামড়ার পুরুত্ব, প্রান্তিক ফিনিশ, ডেলিভারি সময়সূচী ও অন্যান্য শর্তাদি...' : 'Thickness requirements, edge burnishing needs, destination port, target deadline...'}
                className="w-full px-4 py-3 rounded-xl bg-[#1A110C] border border-[#D4AF37]/25 text-[#FDFBF7] text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-[#8C796C] transition-all"
              />
            </div>

            {/* Bottom Disclaimer */}
            <div className="p-3.5 rounded-xl bg-[#1F1510] border border-[#D4AF37]/20 flex items-start gap-2.5 text-xs text-[#D4C5B9]">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{l(t.note)}</span>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 px-6 rounded-2xl btn-gold text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg text-[#170F0B]"
            >
              <Send className="w-4 h-4 text-[#170F0B]" />
              <span>{l(t.submitButton)}</span>
            </motion.button>

            {submitted && (
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'BN' ? 'হোয়াটসঅ্যাপ মেসেজ উইন্ডো খোলা হয়েছে।' : 'WhatsApp inquiry window opened successfully.'}
                </span>
              </div>
            )}

          </form>
        </div>

      </div>
    </section>
  );
};
