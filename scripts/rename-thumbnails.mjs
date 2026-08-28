// Rename vendor thumbs to RA-AP-{SKU}_{Color}.jpg so they match the catalog image_url paths.
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'public', 'images')

const skuFix = {
  COTOM1961: 'COTOM1691',
  COTOW1962: 'COTOW1692',
}

const colorFix = {
  ATLANTIC: 'AtlanticBlack',
  CREAM: 'CreamFjord',
  SMOKE: 'SmokeCinder',
}

function toColorSlug(raw) {
  const upper = raw.toUpperCase()
  if (colorFix[upper]) return colorFix[upper]
  return raw
    .replace(/HTHR/gi, 'HEATHER')
    .split('.')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

const files = fs.readdirSync(DIR).filter((name) => name.toLowerCase().endsWith('.jpg'))
const plan = []

for (const name of files) {
  if (name.startsWith('RA-AP-')) {
    plan.push({ from: name, to: name, skip: 'already catalog-named' })
    continue
  }
  const match = name.match(/^RA_([^_]+)_(.+)\.jpe?g$/i)
  if (!match) {
    plan.push({ from: name, to: null, skip: 'unrecognized pattern' })
    continue
  }
  const sku = skuFix[match[1]] || match[1]
  const to = `RA-AP-${sku}_${toColorSlug(match[2])}.jpg`
  plan.push({ from: name, to })
}

const collisions = new Map()
for (const row of plan) {
  if (!row.to || row.from === row.to) continue
  collisions.set(row.to, (collisions.get(row.to) || []).concat(row.from))
}

for (const [dest, sources] of collisions) {
  if (sources.length > 1) {
    console.error('COLLISION', dest, sources)
    process.exit(1)
  }
}

for (const row of plan) {
  if (!row.to || row.from === row.to) {
    console.log(`skip ${row.from}${row.skip ? ` (${row.skip})` : ''}`)
    continue
  }
  const fromPath = path.join(DIR, row.from)
  const tmpPath = path.join(DIR, `${row.from}.renaming`)
  fs.renameSync(fromPath, tmpPath)
  row.tmp = tmpPath
}

for (const row of plan) {
  if (!row.tmp) continue
  const toPath = path.join(DIR, row.to)
  if (fs.existsSync(toPath)) {
    console.error(`exists ${row.to}, leaving ${row.from}`)
    fs.renameSync(row.tmp, path.join(DIR, row.from))
    continue
  }
  fs.renameSync(row.tmp, toPath)
  console.log(`${row.from} -> ${row.to}`)
}
