'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import { HQ_SHIPPING } from '@/lib/shipping'
import type { ProductSelection, ShippingInfo } from '@/types'

const EMPTY_FORM: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
}

export default function ShippingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ShippingInfo>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const productSelection = sessionStorage.getItem('productSelection')
    if (!productSelection) {
      router.push('/products')
      return
    }
    try {
      const parsed = JSON.parse(productSelection) as ProductSelection
      if (!parsed.id || !parsed.sku) {
        router.push('/products')
        return
      }
    } catch {
      router.push('/products')
      return
    }

    const savedShipping = sessionStorage.getItem('shipping')
    if (savedShipping) {
      try {
        // sessionStorage is client-only; apply after mount so SSR stays empty.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({ ...EMPTY_FORM, ...JSON.parse(savedShipping) })
      } catch {
        // Start with a blank form if stored shipping is invalid.
      }
    }
    setReady(true)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.firstName.trim()) {
      setError('Please enter your first name')
      return
    }
    if (!formData.lastName.trim()) {
      setError('Please enter your last name')
      return
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    sessionStorage.setItem('shipping', JSON.stringify(formData))
    router.push('/review')
  }

  if (!ready) {
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
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Information</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Your Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Shipping Address</h2>
              <p className="text-sm text-gray-600">
                These orders ship to 2 Brickyard Ln. The address cannot be changed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-800">
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
                onClick={() => router.push('/products')}
                className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium"
                style={{ backgroundColor: '#c8102e' }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium"
                style={{ backgroundColor: '#c8102e' }}
              >
                Continue to Review →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
