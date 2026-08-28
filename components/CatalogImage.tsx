'use client'

import { useEffect, useState } from 'react'

// Catalog photos are 600x900. If the first color file is missing, try the next URL.
export default function CatalogImage({
  src,
  alt,
  className,
  fallbacks = [],
}: {
  src: string
  alt: string
  className?: string
  fallbacks?: string[]
}) {
  const candidates = [src, ...fallbacks].filter((url, index, list) => url && list.indexOf(url) === index)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [src])

  const current = candidates[index]
  if (!current) return null

  return (
    <img
      key={current}
      src={current}
      alt={alt}
      className={className}
      onError={() => setIndex((currentIndex) => currentIndex + 1)}
    />
  )
}
