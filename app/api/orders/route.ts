import { NextRequest, NextResponse } from 'next/server'
import {
  getPriceForSize,
  getProductColor,
  productRequiresColor,
  productRequiresSize,
  toLeadershipProduct,
} from '@/lib/products'
import { DEFAULT_SHIPPING_COUNTRY } from '@/lib/shipping'
import { supabase } from '@/lib/supabase'

function supabaseMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Failed to create order'
}

// Sequential order numbers: RALS-001, RALS-002, ...
async function generateOrderNumber(): Promise<string> {
  const { data: orders, error } = await supabase
    .from('ra_leadership_orders')
    .select('order_number')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching last order number:', error)
    throw error
  }

  if (!orders || orders.length === 0) {
    return 'RALS-001'
  }

  const match = orders[0].order_number.match(/RALS-(\d+)/i)
  if (match) {
    const nextNumber = parseInt(match[1], 10) + 1
    return `RALS-${String(nextNumber).padStart(3, '0')}`
  }

  return 'RALS-001'
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          error:
            'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables, then redeploy.',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      address,
      address2,
      city,
      state,
      zip,
      country,
      productId,
      sku,
      color,
      size,
    } = body

    if (!email || !firstName || !lastName || !productId || !sku) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!address?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
      return NextResponse.json({ error: 'Missing shipping address fields' }, { status: 400 })
    }

    const { data: productRow, error: productError } = await supabase
      .from('ra_leadership_products')
      .select('*')
      .eq('id', productId)
      .eq('active', true)
      .maybeSingle()

    if (productError) throw productError
    if (!productRow) {
      return NextResponse.json({ error: 'Invalid product selection' }, { status: 400 })
    }

    const product = toLeadershipProduct(productRow as Record<string, unknown>)
    const colorMatch = typeof color === 'string' ? getProductColor(product, color) : undefined

    // Catalog SKU is the style number from the spreadsheet; color is its own column.
    if (sku !== product.sku) {
      return NextResponse.json({ error: 'Invalid product SKU' }, { status: 400 })
    }

    if (productRequiresColor(product) && !colorMatch) {
      return NextResponse.json({ error: 'Invalid color selection' }, { status: 400 })
    }

    if (productRequiresSize(product)) {
      if (typeof size !== 'string' || !product.available_sizes?.includes(size)) {
        return NextResponse.json({ error: 'Invalid size' }, { status: 400 })
      }
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const { data: existingOrder, error: existingError } = await supabase
      .from('ra_leadership_orders')
      .select('order_number')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existingError) throw existingError
    if (existingOrder) {
      return NextResponse.json(
        { error: 'This email has already been used to place an order. Only one order is allowed per email.' },
        { status: 409 }
      )
    }

    const orderNumber = await generateOrderNumber()
    const chargedPrice = getPriceForSize(product, typeof size === 'string' ? size : undefined)

    const { data: order, error: orderError } = await supabase
      .from('ra_leadership_orders')
      .insert({
        order_number: orderNumber,
        email: normalizedEmail,
        first_name: String(firstName).trim(),
        last_name: String(lastName).trim(),
        product_id: product.id,
        product_name: product.name,
        sku,
        color: productRequiresColor(product) ? String(color) : null,
        size: productRequiresSize(product) ? String(size) : null,
        // Price always comes from the catalog row (including size upcharges), never the browser.
        price: chargedPrice,
        // Ship to the shopper's first and last name — no attention line.
        shipping_name: `${String(firstName).trim()} ${String(lastName).trim()}`,
        shipping_attention: null,
        shipping_address: String(address).trim(),
        shipping_address2: address2 ? String(address2).trim() || null : null,
        shipping_city: String(city).trim(),
        shipping_state: String(state).trim(),
        shipping_zip: String(zip).trim(),
        shipping_country: String(country || DEFAULT_SHIPPING_COUNTRY).trim() || DEFAULT_SHIPPING_COUNTRY,
      })
      .select()
      .single()

    if (orderError) {
      const duplicate =
        orderError.message?.includes('duplicate key') ||
        orderError.message?.includes('idx_ra_leadership_orders_one_per_email')
      if (duplicate) {
        return NextResponse.json(
          { error: 'This email has already been used to place an order. Only one order is allowed per email.' },
          { status: 409 }
        )
      }
      throw orderError
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      order_id: order.id,
    })
  } catch (error: unknown) {
    console.error('Order creation error:', error)
    const message = supabaseMessage(error)
    if (message.includes('ra_leadership_orders') && message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Orders table is missing. Run migrations/ls-01-ra-leadership-schema.sql in the Supabase SQL editor.' },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
