// Hardcoded Airport Operations vest catalog.
// Images live in /public/images; SKU matches the image stem (no path or extension).

export const VEST_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'] as const

export type VestSize = (typeof VEST_SIZES)[number]

export const VEST_STYLES = ['F152', 'J903', 'L152', 'L903'] as const

export type VestStyle = (typeof VEST_STYLES)[number]

export interface VestColor {
  name: string
  imageUrl: string
  sku: string
}

export interface Vest {
  style: VestStyle
  name: string
  colors: VestColor[]
  sizeChartUrl: string
}

function color(colorName: string, fileStem: string): VestColor {
  return {
    name: colorName,
    imageUrl: `/images/${fileStem}.jpg`,
    sku: fileStem,
  }
}

export const VESTS: Vest[] = [
  {
    style: 'F152',
    name: 'Port Authority Accord Microfleece Vest',
    sizeChartUrl: 'https://www.sanmar.com/p/23100_Pewter/specSheetMeasurements',
    colors: [
      color('Black', 'RA-AO_F152_BLACK'),
      color('Navy', 'RA-AO_F152_NAVY'),
      color('Pewter', 'RA-AO_F152_PEWTER'),
    ],
  },
  {
    style: 'J903',
    name: 'Port Authority Collective Insulated Vest',
    sizeChartUrl: 'https://www.sanmar.com/p/9014_DeepBlack/specSheetMeasurements',
    colors: [
      color('Deep Black', 'RA-AO_J903_DEEP.BLACK'),
      color('Graphite', 'RA-AO_J903_GRAPHITE'),
      color('Gusty Grey', 'RA-AO_J903_GUSTY.GREY'),
    ],
  },
  {
    style: 'L152',
    name: "Port Authority Women's Accord Microfleece Vest",
    sizeChartUrl: 'https://www.sanmar.com/p/23092_Navy/specSheetMeasurements',
    colors: [
      color('Black', 'RA-AO_L152_BLACK'),
      color('Navy', 'RA-AO_L152_NAVY'),
      color('Pewter', 'RA-AO_L152_PEWTER'),
    ],
  },
  {
    style: 'L903',
    name: "Port Authority Women's Collective Insulated Vest",
    sizeChartUrl: 'https://www.sanmar.com/p/9013_White/specSheetMeasurements',
    colors: [
      color('Deep Black', 'RA-AO_L903_DEEP.BLACK'),
      color('Graphite', 'RA-AO_L903_GRAPHITE'),
      color('White', 'RA-AO_L903_WHITE'),
    ],
  },
]

export function getVest(style: string): Vest | undefined {
  return VESTS.find((vest) => vest.style === style)
}

export function getVestColor(style: string, colorName: string): VestColor | undefined {
  return getVest(style)?.colors.find((c) => c.name === colorName)
}

export function isVestSize(size: string): size is VestSize {
  return (VEST_SIZES as readonly string[]).includes(size)
}
