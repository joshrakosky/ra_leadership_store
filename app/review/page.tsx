'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CatalogImage from '@/components/CatalogImage'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import { formatPrice } from '@/lib/products'
import { HQ_SHIPPING } from '@/lib/shipping'
import type { ProductSelection, ShippingInfo } from '@/types'

export default function ReviewPage() {
  const router = useRouter()
  const [product, setProduct] = useState<ProductSelection | null>(null)
  const [shipping, setShipping] = useState<ShippingInfo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const productData = sessionStorage.getItem('productSelection')
    const shippingData = sessionStorage.getItem('shipping')

    if (!productData) {
      router.push('/products')
      return
    }
    if (!shippingData) {
      router.push('/shipping')
      return
    }

    try {
      setProduct(JSON.parse(productData) as ProductSelection)
      setShipping(JSON.parse(shippingData) as ShippingInfo)
    } catch {
      router.push('/products')
    }
  }, [router])

  const handleSubmit = async () => {
    if (!product || !shipping) return
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
          productId: product.id,
          sku: product.sku,
          color: product.color,
          size: product.size,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit order')
      }

      const orderData = await response.json()
      sessionStorage.setItem('orderNumber', orderData.order_number)
      sessionStorage.removeItem('productSelection')
      sessionStorage.removeItem('shipping')
      router.push('/confirmation')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit order. Please try again.'
      setError(message)
      setSubmitting(false)
    }
  }

  if (!product || !shipping) {
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
            <p className="text-gray-600">Please confirm your product and shipping details</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6 pb-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Product</h2>
            <div className="bg-gray-50 rounded-lg p-4 flex gap-4 items-center">
              <CatalogImage
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                {product.color && <p className="text-sm text-gray-600">Color: {product.color}</p>}
                {product.size && <p className="text-sm text-gray-600">Size: {product.size}</p>}
                <p className="text-sm font-semibold text-[#c8102e] mt-1">{formatPrice(product.price)}</p>
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
              These orders ship to 2 Brickyard Ln. The address cannot be changed.
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
