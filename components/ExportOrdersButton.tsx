'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { fetchAllRows } from '@/lib/fetch-all-rows'
import { formatPrice } from '@/lib/products'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

// Off switch: set NEXT_PUBLIC_SHOW_EXPORT=false when this button should be hidden.
const SHOW_EXPORT = process.env.NEXT_PUBLIC_SHOW_EXPORT !== 'false'

export default function ExportOrdersButton() {
  const [loading, setLoading] = useState(false)

  if (!SHOW_EXPORT) return null

  const exportToExcel = async () => {
    try {
      setLoading(true)

      const orders = await fetchAllRows<Order>((from, to) =>
        supabase
          .from('ra_leadership_orders')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, to)
      )

      const rows = orders.map((order) => ({
        'Order Number': order.order_number,
        'First Name': order.first_name,
        'Last Name': order.last_name,
        Email: order.email,
        'Product Name': order.product_name,
        Color: order.color || '',
        Size: order.size || '',
        SKU: order.sku,
        Price: formatPrice(Number(order.price)),
        'Shipping Name': order.shipping_name,
        'Shipping Attention': order.shipping_attention || '',
        'Shipping Address': order.shipping_address,
        City: order.shipping_city,
        State: order.shipping_state,
        ZIP: order.shipping_zip,
        Country: order.shipping_country,
        'Order Date': new Date(order.created_at).toLocaleDateString(),
      }))

      const workbook = XLSX.utils.book_new()
      const sheet = XLSX.utils.json_to_sheet(rows)
      XLSX.utils.book_append_sheet(workbook, sheet, 'Orders')
      XLSX.writeFile(workbook, `ra-leadership-orders-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={loading}
      className="fixed top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md z-50 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: '#c8102e' }}
      title="Export all orders to Excel"
      aria-label="Export orders"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </button>
  )
}
