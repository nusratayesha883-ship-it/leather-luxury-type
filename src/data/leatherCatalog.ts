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
  },
];
