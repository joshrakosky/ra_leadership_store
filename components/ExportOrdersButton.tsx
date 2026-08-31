'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { fetchAllRows } from '@/lib/fetch-all-rows'
import { formatPrice } from '@/lib/products'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

// Off switch: set NEXT_PUBLIC_SHOW_EXPORT=false when this button should be hidden.
const SHOW_EXPORT = process.env.NEXT_PUBLIC_SHOW_EXPORT !== 'false'
// Simple gate for admin-only order exports from the landing page.
const EXPORT_PASSWORD = 'ADMIN'

export default function ExportOrdersButton() {
  const [loading, setLoading] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  if (!SHOW_EXPORT) return null

  const closePasswordPrompt = () => {
    setShowPasswordPrompt(false)
    setPassword('')
    setPasswordError('')
  }

  const handleExportClick = () => {
    setPasswordError('')
    setShowPasswordPrompt(true)
  }

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (password !== EXPORT_PASSWORD) {
      setPasswordError('Incorrect password. Please try again.')
      return
    }

    closePasswordPrompt()
    void exportToExcel()
  }

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
        'Address 2': order.shipping_address2 || '',
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
    <>
      <button
        onClick={handleExportClick}
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

      {showPasswordPrompt && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          onClick={closePasswordPrompt}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Export Orders</h2>
              <button
                type="button"
                onClick={closePasswordPrompt}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Enter the admin password to export all orders.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="export-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="export-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setPasswordError('')
                  }}
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:border-transparent"
                  placeholder="Enter password"
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 transition-colors font-medium"
                style={{ backgroundColor: '#c8102e' }}
              >
                Export
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
