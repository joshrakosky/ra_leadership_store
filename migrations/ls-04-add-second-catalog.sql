-- Add the second catalog drop. Price is unused on the storefront; 0 keeps the NOT NULL column happy.
-- Re-run safely: upserts on sku.

INSERT INTO ra_leadership_products (
  name,
  sku,
  price,
  image_url,
  available_sizes,
  available_colors,
  price_by_size,
  sort_order,
  active
)
VALUES
  (
    'Ruched Faux Recycled Polyester Blanket',
    'RA-AP-103073',
    0,
    '/images/RA-AP-103073_Ivory.jpg',
    NULL,
    '[{"name":"Ivory","sku":"RA-AP-103073_Ivory","image_url":"/images/RA-AP-103073_Ivory.jpg"},{"name":"Mocha","sku":"RA-AP-103073_Mocha","image_url":"/images/RA-AP-103073_Mocha.jpg"}]'::jsonb,
    NULL,
    16,
    TRUE
  ),
  (
    'Adidas Men''s Wind Resistant Full-Zip Jacket',
    'RA-AP-A267',
    0,
    '/images/RA-AP-A267_Black.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Black","sku":"RA-AP-A267_Black","image_url":"/images/RA-AP-A267_Black.jpg"}]'::jsonb,
    NULL,
    17,
    TRUE
  ),
  (
    'Adidas Women''s Wind Resistant Full-Zip Jacket',
    'RA-AP-A268',
    0,
    '/images/RA-AP-A268_Black.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[],
    '[{"name":"Black","sku":"RA-AP-A268_Black","image_url":"/images/RA-AP-A268_Black.jpg"}]'::jsonb,
    NULL,
    18,
    TRUE
  ),
  (
    'OGIO Driveline Hybrid Vest',
    'RA-AP-OG761',
    0,
    '/images/RA-AP-OG761_Blacktop.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Blacktop","sku":"RA-AP-OG761_Blacktop","image_url":"/images/RA-AP-OG761_Blacktop.jpg"},{"name":"Greystone","sku":"RA-AP-OG761_Greystone","image_url":"/images/RA-AP-OG761_Greystone.jpg"},{"name":"River Blue Navy","sku":"RA-AP-OG761_RiverBlueNavy","image_url":"/images/RA-AP-OG761_RiverBlueNavy.jpg"}]'::jsonb,
    NULL,
    19,
    TRUE
  ),
  (
    'OGIO Women''s Driveline Hybrid Vest',
    'RA-AP-LOG8761',
    0,
    '/images/RA-AP-LOG8761_Blacktop.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Blacktop","sku":"RA-AP-LOG8761_Blacktop","image_url":"/images/RA-AP-LOG8761_Blacktop.jpg"},{"name":"River Blue Navy","sku":"RA-AP-LOG8761_RiverBlueNavy","image_url":"/images/RA-AP-LOG8761_RiverBlueNavy.jpg"}]'::jsonb,
    NULL,
    20,
    TRUE
  ),
  (
    'The North Face Textured Pine Grove 1/2-Zip',
    'RA-AP-NF0A8JF6',
    0,
    '/images/RA-AP-NF0A8JF6_ShadyBlueHeather.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL']::text[],
    '[{"name":"Shady Blue Heather","sku":"RA-AP-NF0A8JF6_ShadyBlueHeather","image_url":"/images/RA-AP-NF0A8JF6_ShadyBlueHeather.jpg"},{"name":"TNF Black Heather","sku":"RA-AP-NF0A8JF6_TnfBlackHeather","image_url":"/images/RA-AP-NF0A8JF6_TnfBlackHeather.jpg"},{"name":"TNF Light Grey Heather","sku":"RA-AP-NF0A8JF6_TnfLightGreyHeather","image_url":"/images/RA-AP-NF0A8JF6_TnfLightGreyHeather.jpg"}]'::jsonb,
    NULL,
    21,
    TRUE
  ),
  (
    'The North Face Women''s Textured Pine Grove 1/2-Zip',
    'RA-AP-NF0A8JF7',
    0,
    '/images/RA-AP-NF0A8JF7_ShadyBlueHeather.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL']::text[],
    '[{"name":"Shady Blue Heather","sku":"RA-AP-NF0A8JF7_ShadyBlueHeather","image_url":"/images/RA-AP-NF0A8JF7_ShadyBlueHeather.jpg"},{"name":"TNF Black Heather","sku":"RA-AP-NF0A8JF7_TnfBlackHeather","image_url":"/images/RA-AP-NF0A8JF7_TnfBlackHeather.jpg"},{"name":"TNF Light Grey Heather","sku":"RA-AP-NF0A8JF7_TnfLightGreyHeather","image_url":"/images/RA-AP-NF0A8JF7_TnfLightGreyHeather.jpg"}]'::jsonb,
    NULL,
    22,
    TRUE
  )
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  available_sizes = EXCLUDED.available_sizes,
  available_colors = EXCLUDED.available_colors,
  price_by_size = EXCLUDED.price_by_size,
  sort_order = EXCLUDED.sort_order,
  active = TRUE;
