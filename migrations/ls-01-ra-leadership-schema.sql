-- Leadership store catalog + orders.
-- Same Supabase project as ops/new-hires; new names so we never touch ra_ao_* or ra_new_hire_*.
-- Run this in the SQL editor (or via the apply script) before placing a test order.

CREATE TABLE IF NOT EXISTS ra_leadership_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  -- Size upcharges from the catalog sheet, e.g. {"2XL": 72, "3XL": 74, "4XL": 75}
  price_by_size JSONB,
  image_url TEXT,
  -- Empty/null = no size picker on the product modal.
  available_sizes TEXT[],
  size_chart_url TEXT,
  -- Optional color variants: [{"name":"Black","sku":"...","image_url":"..."}]
  available_colors JSONB,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ra_leadership_products_active ON ra_leadership_products(active);
CREATE INDEX IF NOT EXISTS idx_ra_leadership_products_sort ON ra_leadership_products(sort_order);

ALTER TABLE ra_leadership_products ENABLE ROW LEVEL SECURITY;

-- Public read so the store can list the catalog without a login.
CREATE POLICY "ra_leadership_products are viewable by everyone"
  ON ra_leadership_products FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS ra_leadership_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  -- Keep a link when the product still exists; denormalized name/sku/price survive catalog edits.
  product_id UUID REFERENCES ra_leadership_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  color TEXT,
  size TEXT,
  price NUMERIC(10, 2) NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_ra_leadership_orders_order_number ON ra_leadership_orders(order_number);
-- One store order per email (emails are stored lowercase).
CREATE UNIQUE INDEX IF NOT EXISTS idx_ra_leadership_orders_one_per_email ON ra_leadership_orders(email);
CREATE INDEX IF NOT EXISTS idx_ra_leadership_orders_created_at ON ra_leadership_orders(created_at);

ALTER TABLE ra_leadership_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ra_leadership_orders are insertable"
  ON ra_leadership_orders FOR INSERT
  WITH CHECK (true);

-- Public select so the export button can read orders until it is hidden.
CREATE POLICY "ra_leadership_orders are viewable by everyone"
  ON ra_leadership_orders FOR SELECT
  USING (true);
