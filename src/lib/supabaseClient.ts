import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { OrderRecord, OrderStatus } from '../types';

// Sanitize Supabase project URL (handles trailing slashes and accidental /rest/v1)
const sanitizeSupabaseUrl = (rawUrl: string): string => {
  let url = (rawUrl || '').trim();
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (url.endsWith('/rest/v1')) {
    url = url.slice(0, -8);
  }
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

// Environment variables for Supabase Client
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Local Storage Fallback Key for offline & dev resilience
const LOCAL_STORAGE_ORDERS_KEY = 'luxe_atelier_orders_db';

/**
 * Checks whether valid Supabase credentials have been configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  );
};

/**
 * Initialized Supabase client instance using import.meta.env
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Local storage order helpers ensuring zero data loss in development or offline mode
 */
export const getLocalOrders = (): OrderRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveLocalOrders = (orders: OrderRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.warn('[LuxeHide Local Orders] Failed to save orders locally:', err);
  }
};

/**
 * Generate unique Order ID (e.g. #LHA-1001, #LHA-1002)
 */
export const generateUniqueOrderId = (): string => {
  const localOrders = getLocalOrders();
  const baseNumber = 1000 + localOrders.length + 1;
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  return `#LHA-${baseNumber + randomSuffix}`;
};

/**
 * 1. Insert new order into Supabase orders table (with automatic local backup)
 * Directly targets the schema:
 * id, order_id, customer_name, phone, email, address, country_type,
 * leather_type, sqft_quantity, customization_details, itemized_costs,
 * grand_total, payment_method, trx_id, status, created_at
 */
export const insertOrderToSupabase = async (
  order: OrderRecord
): Promise<{ success: boolean; data?: OrderRecord; error?: string }> => {
  // Always record to local storage backup first so zero data is lost
  const localList = getLocalOrders();
  const updatedLocal = [order, ...localList.filter((o) => o.order_id !== order.order_id)];
  saveLocalOrders(updatedLocal);

  // If Supabase is configured, insert into live remote database
  if (supabase) {
    try {
      const countryType =
        order.country_type ||
        (order.delivery_destination === 'domestic' ? 'Inside Bangladesh' : 'Outside Bangladesh');

      const fullAddress = order.delivery_address || order.address || '';
      const leatherType = order.leather_name || order.leather_type || 'Artisan Tannery Leather';
      const sqftQuantity = Number(order.sqft || order.sqft_quantity || 0);

      const customizationDetails = {
        color: order.customization_specs?.colorName,
        customPantone: order.customization_specs?.customPantone,
        logo_text: order.customization_specs?.logoDebossingText,
        foilOption: order.customization_specs?.foilOption,
        thickness: order.customization_specs?.thicknessOption,
        specialNotes: order.customization_specs?.specialNotes,
      };

      const grandTotal =
        order.delivery_destination === 'domestic'
          ? Number(order.grand_total_bdt)
          : Number(order.grand_total_usd);

      const payload = {
        order_id: order.order_id,
        customer_name: order.customer_name,
        phone: order.phone,
        email: order.email,
        address: fullAddress,
        delivery_address: fullAddress,
        country_type: countryType,
        delivery_destination: order.delivery_destination,
        leather_type: leatherType,
        leather_id: order.leather_id,
        leather_name: leatherType,
        sqft_quantity: sqftQuantity,
        sqft: sqftQuantity,
        customization_details: customizationDetails,
        customization_specs: order.customization_specs,
        itemized_costs: order.itemized_costs,
        grand_total: grandTotal,
        grand_total_usd: Number(order.grand_total_usd),
        grand_total_bdt: Number(order.grand_total_bdt),
        payment_method: order.payment_method,
        trx_id: order.trx_id || null,
        company_name: order.company_name || null,
        street_address: order.street_address || null,
        city: order.city || null,
        postal_code: order.postal_code || null,
        country: order.country || null,
        status: order.status || 'Pending',
        created_at: order.created_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn('[Supabase Insert Warning]', error.message);
        return { success: true, data: order, error: error.message };
      }

      return { success: true, data: (data as OrderRecord) || order };
    } catch (err: any) {
      console.warn('[Supabase Network Exception]', err);
      return { success: true, data: order, error: err?.message || 'Network exception' };
    }
  }

  // Supabase not configured in local environment: stored locally with success
  return { success: true, data: order };
};

/**
 * 2. Fetch all orders (Supabase remote database merged with local storage)
 */
export const fetchAllOrders = async (): Promise<OrderRecord[]> => {
  const localOrders = getLocalOrders();

  if (!supabase) {
    return localOrders;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('[Supabase Fetch Error]', error?.message);
      return localOrders;
    }

    // Merge Supabase remote orders with local orders
    const remoteOrders: OrderRecord[] = data.map((row: any) => {
      const address = row.address || row.delivery_address || '';
      const countryType = row.country_type || (row.delivery_destination === 'domestic' ? 'Inside Bangladesh' : 'Outside Bangladesh');
      const isDomestic = countryType === 'Inside Bangladesh' || row.delivery_destination === 'domestic';
      const leatherType = row.leather_type || row.leather_name || 'Artisan Tannery Leather';
      const sqftQty = Number(row.sqft_quantity || row.sqft || 0);

      const customSpecs = row.customization_specs || {
        colorName: row.customization_details?.color || 'Classic Tan',
        customPantone: row.customization_details?.customPantone,
        logoDebossingText: row.customization_details?.logo_text,
        foilOption: row.customization_details?.foilOption,
        thicknessOption: row.customization_details?.thickness,
        specialNotes: row.customization_details?.specialNotes,
      };

      return {
        id: row.id,
        order_id: row.order_id,
        customer_name: row.customer_name,
        phone: row.phone,
        email: row.email,
        company_name: row.company_name,
        address: address,
        delivery_address: address,
        street_address: row.street_address,
        city: row.city,
        postal_code: row.postal_code,
        country: row.country,
        country_type: countryType,
        delivery_destination: isDomestic ? 'domestic' : 'international',
        leather_type: leatherType,
        leather_id: row.leather_id || 'cowhide-01',
        leather_name: leatherType,
        sqft_quantity: sqftQty,
        sqft: sqftQty,
        customization_details: row.customization_details || customSpecs,
        customization_specs: customSpecs,
        itemized_costs: row.itemized_costs || {},
        payment_method: row.payment_method,
        trx_id: row.trx_id,
        grand_total: Number(row.grand_total || (isDomestic ? row.grand_total_bdt : row.grand_total_usd) || 0),
        grand_total_usd: Number(row.grand_total_usd || (row.grand_total && !isDomestic ? row.grand_total : 0)),
        grand_total_bdt: Number(row.grand_total_bdt || (row.grand_total && isDomestic ? row.grand_total : 0)),
        status: (row.status as OrderStatus) || 'Pending',
        tracking_number: row.tracking_number,
        shipping_carrier: row.shipping_carrier,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    // Merge avoiding duplicates by order_id
    const combinedMap = new Map<string, OrderRecord>();
    remoteOrders.forEach((o) => combinedMap.set(o.order_id, o));
    localOrders.forEach((o) => {
      if (!combinedMap.has(o.order_id)) {
        combinedMap.set(o.order_id, o);
      }
    });

    return Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err) {
    console.warn('[Supabase Fetch Catch]', err);
    return localOrders;
  }
};

/**
 * 3. Update order status in Supabase & Local Database
 */
export const updateRemoteOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  trackingNumber?: string,
  shippingCarrier?: string
): Promise<{ success: boolean; error?: string }> => {
  // Update local storage first
  const localList = getLocalOrders();
  const updatedLocal = localList.map((ord) => {
    if (ord.order_id === orderId) {
      return {
        ...ord,
        status: newStatus,
        tracking_number: trackingNumber || ord.tracking_number,
        shipping_carrier: shippingCarrier || ord.shipping_carrier,
        updated_at: new Date().toISOString(),
      };
    }
    return ord;
  });
  saveLocalOrders(updatedLocal);

  // If Supabase is connected, update remote database
  if (supabase) {
    try {
      const updatePayload: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (trackingNumber) updatePayload.tracking_number = trackingNumber;
      if (shippingCarrier) updatePayload.shipping_carrier = shippingCarrier;

      const { error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('order_id', orderId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
    }
  }

  return { success: true };
};

/**
 * 4. Real-time subscription to orders table
 */
export const subscribeToOrdersRealtime = (
  onOrderChange: () => void
): (() => void) => {
  if (!supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('orders_realtime_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      () => {
        onOrderChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * 5. Full SQL Migration Schema
 */
export const SUPABASE_SQL_SETUP = `-- ==========================================
-- LUXEHIDE ATELIER: Supabase Orders Migration
-- Table: public.orders
-- ==========================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  country_type TEXT NOT NULL DEFAULT 'Inside Bangladesh',
  leather_type TEXT NOT NULL,
  sqft_quantity NUMERIC NOT NULL,
  customization_details JSONB DEFAULT '{}'::jsonb,
  itemized_costs JSONB DEFAULT '{}'::jsonb,
  grand_total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  trx_id TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Companion compatibility columns
  company_name TEXT,
  delivery_address TEXT,
  street_address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  delivery_destination TEXT DEFAULT 'domestic',
  leather_id TEXT,
  leather_name TEXT,
  sqft NUMERIC,
  customization_specs JSONB DEFAULT '{}'::jsonb,
  grand_total_usd NUMERIC,
  grand_total_bdt NUMERIC,
  tracking_number TEXT,
  shipping_carrier TEXT
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public order insertion
CREATE POLICY "Allow public order insertion" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON public.orders FOR SELECT 
USING (true);

-- Allow status updates
CREATE POLICY "Allow order status updates" 
ON public.orders FOR UPDATE 
USING (true);

-- Enable Realtime for the orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
`;
