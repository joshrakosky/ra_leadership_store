// Builds migrations/ls-02-seed-products.sql from the leadership catalog spreadsheet.
// Image files are SKU + color with spaces/slashes removed: RA-AP-BB18400_DeepBlack.jpg

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')

const SOURCE = 'C:/Users/Josh/Desktop/ra_leadership_products.xlsx'
const OUT = path.join(process.cwd(), 'migrations', 'ls-02-seed-products.sql')
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

function expandSizes(range) {
  const r = String(range).trim()
  if (!r || r === 'OS') return []
  const [start, end] = r.split('-').map((part) => part.trim())
  const i = ALL_SIZES.indexOf(start)
  const j = ALL_SIZES.indexOf(end)
  if (i >= 0 && j >= i) return ALL_SIZES.slice(i, j + 1)
  return [r]
}

function parsePrice(raw) {
  if (typeof raw === 'number') return { price: raw, priceBySize: null }
  const parts = String(raw)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  const price = parseFloat(parts[0])
  const priceBySize = {}
  for (const part of parts.slice(1)) {
    const match = part.match(/^([\d.]+)\s*\(([^)]+)\)$/)
    if (match) priceBySize[match[2].trim()] = parseFloat(match[1])
  }
  return {
    price,
    priceBySize: Object.keys(priceBySize).length ? priceBySize : null,
  }
}

function colorSlug(colorName) {
  return colorName.replace(/[^A-Za-z0-9]/g, '')
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlArray(values) {
  if (!values.length) return 'NULL'
  return `ARRAY[${values.map(sqlString).join(', ')}]::text[]`
}

const workbook = XLSX.readFile(SOURCE)
const rows = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { defval: '' })

const products = rows.map((row, index) => {
  const name = String(row.Name).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
  const sku = String(row.Sku).trim()
  const { price, priceBySize } = parsePrice(row.Price)
  const sizes = expandSizes(row.Sizes)
  const colors = String(row.Colors)
    .split(',')
    .map((color) => color.trim())
    .filter(Boolean)
  const colorRows = colors.map((color) => ({
    name: color,
    sku: `${sku}_${colorSlug(color)}`,
    image_url: `/images/${sku}_${colorSlug(color)}.jpg`,
  }))
  return {
    sort_order: index + 1,
    name,
    sku,
    price,
    priceBySize,
    sizes,
    colors: colorRows,
    image_url: colorRows[0]?.image_url ?? null,
  }
})

const values = products
  .map((product) => {
    const colorsJson = sqlString(JSON.stringify(product.colors))
    const priceBySizeSql = product.priceBySize
      ? `${sqlString(JSON.stringify(product.priceBySize))}::jsonb`
      : 'NULL'
    return `  (
    ${sqlString(product.name)},
    ${sqlString(product.sku)},
    ${product.price},
    ${sqlString(product.image_url)},
    ${sqlArray(product.sizes)},
    ${colorsJson}::jsonb,
    ${priceBySizeSql},
    ${product.sort_order},
    TRUE
  )`
  })
  .join(',\n')

const sql = `-- Leadership catalog seed from ra_leadership_products.xlsx
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
${values}
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  available_sizes = EXCLUDED.available_sizes,
  available_colors = EXCLUDED.available_colors,
  price_by_size = EXCLUDED.price_by_size,
  sort_order = EXCLUDED.sort_order,
  active = TRUE;
`

fs.writeFileSync(OUT, sql)
console.log(`Wrote ${products.length} products to ${OUT}`)
for (const product of products) {
  const extra = product.priceBySize ? ` upcharges=${JSON.stringify(product.priceBySize)}` : ''
  console.log(`${product.sku} $${product.price}${extra} sizes=${product.sizes.join('/') || 'OS'} colors=${product.colors.length}`)
}
