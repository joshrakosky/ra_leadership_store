'use client'

import { useState } from 'react'

// Catalog photos land in /public/images as SKU_Color.jpg. Until they exist, fall back quietly.
export default function CatalogImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <img
      src={failed ? '/file.svg' : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
