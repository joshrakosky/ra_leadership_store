'use client'

import { useRouter } from 'next/navigation'
import ExportOrdersButton from '@/components/ExportOrdersButton'
import HelpIcon from '@/components/HelpIcon'
import RALogo from '@/components/RALogo'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ backgroundColor: '#00263a' }}>
      <ExportOrdersButton />
      <HelpIcon />
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="mb-3 flex justify-center">
            <RALogo className="max-w-[100px]" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Leadership
          </h2>
          <p className="text-gray-600">
            Select 1 product of your choice
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/products')}
          className="w-full text-white py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#c8102e] focus:ring-offset-2 transition-colors font-medium"
          style={{ backgroundColor: '#c8102e' }}
        >
          Start Shopping →
        </button>
      </div>
    </div>
  )
}
