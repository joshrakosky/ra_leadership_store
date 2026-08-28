'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CatalogImage from '@/components/CatalogImage'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import {
  fetchActiveProducts,
  formatCatalogPrice,
  formatPrice,
  getPriceForSize,
  getProductColor,
  previewImage,
  productRequiresColor,
  productRequiresSize,
  type LeadershipProduct,
} from '@/lib/products'
import type { ProductSelection } from '@/types'

type CardSelection = { color: string; size: string }

export default function ProductChoicePage() {
  const router = useRouter()
  const [products, setProducts] = useState<LeadershipProduct[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selections, setSelections] = useState<Record<string, CardSelection>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchActiveProducts()
      .then((rows) => {
        if (!cancelled) setProducts(rows)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load products'
        if (!cancelled) setLoadError(message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const activeProduct = products.find((product) => product.id === activeId) ?? null
  const pick = activeId ? selections[activeId] : undefined
  const activeColorName = activeProduct
    ? pick?.color || activeProduct.available_colors?.[0]?.name
    : undefined

  const updateSelection = (productId: string, patch: Partial<CardSelection>) => {
    setSelections((prev) => {
      const current = prev[productId] ?? { color: '', size: '' }
      return { ...prev, [productId]: { ...current, ...patch } }
    })
    setError('')
  }

  const openProduct = (product: LeadershipProduct) => {
    setError('')
    if (productRequiresColor(product) && !selections[product.id]?.color) {
      updateSelection(product.id, { color: product.available_colors![0].name })
    }
    setActiveId(product.id)
  }

  const closeProduct = () => {
    setActiveId(null)
    setError('')
  }

  const handleContinue = () => {
    if (!activeProduct) return
    const current = selections[activeProduct.id] ?? { color: '', size: '' }
    const needsColor = productRequiresColor(activeProduct)
    const needsSize = productRequiresSize(activeProduct)
    const colorMatch = needsColor ? getProductColor(activeProduct, current.color) : undefined

    if (needsColor && !colorMatch) {
      setError('Please choose a color to continue')
      return
    }
    if (needsSize && !current.size) {
      setError('Please choose a size to continue')
      return
    }

    const selection: ProductSelection = {
      id: activeProduct.id,
      name: activeProduct.name,
      sku: activeProduct.sku,
      price: getPriceForSize(activeProduct, needsSize ? current.size : undefined),
      imageUrl: previewImage(activeProduct, current.color),
      size: needsSize ? current.size : undefined,
      color: needsColor ? current.color : undefined,
    }
    sessionStorage.setItem('productSelection', JSON.stringify(selection))
    router.push('/shipping')
  }

  const canContinue = (() => {
    if (!activeProduct) return false
    const current = selections[activeProduct.id]
    if (productRequiresColor(activeProduct) && !current?.color) return false
    if (productRequiresSize(activeProduct) && !current?.size) return false
    return true
  })()

  return (
    <div className="min-h-screen px-4 py-10 relative" style={{ backgroundColor: '#00263a' }}>
      <ExportOrdersButton />
      <HelpIcon />

      {/* Wide enough for 15 products as three rows of five on desktop. */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Choose Your Product
          </h1>
          <p className="text-white/80">
            Select 1 product of your choice
          </p>
        </div>

        {loading && <p className="text-center text-white/80">Loading products...</p>}

        {!loading && loadError && (
          <div className="bg-white rounded-lg p-6 text-red-700">
            Could not load products. Confirm `ra_leadership_products` exists in Supabase.
            <p className="text-sm text-gray-600 mt-2">{loadError}</p>
          </div>
        )}

        {!loading && !loadError && products.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-700">
            <p className="font-medium text-gray-900 mb-2">No products listed yet</p>
            <p className="text-sm text-gray-600">
              Add rows to `ra_leadership_products` in the same Supabase project, then refresh this page.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => openProduct(product)}
              className="group bg-white rounded-lg shadow-lg p-3 text-left transition-shadow duration-200 hover:shadow-[0_0_22px_rgba(200,16,46,0.45)] focus:outline-none focus:ring-4 focus:ring-[#c8102e]"
            >
              <h2 className="text-sm font-bold text-gray-900 mb-1 leading-snug min-h-[2.5rem]">{product.name}</h2>
              <p className="text-[#c8102e] font-semibold text-sm mb-2">{formatCatalogPrice(product)}</p>
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                <CatalogImage
                  src={previewImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium"
            style={{ backgroundColor: '#c8102e' }}
          >
            ← Back
          </button>
        </div>
      </div>

      {activeProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeProduct}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-snug">{activeProduct.name}</h2>
                <p className="text-[#c8102e] font-semibold mt-1">
                  {formatPrice(getPriceForSize(activeProduct, pick?.size))}
                </p>
              </div>
              <button
                type="button"
                onClick={closeProduct}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-md mb-4 bg-gray-100">
              <CatalogImage
                src={previewImage(activeProduct, activeColorName)}
                alt={`${activeProduct.name} ${activeColorName || ''}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              {productRequiresColor(activeProduct) && (
                <div>
                  <label htmlFor="product-color" className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    id="product-color"
                    value={pick?.color || ''}
                    onChange={(e) => updateSelection(activeProduct.id, { color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                  >
                    {activeProduct.available_colors!.map((color) => (
                      <option key={color.sku} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {productRequiresSize(activeProduct) && (
                <div>
                  <label htmlFor="product-size" className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    id="product-size"
                    value={pick?.size || ''}
                    onChange={(e) => updateSelection(activeProduct.id, { size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                  >
                    <option value="">Select size</option>
                    {activeProduct.available_sizes!.map((size) => {
                      const sizePrice = getPriceForSize(activeProduct, size)
                      const hasUpcharge = sizePrice !== activeProduct.price
                      return (
                        <option key={size} value={size}>
                          {hasUpcharge ? `${size} (${formatPrice(sizePrice)})` : size}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              {activeProduct.size_chart_url && (
                <a
                  href={activeProduct.size_chart_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium inline-block text-center"
                  style={{ backgroundColor: '#c8102e' }}
                >
                  Size Chart
                </a>
              )}

              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="w-full py-3 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#c8102e' }}
              >
                Continue to Shipping →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
