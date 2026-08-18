-- Republic Airways Airport Operations vest orders
-- One row per order (one vest). Run in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS ra_ao_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  style TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  sku TEXT NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_attention TEXT,
  shipping_address TEXT NOT NULL,
  shipping_address2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'USA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ra_ao_orders_order_number ON ra_ao_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_ra_ao_orders_email ON ra_ao_orders(email);
CREATE INDEX IF NOT EXISTS idx_ra_ao_orders_created_at ON ra_ao_orders(created_at);

ALTER TABLE ra_ao_orders ENABLE ROW LEVEL SECURITY;

-- Public insert so the order form can save without a login.
CREATE POLICY "ra_ao_orders are insertable"
  ON ra_ao_orders FOR INSERT
  WITH CHECK (true);

-- Public select so the export button can read orders until it is hidden.
CREATE POLICY "ra_ao_orders are viewable by everyone"
  ON ra_ao_orders FOR SELECT
  USING (true);
