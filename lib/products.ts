// Leadership catalog helpers. Products live in ra_leadership_products (not hardcoded like AO vests).
// Image files: /images/{SKU}_{ColorWithoutSpaces}.jpg  e.g. RA-AP-BB18400_DeepBlack.jpg

import { supabase } from '@/lib/supabase'

export interface ProductColor {
  name: string
  sku: string
  image_url: string
}

export interface LeadershipProduct {
  id: string
  name: string
  description: string | null
  sku: string
  price: number
  /** Size-specific prices from the spreadsheet, e.g. { "2XL": 72, "3XL": 74 }. */
  price_by_size: Record<string, number> | null
  image_url: string | null
  available_sizes: string[] | null
  size_chart_url: string | null
  available_colors: ProductColor[] | null
  sort_order: number
  active: boolean
}

function parseColors(value: unknown): ProductColor[] | null {
  if (!Array.isArray(value) || value.length === 0) return null
  const colors: ProductColor[] = []
  for (const entry of value) {
    if (
      entry &&
      typeof entry === 'object' &&
      'name' in entry &&
      'sku' in entry &&
      typeof entry.name === 'string' &&
      typeof entry.sku === 'string'
    ) {
      colors.push({
        name: entry.name,
        sku: entry.sku,
        image_url: 'image_url' in entry && typeof entry.image_url === 'string' ? entry.image_url : '',
      })
    }
  }
  return colors.length > 0 ? colors : null
}

function parsePriceBySize(value: unknown): Record<string, number> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const mapped: Record<string, number> = {}
  for (const [size, amount] of Object.entries(value as Record<string, unknown>)) {
    const price = Number(amount)
    if (!Number.isNaN(price)) mapped[size] = price
  }
  return Object.keys(mapped).length > 0 ? mapped : null
}

export function toLeadershipProduct(row: Record<string, unknown>): LeadershipProduct {
  return {
    id: String(row.id),
    name: String(row.name),
    description: typeof row.description === 'string' ? row.description : null,
    sku: String(row.sku),
    price: Number(row.price),
    price_by_size: parsePriceBySize(row.price_by_size),
    image_url: typeof row.image_url === 'string' ? row.image_url : null,
    available_sizes: Array.isArray(row.available_sizes)
      ? row.available_sizes.filter((size): size is string => typeof size === 'string')
      : null,
    size_chart_url: typeof row.size_chart_url === 'string' ? row.size_chart_url : null,
    available_colors: parseColors(row.available_colors),
    sort_order: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

/** Card price: base, or a range when larger sizes cost more. */
export function formatCatalogPrice(product: LeadershipProduct): string {
  const extras = product.price_by_size ? Object.values(product.price_by_size) : []
  const highest = extras.length ? Math.max(product.price, ...extras) : product.price
  if (highest !== product.price) {
    return `${formatPrice(product.price)} – ${formatPrice(highest)}`
  }
  return formatPrice(product.price)
}

export function getPriceForSize(product: LeadershipProduct, size?: string): number {
  if (size && product.price_by_size?.[size] != null) {
    return product.price_by_size[size]
  }
  return product.price
}

export function productRequiresSize(product: LeadershipProduct): boolean {
  return (product.available_sizes?.length ?? 0) > 0
}

export function productRequiresColor(product: LeadershipProduct): boolean {
  return (product.available_colors?.length ?? 0) > 0
}

export function getProductColor(product: LeadershipProduct, colorName: string): ProductColor | undefined {
  return product.available_colors?.find((color) => color.name === colorName)
}

export function previewImage(product: LeadershipProduct, colorName?: string): string {
  if (colorName) {
    const match = getProductColor(product, colorName)
    if (match?.image_url) return match.image_url
  }
  if (product.available_colors?.[0]?.image_url) return product.available_colors[0].image_url
  return product.image_url || '/file.svg'
}

export async function fetchActiveProducts(): Promise<LeadershipProduct[]> {
  const { data, error } = await supabase
    .from('ra_leadership_products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => toLeadershipProduct(row as Record<string, unknown>))
}
