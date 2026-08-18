'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import { VESTS, VEST_SIZES, getVestColor, type Vest, type VestStyle } from '@/lib/vests'
import type { VestSelection } from '@/types'

type CardSelection = { color: string; size: string }

export default function VestChoicePage() {
  const router = useRouter()
  const [activeStyle, setActiveStyle] = useState<VestStyle | null>(null)
  const [selections, setSelections] = useState<Partial<Record<VestStyle, CardSelection>>>({})
  const [error, setError] = useState('')

  const activeVest = VESTS.find((vest) => vest.style === activeStyle) ?? null
  const pick = activeStyle ? selections[activeStyle] : undefined
  const activeColor = activeVest
    ? getVestColor(activeVest.style, pick?.color || activeVest.colors[0].name)
    : undefined

  const updateSelection = (style: VestStyle, patch: Partial<CardSelection>) => {
    setSelections((prev) => {
      const current = prev[style] ?? { color: '', size: '' }
      return { ...prev, [style]: { ...current, ...patch } }
    })
    setError('')
  }

  const openVest = (vest: Vest) => {
    setError('')
    if (!selections[vest.style]?.color) {
      updateSelection(vest.style, { color: vest.colors[0].name })
    }
    setActiveStyle(vest.style)
  }

  const closeVest = () => {
    setActiveStyle(null)
    setError('')
  }

  const handleContinue = () => {
    if (!activeStyle) return
    const current = selections[activeStyle]
    const vestColor = current?.color ? getVestColor(activeStyle, current.color) : undefined
    if (!current?.color || !current?.size || !vestColor) {
      setError('Please choose a color and size to continue')
      return
    }

    const vestSelection: VestSelection = {
      style: activeStyle,
      color: current.color,
      size: current.size,
      sku: vestColor.sku,
      imageUrl: vestColor.imageUrl,
    }
    sessionStorage.setItem('vestSelection', JSON.stringify(vestSelection))
    router.push('/shipping')
  }

  return (
    <div className="min-h-screen px-4 py-10 relative" style={{ backgroundColor: '#00263a' }}>
      <ExportOrdersButton />
      <HelpIcon />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Choose Your Vest
          </h1>
          <p className="text-white/80">
            Click a style to pick color and size
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VESTS.map((vest) => {
            const preview = getVestColor(vest.style, vest.colors[0].name)
            return (
              <button
                key={vest.style}
                type="button"
                onClick={() => openVest(vest)}
                className="group bg-white rounded-lg shadow-lg p-5 text-left transition-shadow duration-200 hover:shadow-[0_0_22px_rgba(200,16,46,0.45)] focus:outline-none focus:ring-4 focus:ring-[#c8102e]"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{vest.name}</h2>
                {/* Square crop — photos are 1000x1000, so fill the card with no gray bars. */}
                <div className="aspect-square w-full overflow-hidden rounded-md">
                  <img
                    src={preview?.imageUrl}
                    alt={vest.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              </button>
            )
          })}
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

      {activeVest && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeVest}
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
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{activeVest.name}</h2>
              <button
                type="button"
                onClick={closeVest}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-md mb-4">
              <img
                src={activeColor?.imageUrl}
                alt={`${activeVest.name} ${activeColor?.name || ''}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="vest-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  id="vest-color"
                  value={pick?.color || ''}
                  onChange={(e) => updateSelection(activeVest.style, { color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                >
                  {activeVest.colors.map((c) => (
                    <option key={c.sku} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="vest-size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  id="vest-size"
                  value={pick?.size || ''}
                  onChange={(e) => updateSelection(activeVest.style, { size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#c8102e] focus:border-transparent bg-white"
                >
                  <option value="">Select size</option>
                  {VEST_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <a
                href={activeVest.sizeChartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 font-medium inline-block text-center"
                style={{ backgroundColor: '#c8102e' }}
              >
                Size Chart
              </a>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!pick?.color || !pick?.size}
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
