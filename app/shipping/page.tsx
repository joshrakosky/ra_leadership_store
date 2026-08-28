'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import { DEFAULT_SHIPPING_COUNTRY } from '@/lib/shipping'
import type { ProductSelection, ShippingInfo } from '@/types'

const EMPTY_FORM: ShippingInfo = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: DEFAULT_SHIPPING_COUNTRY,
}

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white'

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
        const saved = JSON.parse(savedShipping) as Partial<ShippingInfo>
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          ...EMPTY_FORM,
          firstName: saved.firstName ?? '',
          lastName: saved.lastName ?? '',
          email: saved.email ?? '',
          address: saved.address ?? '',
          address2: saved.address2 ?? '',
          city: saved.city ?? '',
          state: saved.state ?? '',
          zip: saved.zip ?? '',
          country: saved.country || DEFAULT_SHIPPING_COUNTRY,
        })
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
    if (!formData.address.trim()) {
      setError('Please enter an address')
      return
    }
    if (!formData.city.trim()) {
      setError('Please enter a city')
      return
    }
    if (!formData.state.trim()) {
      setError('Please enter a state')
      return
    }
    if (!formData.zip.trim()) {
      setError('Please enter a ZIP / postal code')
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
                    className={inputClass}
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
                    className={inputClass}
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
                  className={inputClass}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Shipping Address</h2>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  autoComplete="address-line1"
                />
              </div>

              <div>
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="address-line2"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    autoComplete="address-level2"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    autoComplete="address-level1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    autoComplete="postal-code"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    autoComplete="country-name"
                  />
                </div>
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
