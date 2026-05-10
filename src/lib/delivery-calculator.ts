export type CarrierKey = 'dellin' | 'pek' | 'cdek'
export type CityKey = 'moscow' | 'spb' | 'kazan' | 'nn' | 'samara' | 'ekb'
export type SheetKey = '150x300' | '200x310' | '210x450'

type Sheet = {
  key: SheetKey
  label: string
  lengthM: number
  widthM: number
  areaM2: number
}

type City = {
  key: CityKey
  name: string
  distanceKm: number
}

type Carrier = {
  key: CarrierKey
  name: string
  kind: string
}

type DeliveryRate = {
  days: string
  min: number
  max: number
}

export type DeliveryCalculationInput = {
  carrierKey: CarrierKey
  cityKey: CityKey
  quantity: number
  sheetKey: SheetKey
}

export type DeliveryCalculation = {
  carrier: Carrier
  city: City
  delivery: {
    notice: string
    priceMin: number
    priceMax: number
    requiresManagerCheck: boolean
    term: string
    warnings: string[]
  }
  package: {
    heightM: number
    lengthM: number
    volumeM3: number
    widthM: number
  }
  sheet: Sheet
  totals: {
    areaM2: number
    productPrice: number
    weightKg: number
  }
}

const PRICE_PER_M2 = 150
const WEIGHT_PER_M2_KG = 0.65
const SHEET_STACK_HEIGHT_M = 0.018

export const deliverySheets: Sheet[] = [
  { key: '150x300', label: '1.5 x 3 м', lengthM: 3, widthM: 1.5, areaM2: 4.5 },
  { key: '200x310', label: '2 x 3.1 м', lengthM: 3.1, widthM: 2, areaM2: 6.2 },
  { key: '210x450', label: '2.1 x 4.5 м', lengthM: 4.5, widthM: 2.1, areaM2: 9.45 },
]

export const deliveryCities: City[] = [
  { key: 'moscow', name: 'Москва', distanceKm: 670 },
  { key: 'spb', name: 'Санкт-Петербург', distanceKm: 1370 },
  { key: 'kazan', name: 'Казань', distanceKm: 160 },
  { key: 'nn', name: 'Нижний Новгород', distanceKm: 240 },
  { key: 'samara', name: 'Самара', distanceKm: 510 },
  { key: 'ekb', name: 'Екатеринбург', distanceKm: 950 },
]

export const deliveryCarriers: Carrier[] = [
  { key: 'dellin', name: 'Деловые Линии', kind: 'ТК' },
  { key: 'pek', name: 'ПЭК', kind: 'ТК' },
  { key: 'cdek', name: 'СДЭК', kind: 'по согласованию' },
]

const deliveryRates: Record<CarrierKey, Record<CityKey, DeliveryRate>> = {
  dellin: {
    moscow: { days: '2-3 дня', min: 2100, max: 2600 },
    spb: { days: '3-5 дней', min: 2800, max: 3500 },
    kazan: { days: '1-2 дня', min: 1500, max: 2100 },
    nn: { days: '1-2 дня', min: 1600, max: 2200 },
    samara: { days: '2-4 дня', min: 2200, max: 2900 },
    ekb: { days: '4-6 дней', min: 3400, max: 4300 },
  },
  pek: {
    moscow: { days: '2-3 дня', min: 2000, max: 2550 },
    spb: { days: '3-5 дней', min: 2700, max: 3400 },
    kazan: { days: '1-2 дня', min: 1450, max: 2000 },
    nn: { days: '1-2 дня', min: 1550, max: 2150 },
    samara: { days: '2-4 дня', min: 2100, max: 2850 },
    ekb: { days: '4-6 дней', min: 3300, max: 4200 },
  },
  cdek: {
    moscow: { days: 'только после проверки габарита', min: 2600, max: 3900 },
    spb: { days: 'только после проверки габарита', min: 3400, max: 5200 },
    kazan: { days: 'только после проверки габарита', min: 2200, max: 3300 },
    nn: { days: 'только после проверки габарита', min: 2300, max: 3400 },
    samara: { days: 'только после проверки габарита', min: 2900, max: 4300 },
    ekb: { days: 'только после проверки габарита', min: 4200, max: 6500 },
  },
}

function byKey<T extends { key: string }>(items: readonly T[], key: string): T {
  const item = items.find((candidate) => candidate.key === key)
  if (!item) throw new Error(`Unknown delivery key: ${key}`)
  return item
}

function round(value: number, precision = 1) {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

export function calculateDelivery(input: DeliveryCalculationInput): DeliveryCalculation {
  const carrier = byKey(deliveryCarriers, input.carrierKey)
  const city = byKey(deliveryCities, input.cityKey)
  const sheet = byKey(deliverySheets, input.sheetKey)
  const quantity = Math.max(1, Math.min(200, Math.round(input.quantity || 1)))
  const rate = deliveryRates[carrier.key][city.key]
  const extraSheets = quantity - 1
  const heightM = Math.max(0.05, round(quantity * SHEET_STACK_HEIGHT_M, 3))
  const volumeM3 = round(sheet.lengthM * sheet.widthM * heightM, 2)
  const areaM2 = round(sheet.areaM2 * quantity, 2)
  const weightKg = round(areaM2 * WEIGHT_PER_M2_KG, 1)
  const longSheet = sheet.lengthM > 3
  const cdekCheck = carrier.key === 'cdek' && longSheet
  const warnings: string[] = []

  if (longSheet) warnings.push(`Длина карты ${sheet.lengthM} м: ТК может считать груз негабаритным.`)
  if (cdekCheck) warnings.push('Для СДЭК нужна ручная проверка терминала и допустимых габаритов.')

  return {
    carrier,
    city,
    delivery: {
      notice: 'Предварительная оценка по типовым тарифным диапазонам. Точную стоимость менеджер подтверждает в ТК.',
      priceMin: rate.min + extraSheets * 600,
      priceMax: rate.max + extraSheets * 700,
      requiresManagerCheck: cdekCheck || longSheet,
      term: rate.days,
      warnings,
    },
    package: {
      heightM,
      lengthM: sheet.lengthM,
      volumeM3,
      widthM: sheet.widthM,
    },
    sheet,
    totals: {
      areaM2,
      productPrice: Math.round(areaM2 * PRICE_PER_M2),
      weightKg,
    },
  }
}
