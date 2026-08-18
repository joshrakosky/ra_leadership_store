import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { HQ_SHIPPING } from '@/lib/shipping'
import { getVestColor, isVestSize } from '@/lib/vests'

function supabaseMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Failed to create order'
}

// Sequential order numbers: RAOP-001, RAOP-002, ...
async function generateOrderNumber(): Promise<string> {
  const { data: orders, error } = await supabase
    .from('ra_ao_orders')
    .select('order_number')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching last order number:', error)
    throw error
  }

  if (!orders || orders.length === 0) {
    return 'RAOP-001'
  }

  const match = orders[0].order_number.match(/RAOP-(\d+)/i)
  if (match) {
    const nextNumber = parseInt(match[1], 10) + 1
    return `RAOP-${String(nextNumber).padStart(3, '0')}`
  }

  return 'RAOP-001'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, style, color, size, sku } = body

    if (!email || !firstName || !lastName || !style || !color || !size || !sku) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const vestColor = getVestColor(style, color)
    if (!vestColor || vestColor.sku !== sku) {
      return NextResponse.json({ error: 'Invalid vest selection' }, { status: 400 })
    }

    if (!isVestSize(size)) {
      return NextResponse.json({ error: 'Invalid size' }, { status: 400 })
    }

    const orderNumber = await generateOrderNumber()

    const orderRow = {
      order_number: orderNumber,
      email: String(email).toLowerCase().trim(),
      first_name: String(firstName).trim(),
      last_name: String(lastName).trim(),
      style,
      color,
      size,
      sku,
      shipping_name: HQ_SHIPPING.name,
      shipping_attention: HQ_SHIPPING.attention,
      shipping_address: HQ_SHIPPING.address,
      shipping_address2: null,
      shipping_city: HQ_SHIPPING.city,
      shipping_state: HQ_SHIPPING.state,
      shipping_zip: HQ_SHIPPING.zip,
      shipping_country: HQ_SHIPPING.country,
    }

    let { data: order, error: orderError } = await supabase
      .from('ra_ao_orders')
      .insert(orderRow)
      .select()
      .single()

    // Table may have been created before shipping_attention existed — still save the order.
    if (orderError?.message?.includes('shipping_attention')) {
      const { shipping_attention: _attn, ...rowWithoutAttn } = orderRow
      const retry = await supabase.from('ra_ao_orders').insert(rowWithoutAttn).select().single()
      order = retry.data
      orderError = retry.error
    }

    if (orderError) throw orderError

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      order_id: order.id,
    })
  } catch (error: unknown) {
    console.error('Order creation error:', error)
    const message = supabaseMessage(error)
    if (message.includes('ra_ao_orders') && message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Orders table is missing. Run migrations/ao-01-ra-ao-orders.sql in the Supabase SQL editor.' },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
