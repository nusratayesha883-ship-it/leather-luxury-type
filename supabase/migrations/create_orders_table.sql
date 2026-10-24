-- ====================================================================
-- LUXEHIDE ATELIER: Supabase Orders Migration
-- File: supabase/migrations/create_orders_table.sql
-- Description: Creates the orders table with all required backend fields,
--              Row Level Security (RLS) policies, indexes, and Realtime pub.
-- ====================================================================

-- 1. Create orders table
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

  -- Companion compatibility columns for rich Atelier features
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

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow public web order creation
CREATE POLICY "Allow public order insertion" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- 5. RLS Policy: Allow public / client reading of orders
CREATE POLICY "Allow public read access" 
ON public.orders FOR SELECT 
USING (true);

-- 6. RLS Policy: Allow order status updates
CREATE POLICY "Allow order status updates" 
ON public.orders FOR UPDATE 
USING (true);

-- 7. Enable Realtime updates for live Admin Dashboard sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
