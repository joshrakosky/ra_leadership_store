-- Add Attn for the shipping team on export. Not shown to the user.
ALTER TABLE ra_ao_orders
  ADD COLUMN IF NOT EXISTS shipping_attention TEXT;
