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

export interface LeatherSpecs {
  averageHideSize: LocalizedString;
  thickness: LocalizedString;
  weight: LocalizedString;
  tanningMethod: LocalizedString;
  temper: LocalizedString;
  finish: LocalizedString;
  bestSuitedFor: LocalizedString[];
  origin: LocalizedString;
  certifications: string[];
}

export interface LeatherVideo {
  youtubeId: string;
  title: LocalizedString;
  desc: LocalizedString;
  channel: string;
}

export interface LeatherGalleryImage {
  url: string;
  alt: LocalizedString;
  label: LocalizedString;
}

export interface LeatherSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
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
  specs?: LeatherSpecs;
  video?: LeatherVideo;
  gallery?: LeatherGalleryImage[];
  seo?: LeatherSEO;
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

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderCustomizationSpecs {
  colorName: string;
  customPantone?: string;
  logoDebossingText?: string;
  foilOption?: string;
  thicknessOption?: string;
  specialNotes?: string;
}

export interface OrderItemizedCosts {
  leatherUnitPriceUSD?: number;
  leatherUnitPriceBDT?: number;
  baseLeatherUSD: number;
  baseLeatherBDT: number;
  customizationFeeUSD: number;
  customizationFeeBDT: number;
  deliveryFeeUSD: number;
  deliveryFeeBDT: number;
  deliveryRateNote?: string;
  currencySelected?: string;
}

export interface OrderRecord {
  id?: string;
  order_id: string; // e.g. #LHA-1001
  customer_name: string;
  phone: string;
  email: string;
  company_name?: string;
  delivery_address: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  delivery_destination: DeliveryDestination;
  leather_id: string;
  leather_name: string;
  sqft: number;
  customization_specs: OrderCustomizationSpecs;
  itemized_costs: OrderItemizedCosts;
  payment_method: PaymentMethodType;
  trx_id: string;
  grand_total_usd: number;
  grand_total_bdt: number;
  status: OrderStatus;
  tracking_number?: string;
  shipping_carrier?: string;
  created_at: string;
  updated_at?: string;
  synced_to_sheets?: boolean;
  confirmation_email_sent?: boolean;
  delivered_email_sent?: boolean;
}

