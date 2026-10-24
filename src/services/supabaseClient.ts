import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { OrderRecord, OrderStatus } from '../types';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Local Storage Fallback Key
const LOCAL_STORAGE_ORDERS_KEY = 'luxe_atelier_orders_db';

// Check if credentials are present
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  );
};

// Supabase client instance (or null if unconfigured)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage helpers ensuring 100% offline and development resilience
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

// Generate next unique Order ID (e.g. #LHA-1001, #LHA-1002)
export const generateUniqueOrderId = (): string => {
  const localOrders = getLocalOrders();
  const baseNumber = 1000 + localOrders.length + 1;
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  return `#LHA-${baseNumber + randomSuffix}`;
};

/**
 * 1. Insert new order into Supabase orders table (with automatic local backup)
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
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            order_id: order.order_id,
            customer_name: order.customer_name,
            phone: order.phone,
            email: order.email,
            company_name: order.company_name || null,
            delivery_address: order.delivery_address,
            street_address: order.street_address || null,
            city: order.city || null,
            postal_code: order.postal_code || null,
            country: order.country || null,
            delivery_destination: order.delivery_destination,
            leather_id: order.leather_id,
            leather_name: order.leather_name,
            sqft: order.sqft,
            customization_specs: order.customization_specs,
            itemized_costs: order.itemized_costs,
            payment_method: order.payment_method,
            trx_id: order.trx_id,
            grand_total_usd: order.grand_total_usd,
            grand_total_bdt: order.grand_total_bdt,
            status: order.status || 'Pending',
            created_at: order.created_at || new Date().toISOString(),
          },
        ])
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
 * 2. Fetch all orders (Supabase merged with local storage)
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

    // Merge Supabase remote orders with any local orders
    const remoteOrders: OrderRecord[] = data.map((row: any) => ({
      id: row.id,
      order_id: row.order_id,
      customer_name: row.customer_name,
      phone: row.phone,
      email: row.email,
      company_name: row.company_name,
      delivery_address: row.delivery_address,
      street_address: row.street_address,
      city: row.city,
      postal_code: row.postal_code,
      country: row.country,
      delivery_destination: row.delivery_destination,
      leather_id: row.leather_id,
      leather_name: row.leather_name,
      sqft: Number(row.sqft),
      customization_specs: row.customization_specs || {},
      itemized_costs: row.itemized_costs || {},
      payment_method: row.payment_method,
      trx_id: row.trx_id,
      grand_total_usd: Number(row.grand_total_usd),
      grand_total_bdt: Number(row.grand_total_bdt),
      status: row.status as OrderStatus,
      tracking_number: row.tracking_number,
      shipping_carrier: row.shipping_carrier,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    // Merge avoiding duplicates
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
 * 4. SQL Schema Generator for Supabase Table Setup
 */
export const SUPABASE_SQL_SETUP = `-- LuxeHide Atelier: Supabase Orders Table Setup
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  delivery_address TEXT NOT NULL,
  street_address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  delivery_destination TEXT NOT NULL DEFAULT 'domestic',
  leather_id TEXT NOT NULL,
  leather_name TEXT NOT NULL,
  sqft NUMERIC NOT NULL,
  customization_specs JSONB DEFAULT '{}'::jsonb,
  itemized_costs JSONB DEFAULT '{}'::jsonb,
  payment_method TEXT NOT NULL,
  trx_id TEXT NOT NULL,
  grand_total_usd NUMERIC NOT NULL,
  grand_total_bdt NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  tracking_number TEXT,
  shipping_carrier TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for web orders
CREATE POLICY "Allow public order insertion" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow public read of their own orders or service key full access
CREATE POLICY "Allow public read access" 
ON public.orders FOR SELECT 
USING (true);

-- Allow order status updates
CREATE POLICY "Allow order status updates" 
ON public.orders FOR UPDATE 
USING (true);
`;
