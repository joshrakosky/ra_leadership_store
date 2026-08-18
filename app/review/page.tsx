'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import { HQ_SHIPPING } from '@/lib/shipping'
import { getVest } from '@/lib/vests'
import type { ShippingInfo, VestSelection } from '@/types'

export default function ReviewPage() {
  const router = useRouter()
  const [vest, setVest] = useState<VestSelection | null>(null)
  const [shipping, setShipping] = useState<ShippingInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const vestData = sessionStorage.getItem('vestSelection')
    const shippingData = sessionStorage.getItem('shipping')

    if (!vestData) {
      router.push('/vests')
      return
    }
    if (!shippingData) {
      router.push('/shipping')
      return
    }

    try {
      setVest(JSON.parse(vestData) as VestSelection)
      setShipping(JSON.parse(shippingData) as ShippingInfo)
    } catch {
      router.push('/vests')
    }
  }, [router])

  const handleSubmit = async () => {
    if (!vest || !shipping) return
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: shipping.email,
          firstName: shipping.firstName,
          lastName: shipping.lastName,
          style: vest.style,
          color: vest.color,
          size: vest.size,
          sku: vest.sku,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit order')
      }

      const orderData = await response.json()
      sessionStorage.setItem('orderNumber', orderData.order_number)
      sessionStorage.removeItem('vestSelection')
      sessionStorage.removeItem('shipping')
      router.push('/confirmation')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit order. Please try again.'
      setError(message)
      setSubmitting(false)
    }
  }

  if (!vest || !shipping) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#00263a' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 relative" style={{ backgroundColor: '#00263a' }}>
      <ExportOrdersButton />
      <HelpIcon />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Order</h1>
            <p className="text-gray-600">Please confirm your vest and shipping details</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Vest</h2>
            <div className="bg-gray-50 rounded-lg p-4 flex gap-4 items-center">
              <img
                src={vest.imageUrl}
                alt={`${vest.style} ${vest.color}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-900">{getVest(vest.style)?.name || vest.style}</p>
                <p className="text-sm text-gray-600">Color: {vest.color}</p>
                <p className="text-sm text-gray-600">Size: {vest.size}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p className="font-medium text-gray-900">
                {shipping.firstName} {shipping.lastName}
              </p>
              <p className="text-sm text-gray-600">Email: {shipping.email}</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <p className="text-sm text-gray-600 mb-3">
              These orders ship to Republic HQ at the address below.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{HQ_SHIPPING.name}</p>
              <p className="text-sm text-gray-600">{HQ_SHIPPING.address}</p>
              <p className="text-sm text-gray-600">
                {HQ_SHIPPING.city}, {HQ_SHIPPING.state} {HQ_SHIPPING.zip}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/shipping')}
              className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium"
              style={{ backgroundColor: '#c8102e' }}
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              style={{ backgroundColor: '#c8102e' }}
            >
              {submitting ? 'Submitting...' : 'Submit Order →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
