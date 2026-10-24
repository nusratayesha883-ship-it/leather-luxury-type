export type Language = 'EN' | 'BN';
export type Currency = 'USD' | 'BDT';

export interface LocalizedString {
  en: string;
  bn: string;
}

export interface LeatherColor {
  name: LocalizedString;
  hex: string;
  code: string;
}

export interface TierPrice {
  minSqft: number;
  priceUSD: number;
  priceBDT: number;
  label: LocalizedString;
}

export interface LeatherItem {
  id: string;
  name: LocalizedString;
  category: LocalizedString;
  priceUSD: number; // e.g. 4.50 / sq.ft
  priceBDT: number; // e.g. 540 / sq.ft
  moq: number; // Minimum Order Quantity in sq.ft
  features: LocalizedString[];
  description: LocalizedString;
  tieredPricing: TierPrice[];
  colors: LeatherColor[];
  image: string;
  badge?: LocalizedString;
}

export interface CartItem {
  leather: LeatherItem;
  sqft: number;
  selectedColor: LeatherColor;
}

export interface CustomServiceRequest {
  name: string;
  email: string;
  whatsapp: string;
  leatherTypeId: string;
  colorCode: string;
  quantitySqft: number;
  customLogoText: string;
  details: string;
}

export interface UserAccount {
  name: string;
  email: string;
  companyName?: string;
  accountType: 'b2b' | 'd2c';
}

export type DeliveryDestination = 'domestic' | 'international';
export type PaymentMethodType = 'bkash' | 'nagad' | 'bank' | 'card';

export interface CustomOrderDraft {
  leatherId: string;
  sqft: number;
  totalUSD: number;
  totalBDT: number;
  colorName?: string;
  colorCode?: string;
  debossingText?: string;
  foilOption?: string;
  thickness?: string;
  notes?: string;
}

