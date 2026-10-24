import type { LeatherItem } from '../types';

export const LEATHER_CATALOG: LeatherItem[] = [
  {
    id: 'full-grain-cowhide',
    name: {
      en: 'Full-Grain Cowhide',
      bn: 'ফুল-গ্রেইন কাউহাইড',
    },
    category: {
      en: 'Cowhide & Calf',
      bn: 'কাউহাইড ও কাফ',
    },
    priceUSD: 4.50,
    priceBDT: 540,
    moq: 50,
    image: '/images/leathers/full-grain-cowhide.jpg',
    description: {
      en: 'Unhindered natural grain cowhide showing authentic epidermal texture, offering unmatched tensile durability and rich aging patina.',
      bn: 'অক্ষত ও প্রাকৃতিক উপরিভাগের সম্পূর্ণ গ্রেইন কাউহাইড। সর্বোচ্চ স্থায়িত্ব ও চমৎকার বয়সের সাথে গাঢ় প্যাটিনার জন্য সুপরিচিত।',
    },
    features: [
      { en: 'Thickness: 1.4 - 1.6 mm (3.5 - 4.0 oz)', bn: 'পুরুত্ব: ১.৪ - ১.৬ মিমি (৩.৫ - ৪.০ আউন্স)' },
      { en: 'Temper: Semi-Firm with rich hand feel', bn: 'টেম্পার: সেমি-ফার্ম ও প্রিমিয়াম স্পর্শানুভূতি' },
      { en: 'Ideal for: Luggage, Boots, Luxury Briefcases', bn: 'উপযুক্ত: লাগেজ ব্যাগ, বুট জুতো ও এক্সিকিউটিভ ব্রিফকেস' },
    ],
    tieredPricing: [
      { minSqft: 50, priceUSD: 4.50, priceBDT: 540, label: { en: '50 - 149 sq.ft (Standard Wholesale)', bn: '৫০ - ১৪৯ বর্গফুট (স্ট্যান্ডার্ড পাইকারি)' } },
      { minSqft: 150, priceUSD: 4.25, priceBDT: 510, label: { en: '150 - 299 sq.ft (Volume Tier - 5% Off)', bn: '১৫০ - ২৯৯ বর্গফুট (৫% ভলিউম ছাড়)' } },
      { minSqft: 300, priceUSD: 4.00, priceBDT: 480, label: { en: '300+ sq.ft (Production Tier - 11% Off)', bn: '৩০০+ বর্গফুট (১১% প্রোডাকশন ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Cognac Brown', bn: 'কগনাক বাদামি' }, hex: '#5A3D28', code: 'CG-801' },
      { name: { en: 'Dark Espresso', bn: 'ডার্ক এসপ্রেসো' }, hex: '#2B1E16', code: 'ES-802' },
      { name: { en: 'Oxblood Red', bn: 'অক্সব্লাড লাল' }, hex: '#4A1521', code: 'OX-803' },
      { name: { en: 'Midnight Black', bn: 'মিডনাইট কালো' }, hex: '#1A1817', code: 'BK-804' },
    ],
    badge: { en: 'Artisan Bestseller', bn: 'বেস্টসেলার' },
    gallery: [
      {
        url: '/images/leathers/full-grain-cowhide.jpg',
        alt: { en: 'Full-Grain Cowhide Macro Grain Swatch', bn: 'ফুল-গ্রেইন কাউহাইড ম্যাক্রো গ্রেইন সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Raw Uncut Cowhide View', bn: 'সম্পূর্ণ অক্ষত কাঁচা কাউহাইড ভিউ' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Finished Luxury Briefcase Crafted from Full-Grain Cowhide', bn: 'ফুল-গ্রেইন চামড়ায় তৈরি বিলাসবহুল ব্রিফকেস' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Master Artisan Cutting Hide on Workbench', bn: 'কারিগর কর্তৃক ওয়ার্কবেঞ্চে চামড়া কাটিং' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'ku5ufpEyQOQ',
      title: {
        en: 'What is Full Grain Leather? Structure, Durability & Tannery Analysis',
        bn: 'ফুল-গ্রেইন লেদার কী? ফাইবার গঠন, স্থায়িত্ব ও ট্যানারি বিশ্লেষণ',
      },
      desc: {
        en: 'In-depth leather science breakdown inspecting genuine full-grain hide pores, tensile fiber cross-section, and natural aging patina.',
        bn: 'প্রাকৃতিক গ্রেইনের সূক্ষ্ম ছিদ্র, টেনসাইল শক্তি এবং সময়ের সাথে চমৎকার প্যাটিনা তৈরির বৈজ্ঞানিক পর্যালোচনা।',
      },
      channel: 'Tanner Leatherstein',
    },
    specs: {
      averageHideSize: { en: '20 – 25 sq.ft (Full Side / Hide)', bn: '২০ – ২৫ বর্গফুট (সম্পূর্ণ সাইড / চামড়া)' },
      thickness: { en: '1.4 – 1.6 mm (3.5 – 4.0 oz)', bn: '১.৪ – ১.৬ মিমি (৩.৫ – ৪.০ আউন্স)' },
      weight: { en: 'Approx. 4.0 oz / sq.ft (~120–130 gsm)', bn: 'প্রায় ৪.০ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Full-Grain Chrome Retan with Vegetable Mimosa Extracts', bn: 'ফুল-গ্রেইন ক্রোম রিট্যান ও উদ্ভিজ্জ মিমোসা নির্যাস' },
      temper: { en: 'Semi-Firm with Rich Natural Hand', bn: 'সেমি-ফার্ম ও প্রিমিয়াম স্পর্শানুভূতি' },
      finish: { en: 'Full Aniline Natural Wax & Light Protective Lustre', bn: 'অ্যানিলিন ন্যাচারাল ওয়াক্স ও হালকা প্রোটেক্টিভ লাস্টার' },
      bestSuitedFor: [
        { en: 'Luxury Briefcases', bn: 'এক্সিকিউটিভ ব্রিফকেস' },
        { en: 'Heritage Boots & Footwear', bn: 'হেরিটেজ বুট ও জুতো' },
        { en: 'Weekend Duffel Bags', bn: 'ট্রাভেল ডাফেল ব্যাগ' },
        { en: 'Heavy Duty Leather Goods', bn: 'টেকসই লেদার সামগ্রী' },
      ],
      origin: { en: 'Direct Tannery Supply (Dhaka Tannery Industrial Estate)', bn: 'প্রত্যক্ষ ট্যানারি সরবরাহ (সাভার ট্যানারি শিল্প নগরী)' },
      certifications: ['LWG Silver Certified', 'ISO 9001:2015', 'REACH Compliant', 'Chrome VI Free'],
    },
    seo: {
      metaTitle: 'Full Grain Cowhide Supplier - Premium Wholesale Leather | LuxeHide Atelier',
      metaDescription: 'Direct tannery wholesale full-grain cowhide leather (1.4-1.6mm / 3.5-4.0oz). Authentic epidermal grain, high tensile strength, and natural patina. Fast global shipping.',
      keywords: ['Full Grain Cowhide Supplier', 'Wholesale Full Grain Leather', 'Tannery Direct Cowhide', 'B2B Leather Supplier', 'Bangladesh Leather Tannery'],
    },
  },
  {
    id: 'italian-calfskin',
    name: {
      en: 'Italian Calfskin',
      bn: 'ইটালিয়ান কাফস্কিন',
    },
    category: {
      en: 'Cowhide & Calf',
      bn: 'কাউহাইড ও কাফ',
    },
    priceUSD: 6.00,
    priceBDT: 720,
    moq: 30,
    image: '/images/leathers/italian-calfskin.jpg',
    description: {
      en: 'Ultra-fine pore calfskin imported from Alpine tanneries. Supremely smooth, tight fiber density, favored by bespoke shoemakers and luxury watch strap ateliers.',
      bn: 'আলপাইন ট্যানারি থেকে আমদানিকৃত অতি মসৃণ ও সূক্ষ্ম ছিদ্রযুক্ত বাছুরের চামড়া। বিশ্বমানের জুতো ও লাক্সারি ঘড়ির স্ট্র্যাপের জন্য সর্বাধিক সমাদৃত।',
    },
    features: [
      { en: 'Thickness: 1.1 - 1.3 mm (2.5 - 3.2 oz)', bn: 'পুরুত্ব: ১.১ - ১.৩ মিমি (২.৫ - ৩.২ আউন্স)' },
      { en: 'Temper: Supple and silky smooth finish', bn: 'টেম্পার: কোমল, সিল্কি ও মসৃণ ফিনিশ' },
      { en: 'Ideal for: Dress shoes, Wallets, Watch straps', bn: 'উপযুক্ত: ফর্মাল ড্রেস শু, ওয়ালেট ও বিলাসবহুল ঘড়ির বেল্ট' },
    ],
    tieredPricing: [
      { minSqft: 30, priceUSD: 6.00, priceBDT: 720, label: { en: '30 - 99 sq.ft (Atelier Tier)', bn: '৩০ - ৯৯ বর্গফুট (অ্যাটেলিয়ার রেট)' } },
      { minSqft: 100, priceUSD: 5.70, priceBDT: 684, label: { en: '100 - 249 sq.ft (Studio Tier - 5% Off)', bn: '১০০ - ২৪৯ বর্গফুট (৫% ছাড়)' } },
      { minSqft: 250, priceUSD: 5.40, priceBDT: 648, label: { en: '250+ sq.ft (Bulk Tier - 10% Off)', bn: '২৫০+ বর্গফুট (১০% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Chestnut Tan', bn: 'চেস্টনাট ট্যান' }, hex: '#8B4513', code: 'IC-101' },
      { name: { en: 'Burgundy Wine', bn: 'বার্গান্ডি ওয়াইন' }, hex: '#58111A', code: 'IC-102' },
      { name: { en: 'Piano Black', bn: 'পিয়ানো ব্ল্যাক' }, hex: '#111111', code: 'IC-103' },
    ],
    badge: { en: 'Haute Horlogerie Grade', bn: 'প্রিমিয়াম কাফস্কিন' },
    gallery: [
      {
        url: '/images/leathers/italian-calfskin.jpg',
        alt: { en: 'Italian Calfskin Macro Texture Swatch', bn: 'ইটালিয়ান কাফস্কিন ম্যাক্রো টেক্সচার সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Whole Italian Calfskin Hide View', bn: 'সম্পূর্ণ ইটালিয়ান কাফস্কিন চামড়া ভিউ' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Bespoke Italian Oxford Dress Shoes Crafted from Calfskin', bn: 'কাফস্কিনে তৈরি বেসপোক অক্সফোর্ড ড্রেস শু' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Fine Leather Edge Creasing and Hand Finishing', bn: 'চামড়ার সূক্ষ্ম এজ ক্রিজিং ও ফিনিশিং' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'RDvv-q3R_V0',
      title: {
        en: 'Crafting Luxury Goods with Italian Calfskin: Hermès & Bespoke Atelier Standards',
        bn: 'ইটালিয়ান কাফস্কিন দিয়ে বিলাসবহুল চামড়ার পণ্য তৈরির কারিগরি কৌশল',
      },
      desc: {
        en: 'Master leather artisan Peter Nitz demonstrates cutting, skiving, and hand-stitching ultra-fine pore Italian calfskin.',
        bn: 'আল্ট্রা-ফাইন কাফস্কিনের সূক্ষ্ম ফাইবার, নিখুঁত কাটিং ও বিলাসবহুল হস্তশিল্প প্রদর্শনী।',
      },
      channel: 'Peter Nitz Atelier',
    },
    specs: {
      averageHideSize: { en: '12 – 15 sq.ft (Whole Calf Hide)', bn: '১২ – ১৫ বর্গফুট (সম্পূর্ণ বাছুরের চামড়া)' },
      thickness: { en: '1.1 – 1.3 mm (2.5 – 3.2 oz)', bn: '১.১ – ১.৩ মিমি (২.৫ – ৩.২ আউন্স)' },
      weight: { en: 'Approx. 2.8 oz / sq.ft (~90–100 gsm)', bn: 'প্রায় ২.৮ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Italian Mineral Drum Tanned with Supple Fatliquors', bn: 'ইটালিয়ান মিনারেল ড্রাম ট্যানিং ও সুপল ফ্যাটলিকর' },
      temper: { en: 'Supple & Silky Smooth Hand Feel', bn: 'অত্যন্ত কোমল ও মসৃণ সিল্কি স্পর্শ' },
      finish: { en: 'Semi-Aniline Glass Polish Finish', bn: 'সেমি-অ্যানিলিন গ্লাস পলিশ ফিনিশ' },
      bestSuitedFor: [
        { en: 'Haute Horlogerie Watch Straps', bn: 'বিলাসবহুল ঘড়ির বেল্ট' },
        { en: 'Bespoke Dress Footwear', bn: 'বেসপোক ড্রেস শু' },
        { en: 'Slim Designer Wallets', bn: 'স্লিম ডিজাইনার ওয়ালেট' },
        { en: 'Luxury Clutch Bags', bn: 'লাক্সারি ক্লাচ ব্যাগ' },
      ],
      origin: { en: 'Alpine Tannery Partnerships & Certified Artisan Import', bn: 'আলপাইন ট্যানারি পার্টনারশিপ ও সার্টিফাইড আমদানি' },
      certifications: ['LWG Gold Certified Tannery', 'Italian Leather Federation', 'OEKO-TEX Leather Standard'],
    },
    seo: {
      metaTitle: 'Italian Calfskin Tannery Wholesale - Premium Leather | LuxeHide Atelier',
      metaDescription: 'Source authentic Italian calfskin leather (1.1-1.3mm / 2.5-3.2oz) with ultra-fine grain. Ideal for bespoke shoes, watch straps, and luxury leather goods.',
      keywords: ['Italian Calfskin Tannery', 'Calfskin Leather Wholesale', 'Bespoke Shoemaking Leather', 'Watch Strap Calfskin', 'Luxury Fine Grain Leather'],
    },
  },
  {
    id: 'vegetable-tanned',
    name: {
      en: 'Vegetable-Tanned (Veg-Tan)',
      bn: 'ভেজিটেবল-ট্যানড (ভেজ-ট্যান)',
    },
    category: {
      en: 'Veg-Tan & Specialty',
      bn: 'ভেজিটেবল ও স্পেশালিটি',
    },
    priceUSD: 5.20,
    priceBDT: 624,
    moq: 40,
    image: '/images/leathers/vegetable-tanned.jpg',
    description: {
      en: 'Pit-tanned for 60 days using natural mimosa and chestnut barks. Chemical-free, firm temper, easily molded, burnished, and carved by hand artisans.',
      bn: 'মিমোসা ও চেস্টনাট গাছের বাকল দিয়ে ৬০ দিন পিট-ট্যানিং করা। কোনো রাসায়নিক ছাড়া তৈরি, কারুকাজ, খোদাই ও মসৃণ বার্নিশিংয়ের জন্য আদর্শ।',
    },
    features: [
      { en: 'Thickness: 1.8 - 2.2 mm (4.5 - 5.5 oz)', bn: 'পুরুত্ব: ১.৮ - ২.২ মিমি (৪.৫ - ৫.৫ আউন্স)' },
      { en: 'Temper: Firm, moldable, edge burnishable', bn: 'টেম্পার: শক্ত, ছাঁচে ঢালাইযোগ্য ও এজ বার্নিশেবল' },
      { en: 'Ideal for: Holsters, Heavy belts, Saddlery', bn: 'উপযুক্ত: চামড়ার বেল্ট, খাপ, স্যাডল ও কারিগরি পণ্য' },
    ],
    tieredPricing: [
      { minSqft: 40, priceUSD: 5.20, priceBDT: 624, label: { en: '40 - 119 sq.ft (Standard Wholesale)', bn: '৪০ - ১১৯ বর্গফুট (স্ট্যান্ডার্ড রেট)' } },
      { minSqft: 120, priceUSD: 4.90, priceBDT: 588, label: { en: '120 - 249 sq.ft (Volume Tier - 6% Off)', bn: '১২০ - ২৪৯ বর্গফুট (৬% ছাড়)' } },
      { minSqft: 250, priceUSD: 4.60, priceBDT: 552, label: { en: '250+ sq.ft (Production Tier - 11% Off)', bn: '২৫০+ বর্গফুট (১১% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Natural Vachetta', bn: 'ন্যাচারাল ভ্যাচেটা' }, hex: '#D2B48C', code: 'VT-301' },
      { name: { en: 'Honey Caramel', bn: 'হানি ক্যারামেল' }, hex: '#A75D29', code: 'VT-302' },
      { name: { en: 'Dark Chocolate', bn: 'ডার্ক চকলেট' }, hex: '#3B2317', code: 'VT-303' },
    ],
    badge: { en: '100% Eco Pit-Tanned', bn: '১০০% প্রাকৃতিক ট্যান' },
    gallery: [
      {
        url: '/images/leathers/vegetable-tanned.jpg',
        alt: { en: 'Natural Vegetable-Tanned Vachetta Macro Grain', bn: 'ন্যাচারাল ভেজিটেবল-ট্যানড ভ্যাচেটা ম্যাক্রো সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Pit-Tanned Veg-Tan Raw Side', bn: 'সম্পূর্ণ পিট-ট্যানড ভেজ-ট্যান কাঁচা চামড়া' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Hand-Carved and Burnished Veg-Tan Leather Wallet', bn: 'হাতে খোদাই ও বার্নিশ করা ভেজ-ট্যান ওয়ালেট' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Artisan Edge Beveling and Burnishing Toolwork', bn: 'কারিগর কর্তৃক এজ বেভেলিং ও বার্নিশিং' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'XvAqd-y-Qh4',
      title: {
        en: 'Historic Vegetable Tannery Tour: Pit Tanning & Natural Bark Extraction',
        bn: 'ঐতিহ্যবাহী ভেজিটেবল ট্যানারি ট্যুর: পিট ট্যানিং ও প্রাকৃতিক বাকল নিষ্কাশন',
      },
      desc: {
        en: 'Explore traditional 60-day slow pit tanning using tree bark extracts, producing firm, eco-friendly, burnishable veg-tan hides.',
        bn: 'মিমোসা ও চেস্টনাট বাকল দিয়ে ৬০ দিন ধীরগতির পিট ট্যানিং প্রক্রিয়া ও কারুকাজযোগ্য চামড়া প্রস্তুতি।',
      },
      channel: 'Weaver Leather Supply',
    },
    specs: {
      averageHideSize: { en: '22 – 26 sq.ft (Double Shoulder / Side)', bn: '২২ – ২৬ বর্গফুট (ডাবল শোল্ডার / সাইড)' },
      thickness: { en: '1.8 – 2.2 mm (4.5 – 5.5 oz)', bn: '১.৮ – ২.২ মিমি (৪.৫ – ৫.৫ আউন্স)' },
      weight: { en: 'Approx. 5.0 oz / sq.ft (~150–165 gsm)', bn: 'প্রায় ৫.০ আউন্স / বর্গফুট' },
      tanningMethod: { en: '100% Eco Pit Vegetable-Tanned (Chestnut & Mimosa Bark)', bn: '১০০% প্রাকৃতিক উদ্ভিজ্জ পিট-ট্যানড (চেস্টনাট ও মিমোসা)' },
      temper: { en: 'Firm, Moldable & High Edge Burnishability', bn: 'শক্ত, ছাঁচে রূপান্তরযোগ্য ও মসৃণ এজ বার্নিশেবল' },
      finish: { en: 'Natural Naked Aniline / Dyeable Vachetta', bn: 'ন্যাচারাল নেকেড অ্যানিলিন ও ডাই করার উপযোগী' },
      bestSuitedFor: [
        { en: 'Heavy Duty Artisan Belts', bn: 'কারিগরি হেভি ডিউটি বেল্ট' },
        { en: 'Gun Holsters & Sheaths', bn: 'গান হোলস্টার ও খাপ' },
        { en: 'Molded Wet-Formed Cases', bn: 'ওয়েট-মোল্ডেড কেস' },
        { en: 'Saddlery & Equestrian Gear', bn: 'স্যাডলারি ও ঘোড়ার সাজ' },
      ],
      origin: { en: 'Tannery Pits (Tuscan & Bengal Master Formulas)', bn: 'ঐতিহ্যবাহী ট্যানারি পিট (টাস্কান ও বেঙ্গল ফর্মুলা)' },
      certifications: ['100% Bio-Circular', 'Zero Synthetic Chrome', 'Biodegradable Leather Certification'],
    },
    seo: {
      metaTitle: 'Veg-Tan Leather Wholesale - Pit Tanned Vachetta | LuxeHide Atelier',
      metaDescription: '100% natural vegetable-tanned leather hides (1.8-2.2mm / 4.5-5.5oz). Ideal for leather carving, tooling, edge burnishing, and heavy-duty belts. Wholesale supply.',
      keywords: ['Veg-Tan Leather Wholesale', 'Vegetable Tanned Leather Supplier', 'Tooling Leather Side', 'Natural Vachetta Leather', 'Eco Pit Tanned Leather'],
    },
  },
  {
    id: 'suede-leather',
    name: {
      en: 'Suede Leather',
      bn: 'সোয়েড লেদার',
    },
    category: {
      en: 'Nubuck & Suede',
      bn: 'নুবাক ও সোয়েড',
    },
    priceUSD: 3.80,
    priceBDT: 456,
    moq: 50,
    image: '/images/leathers/suede-leather.jpg',
    description: {
      en: 'Split-layer leather with buffed nap fibers creating a plush, velvety tactile surface with consistent dye penetration throughout the cross-section.',
      bn: 'ভেলভেট বা মখমলের মতো নরম টেক্সচারযুক্ত সোয়েড লেদার। জুতো, জ্যাকেট এবং বিলাসবহুল চামড়ার অভ্যন্তরীণ লাইনিংয়ের জন্য উপযুক্ত।',
    },
    features: [
      { en: 'Thickness: 1.0 - 1.2 mm (2.5 - 3.0 oz)', bn: 'পুরুত্ব: ১.০ - ১.২ মিমি (২.৫ - ৩.০ আউন্স)' },
      { en: 'Temper: Soft, pliable, high drape', bn: 'টেম্পার: অত্যন্ত নরম ও ফ্লেক্সিবল' },
      { en: 'Ideal for: Loafers, Jackets, Luxury Lining', bn: 'উপযুক্ত: লোফার শু, জ্যাকেট ও প্রিমিয়াম ইনার লাইনিং' },
    ],
    tieredPricing: [
      { minSqft: 50, priceUSD: 3.80, priceBDT: 456, label: { en: '50 - 149 sq.ft (Wholesale MOQ)', bn: '৫০ - ১৪৯ বর্গফুট (পাইকারি রেট)' } },
      { minSqft: 150, priceUSD: 3.55, priceBDT: 426, label: { en: '150 - 299 sq.ft (Bulk Tier - 6% Off)', bn: '১৫০ - ২৯৯ বর্গফুট (৬% ছাড়)' } },
      { minSqft: 300, priceUSD: 3.30, priceBDT: 396, label: { en: '300+ sq.ft (Factory Tier - 13% Off)', bn: '৩০০+ বর্গফুট (১৩% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Sand Beige', bn: 'স্যান্ড বেইজ' }, hex: '#C2B280', code: 'SD-401' },
      { name: { en: 'Tobacco Rust', bn: 'টোব্যাকো রাস্ট' }, hex: '#713F27', code: 'SD-402' },
      { name: { en: 'Charcoal Grey', bn: 'চারকোল ধূসর' }, hex: '#3E3E3E', code: 'SD-403' },
      { name: { en: 'Navy Indigo', bn: 'নেভি ইন্ডিগো' }, hex: '#1B263B', code: 'SD-404' },
    ],
    gallery: [
      {
        url: '/images/leathers/suede-leather.jpg',
        alt: { en: 'Suede Leather Velvet Nap Macro Swatch', bn: 'সোয়েড লেদার ভেলভেট ন্যাপ ম্যাক্রো সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Plush Split Suede Raw Hide', bn: 'সম্পূর্ণ প্ল্যাশ স্প্লিট সোয়েড কাঁচা চামড়া' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Artisan Luxury Suede Loafers & Outerwear', bn: 'সোয়েড লেদারে তৈরি বিলাসবহুল লোফার ও জ্যাকেট' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Handcrafting Suede Leather Footwear', bn: 'সোয়েড লেদারের জুতো প্রস্তুতকরণ' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: '8dUHlWrlfJU',
      title: {
        en: 'What Is Suede Leather Really? Nap Structure, Grade & Fiber Analysis',
        bn: 'সোয়েড লেদার আসলে কী? ন্যাপ গঠন, গ্রেড ও ফাইবার বিশ্লেষণ',
      },
      desc: {
        en: 'Detailed examination of high-grade split suede fibers, testing plushness, dye penetration, and luxury lining applications.',
        bn: 'উন্নত মানের সোয়েডের ভেলভেটি ন্যাপ, স্থায়িত্ব এবং জুতো ও জ্যাকেটে এর ব্যবহারিক উপযোগিতা পর্যালোচনা।',
      },
      channel: 'Rose Anvil',
    },
    specs: {
      averageHideSize: { en: '15 – 18 sq.ft (Split Hide)', bn: '১৫ – ১৮ বর্গফুট (স্প্লিট চামড়া)' },
      thickness: { en: '1.0 – 1.2 mm (2.5 – 3.0 oz)', bn: '১.০ – ১.২ মিমি (২.৫ – ৩.০ আউন্স)' },
      weight: { en: 'Approx. 2.6 oz / sq.ft (~85–95 gsm)', bn: 'প্রায় ২.৬ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Chrome Split Tanned with High-Penetration Dyes', bn: 'ক্রোম স্প্লিট ট্যানড ও উচ্চ ভেদ্যতার ডাই' },
      temper: { en: 'Soft, Pliable & High Draping Quality', bn: 'নরম, অত্যন্ত ফ্লেক্সিবল ও চমৎকার ড্র্যাপ' },
      finish: { en: 'Micro-Buffed Velvet Nap Surface', bn: 'মাইক্রো-বাফড ভেলভেট ন্যাপ ফিনিশ' },
      bestSuitedFor: [
        { en: 'Italian Style Loafers', bn: 'ইটালিয়ান স্টাইল লোফার শু' },
        { en: 'Luxury Suede Jackets', bn: 'বিলাসবহুল সোয়েড জ্যাকেট' },
        { en: 'Handbag Interior Linings', bn: 'ব্যাগ ও ওয়ালেটের ইনার লাইনিং' },
        { en: 'Casual Fashion Moccasins', bn: 'ক্যাজুয়াল মোকাসিন' },
      ],
      origin: { en: 'Certified Wholesale Tannery Supply', bn: 'সার্টিফাইড পাইকারি ট্যানারি সরবরাহ' },
      certifications: ['Water-Repellent Nano Coating Option', 'REACH Tested', 'Colorfast Dye Standard'],
    },
    seo: {
      metaTitle: 'Suede Leather Supplier - Plush Velvet Wholesale Hides | LuxeHide Atelier',
      metaDescription: 'Wholesale suede leather hides (1.0-1.2mm / 2.5-3.0oz) with uniform velvet nap and deep dye penetration. Perfect for loafers, jackets, and luxury bag lining.',
      keywords: ['Suede Leather Supplier', 'Wholesale Suede Hides', 'Shoemaking Suede Leather', 'Garment Suede Leather', 'Soft Suede Material'],
    },
  },
  {
    id: 'nubuck-leather',
    name: {
      en: 'Nubuck Leather',
      bn: 'নুবাক লেদার',
    },
    category: {
      en: 'Nubuck & Suede',
      bn: 'নুবাক ও সোয়েড',
    },
    priceUSD: 4.20,
    priceBDT: 504,
    moq: 50,
    image: '/images/leathers/nubuck-leather.jpg',
    description: {
      en: 'Created from top-grain cowhide lightly sanded on the exterior surface to create fine microscopic velvet nap with superior tensile strength compared to split suede.',
      bn: 'টপ-গ্রেইন কাউহাইডের উপরিভাগ আলতোভাবে স্যান্ডিং করে প্রস্তুতকৃত। সোয়েডের চেয়ে অনেক বেশি শক্তিশালী এবং রাজকীয় টেক্সচারযুক্ত।',
    },
    features: [
      { en: 'Thickness: 1.3 - 1.5 mm (3.2 - 3.8 oz)', bn: 'পুরুত্ব: ১.৩ - ১.৫ মিমি (৩.২ - ৩.৮ আউন্স)' },
      { en: 'Temper: Medium-soft with water-repellent option', bn: 'টেম্পার: মিডিয়াম-সফট ও ওয়াটার-রেপেলেন্ট ফিনিশ' },
      { en: 'Ideal for: Outdoor boots, Handbags, Sneakers', bn: 'উপযুক্ত: আউটডোর বুট, ফ্যাশন হ্যান্ডব্যাগ ও স্নিকার্স' },
    ],
    tieredPricing: [
      { minSqft: 50, priceUSD: 4.20, priceBDT: 504, label: { en: '50 - 149 sq.ft (Standard Wholesale)', bn: '৫০ - ১৪৯ বর্গফুট (স্ট্যান্ডার্ড রেট)' } },
      { minSqft: 150, priceUSD: 3.95, priceBDT: 474, label: { en: '150 - 299 sq.ft (Volume Tier - 6% Off)', bn: '১৫০ - ২৯৯ বর্গফুট (৬% ছাড়)' } },
      { minSqft: 300, priceUSD: 3.70, priceBDT: 444, label: { en: '300+ sq.ft (Production Tier - 12% Off)', bn: '৩০০+ বর্গফুট (১২% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Timber Wheat', bn: 'টিম্বার গম-হলুদ' }, hex: '#D4A373', code: 'NB-501' },
      { name: { en: 'Olive Drab', bn: 'জলপাই সবুজ' }, hex: '#556B2F', code: 'NB-502' },
      { name: { en: 'Slate Anthracite', bn: 'স্লেট চারকোল' }, hex: '#2F3E46', code: 'NB-503' },
    ],
    gallery: [
      {
        url: '/images/leathers/nubuck-leather.jpg',
        alt: { en: 'Nubuck Leather Micro-Sanded Grain Swatch', bn: 'নুবাক লেদার মাইক্রো-স্যান্ডেড সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Top-Grain Nubuck Hide Surface', bn: 'টপ-গ্রেইন নুবাক চামড়ার সম্পূর্ণ ভিউ' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Heritage Outdoor Nubuck Leather Boots', bn: 'নুবাক লেদারে তৈরি টেকসই আউটডোর বুট' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Precision Stitching on Waterproof Nubuck', bn: 'ওয়াটারপ্রুফ নুবাকে নিখুঁত সেলাই কাজ' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'j1OVfDtHevw',
      title: {
        en: 'What is Nubuck Leather? Nubuck vs Suede Comparison & Water Resistance',
        bn: 'নুবাক লেদার কী? নুবাক ও সোয়েডের পার্থক্য এবং ওয়াটার রেজিস্ট্যান্স',
      },
      desc: {
        en: 'Comparing top-grain nubuck against split suede, demonstrating why nubuck has superior tensile strength and durability for footwear.',
        bn: 'টপ-গ্রেইন নুবাকের উচ্চ স্থায়িত্ব, ওয়াটার-প্রুফিং ক্ষমতা এবং কেন এটি আউটডোর বুটের জন্য শ্রেষ্ঠ।',
      },
      channel: 'Stridewise',
    },
    specs: {
      averageHideSize: { en: '20 – 24 sq.ft (Top-Grain Side)', bn: '২০ – ২৪ বর্গফুট (টপ-গ্রেইন সাইড)' },
      thickness: { en: '1.3 – 1.5 mm (3.2 – 3.8 oz)', bn: '১.৩ – ১.৫ মিমি (৩.২ – ৩.৮ আউন্স)' },
      weight: { en: 'Approx. 3.5 oz / sq.ft (~110–120 gsm)', bn: 'প্রায় ৩.৫ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Top-Grain Chrome Tanned with Hydrophobic Oils', bn: 'টপ-গ্রেইন ক্রোম ট্যানড ও হাইড্রোফোবিক অয়েল' },
      temper: { en: 'Medium-Soft with High Tensile Recovery', bn: 'মিডিয়াম-সফট ও উচ্চ টেনসাইল শক্তি' },
      finish: { en: 'Exterior Grain Sanded Ultra-Fine Nap', bn: 'বাইরের পৃষ্ঠে আলতো স্যান্ডেড সূক্ষ্ম ন্যাপ' },
      bestSuitedFor: [
        { en: 'Outdoor Hiking & Work Boots', bn: 'আউটডোর হাইকিং ও ওয়ার্ক বুট' },
        { en: 'Designer Sneakers', bn: 'ডিজাইনার স্নিকার্স' },
        { en: 'Tactile Handbags', bn: 'ফ্যাশনেবল হ্যান্ডব্যাগ' },
        { en: 'Contemporary Furniture', bn: 'আধুনিক আসবাব' },
      ],
      origin: { en: 'Premium Tannery Batch Sourced', bn: 'প্রিমিয়াম ট্যানারি ব্যাচ সরবরাহ' },
      certifications: ['Scotchgard Compatible', 'LWG Certified', 'High Abrasion Resistance'],
    },
    seo: {
      metaTitle: 'Nubuck Leather Wholesale - Waterproof Top-Grain | LuxeHide Atelier',
      metaDescription: 'Buy top-grain nubuck leather (1.3-1.5mm / 3.2-3.8oz). Microscopic velvet feel with superior strength compared to suede. Fast B2B bulk export.',
      keywords: ['Nubuck Leather Wholesale', 'Waterproof Nubuck Supplier', 'Top Grain Nubuck Hides', 'Bootmaker Nubuck Leather', 'Timber Wheat Nubuck'],
    },
  },
  {
    id: 'crazy-horse-leather',
    name: {
      en: 'Crazy Horse Leather',
      bn: 'ক্রেজি হর্স লেদার',
    },
    category: {
      en: 'Veg-Tan & Specialty',
      bn: 'ভেজিটেবল ও স্পেশালিটি',
    },
    priceUSD: 4.00,
    priceBDT: 480,
    moq: 40,
    image: '/images/leathers/crazy-horse-leather.jpg',
    description: {
      en: 'Full-grain cowhide infused with specially formulated natural wax. Rubbing alters the tone to produce an instant vintage heritage look that self-heals over time.',
      bn: 'প্রাকৃতিক মোমে নিমজ্জিত ফুল-গ্রেইন কাউহাইড। ঘষা লাগলে রঙের পরিবর্তন হয়ে তাৎক্ষণিক ভিন্টেজ শেড তৈরি করে যা সময়ের সাথে আরও আকর্ষণীয় হয়ে ওঠে।',
    },
    features: [
      { en: 'Thickness: 1.6 - 1.8 mm (4.0 - 4.5 oz)', bn: 'পুরুত্ব: ১.৬ - ১.৮ মিমি (৪.০ - ৪.৫ আউন্স)' },
      { en: 'Temper: Robust, wax-burst vintage patina', bn: 'টেম্পার: টেকসই ও ওয়াক্স-বার্স্ট ভিন্টেজ ফিনিশ' },
      { en: 'Ideal for: Messenger bags, Journals, Rugged boots', bn: 'উপযুক্ত: মেসেঞ্জার ব্যাগ, ডায়েরি কভার ও রুক্ষ বুট' },
    ],
    tieredPricing: [
      { minSqft: 40, priceUSD: 4.00, priceBDT: 480, label: { en: '40 - 119 sq.ft (Wholesale MOQ)', bn: '৪০ - ১১৯ বর্গফুট (পাইকারি রেট)' } },
      { minSqft: 120, priceUSD: 3.75, priceBDT: 450, label: { en: '120 - 249 sq.ft (Bulk Tier - 6% Off)', bn: '১২০ - ২৪৯ বর্গফুট (৬% ছাড়)' } },
      { minSqft: 250, priceUSD: 3.50, priceBDT: 420, label: { en: '250+ sq.ft (Factory Tier - 12% Off)', bn: '২৫০+ বর্গফুট (১২% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Saddle Tan', bn: 'স্যাডল ট্যান' }, hex: '#9E6238', code: 'CH-601' },
      { name: { en: 'Vintage Amber', bn: 'ভিন্টেজ অ্যাম্বার' }, hex: '#B87333', code: 'CH-602' },
      { name: { en: 'Dark Rustic Brown', bn: 'ডার্ক রাস্টিক ব্রাউন' }, hex: '#3E2723', code: 'CH-603' },
    ],
    badge: { en: 'Wax-Infused Vintage', bn: 'ওয়াক্স-ইনফিউজড' },
    gallery: [
      {
        url: '/images/leathers/crazy-horse-leather.jpg',
        alt: { en: 'Crazy Horse Wax-Infused Macro Swatch', bn: 'ক্রেজি হর্স ওয়াক্স-ইনফিউজড ম্যাক্রো সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Vintage Saddle Tan Cowhide', bn: 'সম্পূর্ণ ভিন্টেজ স্যাডল ট্যান কাউহাইড ভিউ' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Vintage Crazy Horse Messenger Bag & Journal Cover', bn: 'ক্রেজি হর্স লেদারে তৈরি ভিন্টেজ মেসেঞ্জার ব্যাগ' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Wax Burnishing and Pull-Up Scratch Test', bn: 'ওয়াক্স বার্নিশিং ও পুল-আপ স্ক্র্যাচ টেস্ট' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'HssIowPDEJw',
      title: {
        en: 'Handcrafting with Authentic Crazy Horse Leather - Pull-up Wax Burst & Patina',
        bn: 'ক্রেজি হর্স লেদার দিয়ে কারিগরি - ওয়াক্স বার্স্ট ও প্যাটিনা প্রদর্শন',
      },
      desc: {
        en: 'Watch crazy horse leather in action: see how rubbing transforms the tones and self-heals scratches, creating an instant vintage heirloom.',
        bn: 'ক্রেজি হর্স লেদারের ওয়াক্স বার্স্ট, স্ক্র্যাচ প্রতিরোধ এবং সময়ের সাথে অনন্য ভিন্টেজ লুক তৈরি হওয়ার প্রমাণ।',
      },
      channel: 'WUTA Leathercraft',
    },
    specs: {
      averageHideSize: { en: '20 – 25 sq.ft (Full Side)', bn: '২০ – ২৫ বর্গফুট (সম্পূর্ণ সাইড)' },
      thickness: { en: '1.6 – 1.8 mm (4.0 – 4.5 oz)', bn: '১.৬ – ১.৮ মিমি (৪.০ – ৪.৫ আউন্স)' },
      weight: { en: 'Approx. 4.2 oz / sq.ft (~130–140 gsm)', bn: 'প্রায় ৪.২ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Oil & High-Melting Microcrystalline Wax Infusion', bn: 'তেল ও বিশেষ প্রাকৃতিক মোম ইনফিউশন' },
      temper: { en: 'Robust, Medium-Firm with Self-Healing Pull-Up', bn: 'রোবাস্ট, মিডিয়াম-ফার্ম ও সেলফ-হিলিং ওয়াক্স' },
      finish: { en: 'Distressed Vintage Pull-Up Surface', bn: 'ডিসট্রেসড ভিন্টেজ পুল-আপ সারফেস' },
      bestSuitedFor: [
        { en: 'Vintage Messenger Bags', bn: 'ভিন্টেজ মেসেঞ্জার ব্যাগ' },
        { en: 'Heirloom Journal & Book Covers', bn: 'ডায়েরি ও বুক কভার' },
        { en: 'Rugged Biker Boots', bn: 'রুক্ষ বাইকার বুট' },
        { en: 'Durable Knife Sheaths', bn: 'টেকসই নাইফ শিথ' },
      ],
      origin: { en: 'Artisan Tannery Direct (Heritage Wax Recipe)', bn: 'ঐতিহ্যবাহী ওয়াক্স ফর্মুলায় প্রস্তুত ট্যানারি চামড়া' },
      certifications: ['Chemical Free Wax', 'Heavy Duty Tensile Approved', 'ISO 9001'],
    },
    seo: {
      metaTitle: 'Crazy Horse Leather Supplier - Vintage Waxed Leather | LuxeHide Atelier',
      metaDescription: 'Direct supplier of authentic crazy horse leather (1.6-1.8mm / 4.0-4.5oz). Specially wax-infused full-grain cowhide that self-heals and forms unmatched vintage patina.',
      keywords: ['Crazy Horse Leather Supplier', 'Waxed Leather Wholesale', 'Distressed Leather Hides', 'Vintage Patina Leather', 'Crazy Horse Cowhide'],
    },
  },
  {
    id: 'pull-up-leather',
    name: {
      en: 'Pull-Up Leather',
      bn: 'পুল-আপ লেদার',
    },
    category: {
      en: 'Veg-Tan & Specialty',
      bn: 'ভেজিটেবল ও স্পেশালিটি',
    },
    priceUSD: 4.50,
    priceBDT: 540,
    moq: 40,
    image: '/images/leathers/pull-up-leather.jpg',
    description: {
      en: 'Aniline dyed and saturated with heavy oils and waxes. When pulled or stretched, lighter undertones burst through, creating a rich dynamic two-tone effect.',
      bn: 'তেল ও মোমে সম্পৃক্ত অ্যানিলিন ডাইড চামড়া। চামড়াটি বাঁকালে বা টানলে ভেতরের উজ্জ্বল আভা ফুটে ওঠে, যা প্রিমিয়াম ডুয়েল-টোন লুক সৃষ্টি করে।',
    },
    features: [
      { en: 'Thickness: 1.5 - 1.7 mm (3.8 - 4.2 oz)', bn: 'পুরুত্ব: ১.৫ - ১.৭ মিমি (৩.৮ - ৪.২ আউন্স)' },
      { en: 'Temper: Medium-supple with high pull-up burst', bn: 'টেম্পার: মিডিয়াম-নরম ও চমকপ্রদ পুল-আপ শেড' },
      { en: 'Ideal for: Chesterfield sofas, Duffels, Wallets', bn: 'উপযুক্ত: চেস্টারফিল্ড সোফা, ডাফেল ব্যাগ ও ওয়ালেট' },
    ],
    tieredPricing: [
      { minSqft: 40, priceUSD: 4.50, priceBDT: 540, label: { en: '40 - 119 sq.ft (Standard Wholesale)', bn: '৪০ - ১১৯ বর্গফুট (স্ট্যান্ডার্ড রেট)' } },
      { minSqft: 120, priceUSD: 4.20, priceBDT: 504, label: { en: '120 - 249 sq.ft (Volume Tier - 6% Off)', bn: '১২০ - ২৪৯ বর্গফুট (৬% ছাড়)' } },
      { minSqft: 250, priceUSD: 3.90, priceBDT: 468, label: { en: '250+ sq.ft (Production Tier - 13% Off)', bn: '২৫০+ বর্গফুট (১৩% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Bourbon Mahogany', bn: 'বোরবন মেহগনি' }, hex: '#632A1C', code: 'PU-701' },
      { name: { en: 'Havana Cognac', bn: 'হাভানা কগনাক' }, hex: '#7E4826', code: 'PU-702' },
      { name: { en: 'Forest Pine', bn: 'ফরেস্ট পাইন গ্রিন' }, hex: '#1E352F', code: 'PU-703' },
    ],
    gallery: [
      {
        url: '/images/leathers/pull-up-leather.jpg',
        alt: { en: 'Pull-Up Leather Dynamic Color Burst Swatch', bn: 'পুল-আপ লেদার কালার বার্স্ট ম্যাক্রো সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Oil-Saturated Pull-Up Leather Side', bn: 'সম্পূর্ণ অয়েল-স্যাচুরেটেড পুল-আপ চামড়া' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Luxury Pull-Up Leather Travel Duffel Bag', bn: 'পুল-আপ লেদারে তৈরি ট্রাভেল ডাফেল ব্যাগ' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Chesterfield Upholstery with Deep Pull-Up Grain', bn: 'চেস্টারফিল্ড সোফা আপহোলস্টারি ফিনিশিং' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'w7oCj3UxZQk',
      title: {
        en: 'What is Oil Pull Up Leather | Tannery Crafting & Dynamic Two-Tone Burst',
        bn: 'অয়েল পুল-আপ লেদার কী | ট্যানারি প্রসেস ও ডুয়েল-টোন বার্স্ট',
      },
      desc: {
        en: 'Demonstrating the dynamic color shift of pull-up leather when folded or flexed, revealing lighter undertones and lustrous rich oils.',
        bn: 'চামড়া বাঁকালে বা টানলে ভেতরের উজ্জ্বল আভা ফুটে ওঠার চমৎকার ডুয়েল-টোন বৈশিষ্ট্য বিশ্লেষণ।',
      },
      channel: 'WildWoven Leather',
    },
    specs: {
      averageHideSize: { en: '21 – 25 sq.ft (Full Hide)', bn: '২১ – ২৫ বর্গফুট (সম্পূর্ণ চামড়া)' },
      thickness: { en: '1.5 – 1.7 mm (3.8 – 4.2 oz)', bn: '১.৫ – ১.৭ মিমি (৩.৮ – ৪.২ আউন্স)' },
      weight: { en: 'Approx. 4.0 oz / sq.ft (~125–135 gsm)', bn: 'প্রায় ৪.০ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Aniline Dyed & Hot-Stuffed with Natural Oils & Tallow', bn: 'অ্যানিলিন ডাইড ও হট-স্টাফড প্রাকৃতিক তেল' },
      temper: { en: 'Supple Medium with Vibrant Two-Tone Burst', bn: 'নরম মিডিয়াম ও প্রাণবন্ত ডুয়েল-টোন শেড' },
      finish: { en: 'Full Aniline Semi-Gloss Natural Wax', bn: 'ফুল অ্যানিলিন সেমি-গ্লস ন্যাচারাল ওয়াক্স' },
      bestSuitedFor: [
        { en: 'Chesterfield & Luxury Sofas', bn: 'চেস্টারফিল্ড ও বিলাসবহুল সোফা' },
        { en: 'Weekender Travel Bags', bn: 'উইকেন্ডার ট্রাভেল ব্যাগ' },
        { en: 'Artisan Wallets', bn: 'কারিগরি ওয়ালেট' },
        { en: 'High-End Upholstery', bn: 'প্রিমিয়াম আপহোলস্টারি' },
      ],
      origin: { en: 'Master Tannery Hot-Stuffing Facility', bn: 'মাস্টার ট্যানারি হট-স্টাফিং সুবিধা' },
      certifications: ['Chromexcel Style Hot Stuffing', 'REACH Compliant', 'Non-Toxic Wax Oils'],
    },
    seo: {
      metaTitle: 'Pull-Up Leather Wholesale - Oil Tanned Two-Tone | LuxeHide Atelier',
      metaDescription: 'Wholesale pull-up leather hides (1.5-1.7mm / 3.8-4.2oz). Aniline dyed and hot-stuffed with oils for an extraordinary dynamic two-tone burst effect.',
      keywords: ['Pull-Up Leather Wholesale', 'Oil Tanned Leather Supplier', 'Aniline Pull Up Hide', 'Two-Tone Leather', 'Upholstery Pull Up Leather'],
    },
  },
  {
    id: 'sheepskin-lambskin',
    name: {
      en: 'Sheepskin / Lambskin',
      bn: 'শিপস্কিন / ল্যাম্বস্কিন',
    },
    category: {
      en: 'Exotic & Grain',
      bn: 'এক্সোটিক ও গ্রেইন',
    },
    priceUSD: 3.50,
    priceBDT: 420,
    moq: 60,
    image: '/images/leathers/sheepskin-lambskin.jpg',
    description: {
      en: 'Exceptionally soft and lightweight hide with fine natural grain and supreme flexibility. Ideal for bespoke garment tailoring and luxury glove craft.',
      bn: 'অসাধারণ নরম ও হালকা চামড়া, যার সূক্ষ্ম টেক্সচার এবং অসাধারণ স্থিতিস্থাপকতা রয়েছে। প্রিমিয়াম জ্যাকেট, গ্লাভস ও বিলাসবহুল পোশাকের জন্য অনন্য।',
    },
    features: [
      { en: 'Thickness: 0.7 - 0.9 mm (1.8 - 2.2 oz)', bn: 'পুরুত্ব: ০.৭ - ০.৯ মিমি (১.৮ - ২.২ আউন্স)' },
      { en: 'Temper: Featherlight, ultra-pliable and buttery', bn: 'টেম্পার: অত্যন্ত হালকা ও মাখনের মতো কোমল' },
      { en: 'Ideal for: Leather jackets, Gloves, Handbag lining', bn: 'উপযুক্ত: চামড়ার জ্যাকেট, গ্লাভস ও ব্যাগের লাইনিং' },
    ],
    tieredPricing: [
      { minSqft: 60, priceUSD: 3.50, priceBDT: 420, label: { en: '60 - 149 sq.ft (Wholesale MOQ)', bn: '৬০ - ১৪৯ বর্গফুট (পাইকারি রেট)' } },
      { minSqft: 150, priceUSD: 3.25, priceBDT: 390, label: { en: '150 - 299 sq.ft (Bulk Tier - 7% Off)', bn: '১৫০ - ২৯৯ বর্গফুট (৭% ছাড়)' } },
      { minSqft: 300, priceUSD: 3.00, priceBDT: 360, label: { en: '300+ sq.ft (Garment Factory Tier - 14% Off)', bn: '৩০০+ বর্গফুট (১৪% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Butter Cream', bn: 'বাটার ক্রিম' }, hex: '#E6D7C3', code: 'SK-801' },
      { name: { en: 'Castagna Brown', bn: 'ক্যাস্টাগনা ব্রাউন' }, hex: '#4E3127', code: 'SK-802' },
      { name: { en: 'Midnight Jet', bn: 'মিডনাইট জেট কালো' }, hex: '#141414', code: 'SK-803' },
    ],
    gallery: [
      {
        url: '/images/leathers/sheepskin-lambskin.jpg',
        alt: { en: 'Lambskin Buttery Soft Texture Swatch', bn: 'ল্যাম্বস্কিন মাখনের মতো নরম টেক্সচার সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Lightweight Lambskin Pelts', bn: 'সম্পূর্ণ হালকা ল্যাম্বস্কিন পেল্টস' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Tailored Luxury Lambskin Biker Jacket', bn: 'ল্যাম্বস্কিনে তৈরি বিলাসবহুল লেদার জ্যাকেট' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Couture Needlework on Soft Lambskin', bn: 'কোমল ল্যাম্বস্কিনে নিখুঁত সুই-সুতার কাজ' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: '7mjFEvi85Ug',
      title: {
        en: 'Lambskin vs Cowhide for Luxury Jackets & Garment Flexibility',
        bn: 'ল্যাম্বস্কিন বনাম কাউহাইড: বিলাসবহুল জ্যাকেট ও পোশাকের নমনীয়তা',
      },
      desc: {
        en: 'Comparing lambskin drape and buttery softness against cowhide, showing why top fashion houses choose lambskin for garments and gloves.',
        bn: 'মাখনের মতো মসৃণ টেক্সচার, হালকা ওজন এবং পোশাক তৈরিতে ল্যাম্বস্কিনের শ্রেষ্ঠত্ব।',
      },
      channel: 'Master Tailor Leather',
    },
    specs: {
      averageHideSize: { en: '7 – 10 sq.ft (Per Whole Skin Pelt)', bn: '৭ – ১০ বর্গফুট (প্রতিটি সম্পূর্ণ স্কিন)' },
      thickness: { en: '0.7 – 0.9 mm (1.8 – 2.2 oz)', bn: '০.৭ – ০.৯ মিমি (১.৮ – ২.২ আউন্স)' },
      weight: { en: 'Approx. 1.8 oz / sq.ft (~60–70 gsm)', bn: 'প্রায় ১.৮ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Glacé Chrome Drum Tanned with Ultra-Soft Emollients', bn: 'গ্লাসে ক্রোম ড্রাম ট্যানড ও আল্ট্রা-সফট ইমোলিয়েন্ট' },
      temper: { en: 'Featherlight, Ultra-Pliable & Buttery Soft', bn: 'অত্যন্ত হালকা, ফ্লেক্সিবল ও মাখনের মতো নরম' },
      finish: { en: 'Pure Aniline Silky Touch Finish', bn: 'পিওর অ্যানিলিন সিল্কি টাচ ফিনিশ' },
      bestSuitedFor: [
        { en: 'Tailored Leather Jackets', bn: 'টেইলর্ড লেদার জ্যাকেট' },
        { en: 'Haute Couture Gloves', bn: 'বিলাসবহুল হ্যান্ড গ্লাভস' },
        { en: 'Luxury Handbag Linings', bn: 'হ্যান্ডব্যাগ লাইনিং' },
        { en: 'Designer Apparel', bn: 'ডিজাইনার পোশাক' },
      ],
      origin: { en: 'Finest Garment Grade Tannery Supply', bn: 'পোশাক শিল্পের উপযোগী সর্বোচ্চ মানের চামড়া' },
      certifications: ['OEKO-TEX Class 1 Safe', 'Skin Contact Certified', 'Zero Harsh Chemicals'],
    },
    seo: {
      metaTitle: 'Lambskin Leather Supplier - Buttery Soft Garment Pelts | LuxeHide Atelier',
      metaDescription: 'Wholesale lambskin and sheepskin leather pelts (0.7-0.9mm / 1.8-2.2oz). Ultra-lightweight, supple, and buttery soft for luxury jackets and gloves.',
      keywords: ['Lambskin Leather Supplier', 'Sheepskin Pelts Wholesale', 'Garment Leather Supplier', 'Buttery Soft Leather', 'Jacket Leather Wholesale'],
    },
  },
  {
    id: 'embossed-crocodile-ostrich',
    name: {
      en: 'Embossed Crocodile / Ostrich Grain',
      bn: 'এমবস্‌ড ক্রোকোডাইল / অস্ট্রিচ গ্রেইন',
    },
    category: {
      en: 'Exotic & Grain',
      bn: 'এক্সোটিক ও গ্রেইন',
    },
    priceUSD: 5.00,
    priceBDT: 600,
    moq: 30,
    image: '/images/leathers/embossed-crocodile-ostrich.jpg',
    description: {
      en: 'High-pressure hydraulic plate-embossed top-grain leather featuring intricate 3D reptilian scales and quill textures with hand-tipping two-tone coloring.',
      bn: 'হাইড্রোলিক প্লেট প্রেসারের মাধ্যমে নিখুঁত থ্রিডি কুমির বা অস্ট্রিচ পাখির টেক্সচার সমৃদ্ধ। দুই রঙের হ্যান্ড-টিপিং ফিনিশ যা রাজকীয় আভিজাত্য এনে দেয়।',
    },
    features: [
      { en: 'Thickness: 1.3 - 1.5 mm (3.2 - 3.8 oz)', bn: 'পুরুত্ব: ১.৩ - ১.৫ মিমি (৩.২ - ৩.৮ আউন্স)' },
      { en: 'Temper: Semi-firm dimensional scale relief', bn: 'টেম্পার: সেমি-ফার্ম ও বাস্তবসম্মত ৩ডি রিলিফ' },
      { en: 'Ideal for: Luxury clutches, Exotic footwear, Belts', bn: 'উপযুক্ত: লাক্সারি ক্লাচ ব্যাগ, এক্সোটিক জুতো ও প্রিমিয়াম বেল্ট' },
    ],
    tieredPricing: [
      { minSqft: 30, priceUSD: 5.00, priceBDT: 600, label: { en: '30 - 99 sq.ft (Standard Wholesale)', bn: '৩০ - ৯৯ বর্গফুট (স্ট্যান্ডার্ড রেট)' } },
      { minSqft: 100, priceUSD: 4.70, priceBDT: 564, label: { en: '100 - 249 sq.ft (Volume Tier - 6% Off)', bn: '১০০ - ২৪৯ বর্গফুট (৬% ছাড়)' } },
      { minSqft: 250, priceUSD: 4.40, priceBDT: 528, label: { en: '250+ sq.ft (Production Tier - 12% Off)', bn: '২৫০+ বর্গফুট (১২% ছাড়)' } },
    ],
    colors: [
      { name: { en: 'Emerald Green Croc', bn: 'পান্না সবুজ ক্রোক' }, hex: '#1B4D3E', code: 'EX-901' },
      { name: { en: 'Cognac Scale', bn: 'কগনাক স্কেল' }, hex: '#7A3816', code: 'EX-902' },
      { name: { en: 'Gloss Onyx Black', bn: 'গ্লস অনিক্স কালো' }, hex: '#181818', code: 'EX-903' },
    ],
    badge: { en: '3D Exotic Texture', bn: 'এক্সোটিক ৩ডি ফিনিশ' },
    gallery: [
      {
        url: '/images/leathers/embossed-crocodile-ostrich.jpg',
        alt: { en: 'Embossed Crocodile 3D Scale Swatch', bn: 'এমবস্‌ড ক্রোকোডাইল ৩ডি স্কেল সোয়াচ' },
        label: { en: 'Macro Texture Swatch', bn: 'ম্যাক্রো টেক্সচার সোয়াচ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Full Hydraulic Plate Embossed Crocodile Hide', bn: 'হাইড্রোলিক প্লেট এমবস্‌ড ক্রোকোডাইল চামড়া' },
        label: { en: 'Full Raw Hide View', bn: 'সম্পূর্ণ কাঁচা চামড়ার ভিউ' },
      },
      {
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Luxury Crocodile Pattern Designer Handbag', bn: 'ক্রোকোডাইল প্যাটার্নে তৈরি ডিজাইনার হ্যান্ডব্যাগ' },
        label: { en: 'Finished Atelier Product', bn: 'ফিনিশড বেসপোক পণ্য' },
      },
      {
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
        alt: { en: 'Hand-Glazed Scale Edge Finishing', bn: 'হাতে চকচকে গ্লেজ স্কেল ফিনিশিং' },
        label: { en: 'Artisan Workbench', bn: 'কারিগর ওয়ার্কবেঞ্চ' },
      },
    ],
    video: {
      youtubeId: 'hozY3wDAteY',
      title: {
        en: 'Bespoke Crocodile Embossed Leather Craft & 3D Texture Finishing',
        bn: 'বেসপোক ক্রোকোডাইল এমবস্‌ড লেদার ক্রাফট ও ৩ডি টেক্সচার ফিনিশিং',
      },
      desc: {
        en: 'Watch artisan precision crafting with hydraulic embossed reptilian leather, demonstrating hand-tipping two-tone coloring and high durability.',
        bn: 'হাইড্রোলিক প্লেট প্রেসারের মাধ্যমে নিখুঁত থ্রিডি কুমির টেক্সচার এবং দুই রঙের হ্যান্ড-টিপিং ফিনিশ তৈরি।',
      },
      channel: 'Artisan Leather Studio',
    },
    specs: {
      averageHideSize: { en: '18 – 22 sq.ft (Hydraulic Plate Pressed)', bn: '১৮ – ২২ বর্গফুট (হাইড্রোলিক প্লেট প্রেসড)' },
      thickness: { en: '1.3 – 1.5 mm (3.2 – 3.8 oz)', bn: '১.৩ – ১.৫ মিমি (৩.২ – ৩.৮ আউন্স)' },
      weight: { en: 'Approx. 3.4 oz / sq.ft (~110–120 gsm)', bn: 'প্রায় ৩.৪ আউন্স / বর্গফুট' },
      tanningMethod: { en: 'Chrome Tanned with High-Pressure Hydraulic 3D Mold Plates', bn: 'ক্রোম ট্যানড ও উচ্চচাপ হাইড্রোলিক ৩ডি প্লেট মোল্ড' },
      temper: { en: 'Semi-Firm with Dimensional Scale Rigidity', bn: 'সেমি-ফার্ম ও বাস্তবসম্মত ৩ডি স্কেল টেক্সচার' },
      finish: { en: 'Hand-Tipped Two-Tone Glaze Finish', bn: 'হ্যান্ড-টিপড ডুয়েল টোন গ্লেজ ফিনিশ' },
      bestSuitedFor: [
        { en: 'Luxury Clutch Bags & Purses', bn: 'লাক্সারি ক্লাচ ব্যাগ ও পার্স' },
        { en: 'Exotic Accent Footwear', bn: 'এক্সোটিক ফ্যাশন জুতো' },
        { en: 'High-Status Statement Belts', bn: 'আভিজাত্যপূর্ণ স্টেটমেন্ট বেল্ট' },
        { en: 'Cigar Cases & Watch Boxes', bn: 'সিগার কেস ও ওয়াচ বক্স' },
      ],
      origin: { en: 'Specialty Finishing Tannery Atelier', bn: 'স্পেশালিটি ফিনিশিং ট্যানারি অ্যাটেলিয়ার' },
      certifications: ['Cruelty-Free Embossed Cowhide', 'CITES Non-Restricted', 'LWG Certified Base'],
    },
    seo: {
      metaTitle: 'Embossed Crocodile Leather - Exotic 3D Wholesale Hides | LuxeHide Atelier',
      metaDescription: 'Hydraulic plate embossed crocodile and ostrich leather hides (1.3-1.5mm / 3.2-3.8oz). Luxury two-tone hand tipping for bags, shoes, and belts. Fast shipping.',
      keywords: ['Embossed Crocodile Leather', 'Exotic Leather Wholesale', 'Croc Pattern Cowhide', 'Faux Croc Leather Hides', 'Ostrich Grain Leather'],
    },
  },
];
