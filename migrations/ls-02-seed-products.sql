-- Leadership catalog seed from ra_leadership_products.xlsx
-- Images are not in the repo yet; URLs follow SKU_Color.jpg (spaces/slashes stripped).
-- Re-run safely: upserts on sku.

ALTER TABLE ra_leadership_products
  ADD COLUMN IF NOT EXISTS price_by_size JSONB;

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
    'Brooks Brothers® Cotton Stretch V-Neck Sweater',
    'RA-AP-BB18400',
    70,
    '/images/RA-AP-BB18400_DeepBlack.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Deep Black","sku":"RA-AP-BB18400_DeepBlack","image_url":"/images/RA-AP-BB18400_DeepBlack.jpg"},{"name":"Navy Blazer","sku":"RA-AP-BB18400_NavyBlazer","image_url":"/images/RA-AP-BB18400_NavyBlazer.jpg"},{"name":"Light Shadow Grey Heather","sku":"RA-AP-BB18400_LightShadowGreyHeather","image_url":"/images/RA-AP-BB18400_LightShadowGreyHeather.jpg"}]'::jsonb,
    '{"2XL":72,"3XL":74,"4XL":75}'::jsonb,
    1,
    TRUE
  ),
  (
    'Brooks Brothers® Women’s Cotton Stretch V-Neck Sweater',
    'RA-AP-BB18401',
    70,
    '/images/RA-AP-BB18401_DeepBlack.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Deep Black","sku":"RA-AP-BB18401_DeepBlack","image_url":"/images/RA-AP-BB18401_DeepBlack.jpg"},{"name":"Navy Blazer","sku":"RA-AP-BB18401_NavyBlazer","image_url":"/images/RA-AP-BB18401_NavyBlazer.jpg"},{"name":"Light Shadow Grey Heather","sku":"RA-AP-BB18401_LightShadowGreyHeather","image_url":"/images/RA-AP-BB18401_LightShadowGreyHeather.jpg"}]'::jsonb,
    '{"2XL":72,"3XL":74,"4XL":75}'::jsonb,
    2,
    TRUE
  ),
  (
    'Patagonia Men''s Cap Cool Daily Hoody',
    'RA-AP-45311',
    69,
    '/images/RA-AP-45311_FeatherGrey.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[],
    '[{"name":"Feather Grey","sku":"RA-AP-45311_FeatherGrey","image_url":"/images/RA-AP-45311_FeatherGrey.jpg"},{"name":"Smolder Blue","sku":"RA-AP-45311_SmolderBlue","image_url":"/images/RA-AP-45311_SmolderBlue.jpg"}]'::jsonb,
    NULL,
    3,
    TRUE
  ),
  (
    'Patagonia Women''s Cap Cool Daily Hoody',
    'RA-AP-45316',
    69,
    '/images/RA-AP-45316_DynoWhite.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL']::text[],
    '[{"name":"Dyno White","sku":"RA-AP-45316_DynoWhite","image_url":"/images/RA-AP-45316_DynoWhite.jpg"},{"name":"Feather Grey","sku":"RA-AP-45316_FeatherGrey","image_url":"/images/RA-AP-45316_FeatherGrey.jpg"}]'::jsonb,
    NULL,
    4,
    TRUE
  ),
  (
    'Patagonia Men''s Micro D Quarter-Zip',
    'RA-AP-26176',
    75,
    '/images/RA-AP-26176_FeatherGrey.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']::text[],
    '[{"name":"Feather Grey","sku":"RA-AP-26176_FeatherGrey","image_url":"/images/RA-AP-26176_FeatherGrey.jpg"},{"name":"New Navy","sku":"RA-AP-26176_NewNavy","image_url":"/images/RA-AP-26176_NewNavy.jpg"}]'::jsonb,
    NULL,
    5,
    TRUE
  ),
  (
    'Patagonia Women''s Micro D Quarter-Zip',
    'RA-AP-26278',
    75,
    '/images/RA-AP-26278_Black.jpg',
    ARRAY['XS', 'S', 'M', 'L', 'XL']::text[],
    '[{"name":"Black","sku":"RA-AP-26278_Black","image_url":"/images/RA-AP-26278_Black.jpg"},{"name":"Birch White","sku":"RA-AP-26278_BirchWhite","image_url":"/images/RA-AP-26278_BirchWhite.jpg"}]'::jsonb,
    NULL,
    6,
    TRUE
  ),
  (
    'Adidas Men''s Puffer Full-Zip Vest',
    'RA-AP-A572',
    74,
    '/images/RA-AP-A572_Black.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Black","sku":"RA-AP-A572_Black","image_url":"/images/RA-AP-A572_Black.jpg"},{"name":"Grey Five","sku":"RA-AP-A572_GreyFive","image_url":"/images/RA-AP-A572_GreyFive.jpg"},{"name":"Team Navy Blue","sku":"RA-AP-A572_TeamNavyBlue","image_url":"/images/RA-AP-A572_TeamNavyBlue.jpg"}]'::jsonb,
    '{"2XL":76,"3XL":78,"4XL":79}'::jsonb,
    7,
    TRUE
  ),
  (
    'Adidas Men''s Game & Go Fleece Full-Zip Hooded Sweatshirt',
    'RA-AP-AT208',
    59,
    '/images/RA-AP-AT208_MediumGreyHeather.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']::text[],
    '[{"name":"Medium Grey Heather","sku":"RA-AP-AT208_MediumGreyHeather","image_url":"/images/RA-AP-AT208_MediumGreyHeather.jpg"},{"name":"Team Grey Four","sku":"RA-AP-AT208_TeamGreyFour","image_url":"/images/RA-AP-AT208_TeamGreyFour.jpg"},{"name":"Team Navy Blue","sku":"RA-AP-AT208_TeamNavyBlue","image_url":"/images/RA-AP-AT208_TeamNavyBlue.jpg"},{"name":"Team Power Red","sku":"RA-AP-AT208_TeamPowerRed","image_url":"/images/RA-AP-AT208_TeamPowerRed.jpg"}]'::jsonb,
    '{"2XL":61,"3XL":63,"4XL":64}'::jsonb,
    8,
    TRUE
  ),
  (
    'Adidas Women''s Game & Go Fleece Full-Zip Hooded Sweatshirt',
    'RA-AP-AT209',
    59,
    '/images/RA-AP-AT209_Black.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL']::text[],
    '[{"name":"Black","sku":"RA-AP-AT209_Black","image_url":"/images/RA-AP-AT209_Black.jpg"},{"name":"Medium Grey Heather","sku":"RA-AP-AT209_MediumGreyHeather","image_url":"/images/RA-AP-AT209_MediumGreyHeather.jpg"},{"name":"Team Grey Four","sku":"RA-AP-AT209_TeamGreyFour","image_url":"/images/RA-AP-AT209_TeamGreyFour.jpg"},{"name":"Team Navy Blue","sku":"RA-AP-AT209_TeamNavyBlue","image_url":"/images/RA-AP-AT209_TeamNavyBlue.jpg"},{"name":"Team Power Red","sku":"RA-AP-AT209_TeamPowerRed","image_url":"/images/RA-AP-AT209_TeamPowerRed.jpg"}]'::jsonb,
    '{"2XL":61}'::jsonb,
    9,
    TRUE
  ),
  (
    'Oakley 28L Street Pocket Backpack',
    'RA-AP-921422ODM',
    75,
    '/images/RA-AP-921422ODM_Blackout.jpg',
    NULL,
    '[{"name":"Blackout","sku":"RA-AP-921422ODM_Blackout","image_url":"/images/RA-AP-921422ODM_Blackout.jpg"},{"name":"Fathom","sku":"RA-AP-921422ODM_Fathom","image_url":"/images/RA-AP-921422ODM_Fathom.jpg"}]'::jsonb,
    NULL,
    10,
    TRUE
  ),
  (
    'Cotopaxi® Amado 1/2-Zip Fleece',
    'RA-AP-COTOM1691',
    75,
    '/images/RA-AP-COTOM1691_AtlanticBlack.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL']::text[],
    '[{"name":"Atlantic/Black","sku":"RA-AP-COTOM1691_AtlanticBlack","image_url":"/images/RA-AP-COTOM1691_AtlanticBlack.jpg"},{"name":"Cream/Fjord","sku":"RA-AP-COTOM1691_CreamFjord","image_url":"/images/RA-AP-COTOM1691_CreamFjord.jpg"},{"name":"Smoke/Cinder","sku":"RA-AP-COTOM1691_SmokeCinder","image_url":"/images/RA-AP-COTOM1691_SmokeCinder.jpg"}]'::jsonb,
    '{"2XL":77,"3XL":79}'::jsonb,
    11,
    TRUE
  ),
  (
    'Cotopaxi® Women''s Amado 1/2-Zip Fleece',
    'RA-AP-COTOW1692',
    75,
    '/images/RA-AP-COTOW1692_AtlanticBlack.jpg',
    ARRAY['S', 'M', 'L', 'XL', '2XL']::text[],
    '[{"name":"Atlantic/Black","sku":"RA-AP-COTOW1692_AtlanticBlack","image_url":"/images/RA-AP-COTOW1692_AtlanticBlack.jpg"},{"name":"Cream/Fjord","sku":"RA-AP-COTOW1692_CreamFjord","image_url":"/images/RA-AP-COTOW1692_CreamFjord.jpg"},{"name":"Smoke/Cinder","sku":"RA-AP-COTOW1692_SmokeCinder","image_url":"/images/RA-AP-COTOW1692_SmokeCinder.jpg"}]'::jsonb,
    '{"2XL":77}'::jsonb,
    12,
    TRUE
  ),
  (
    'TravisMathew Chill''n 12-Can Cooler',
    'RA-AP-TMB600',
    55,
    '/images/RA-AP-TMB600_Black.jpg',
    NULL,
    '[{"name":"Black","sku":"RA-AP-TMB600_Black","image_url":"/images/RA-AP-TMB600_Black.jpg"},{"name":"Dusty Blue","sku":"RA-AP-TMB600_DustyBlue","image_url":"/images/RA-AP-TMB600_DustyBlue.jpg"}]'::jsonb,
    NULL,
    13,
    TRUE
  ),
  (
    'TravisMathew Lateral Duffel',
    'RA-AP-TMB200',
    71,
    '/images/RA-AP-TMB200_Black.jpg',
    NULL,
    '[{"name":"Black","sku":"RA-AP-TMB200_Black","image_url":"/images/RA-AP-TMB200_Black.jpg"},{"name":"Graphite","sku":"RA-AP-TMB200_Graphite","image_url":"/images/RA-AP-TMB200_Graphite.jpg"},{"name":"Navy","sku":"RA-AP-TMB200_Navy","image_url":"/images/RA-AP-TMB200_Navy.jpg"}]'::jsonb,
    NULL,
    14,
    TRUE
  ),
  (
    'Nike Utility Duffel 2.0',
    'RA-AP-NKFN4208',
    75,
    '/images/RA-AP-NKFN4208_Black.jpg',
    NULL,
    '[{"name":"Black","sku":"RA-AP-NKFN4208_Black","image_url":"/images/RA-AP-NKFN4208_Black.jpg"}]'::jsonb,
    NULL,
    15,
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
