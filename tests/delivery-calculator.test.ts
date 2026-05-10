import test from 'node:test'
import assert from 'node:assert/strict'

import { calculateDelivery } from '../src/lib/delivery-calculator.ts'

test('calculates sheet area, weight, product total and delivery range', () => {
  const result = calculateDelivery({
    carrierKey: 'dellin',
    cityKey: 'moscow',
    quantity: 2,
    sheetKey: '210x450',
  })

  assert.equal(result.sheet.areaM2, 9.45)
  assert.equal(result.totals.areaM2, 18.9)
  assert.equal(result.totals.weightKg, 12.3)
  assert.equal(result.totals.productPrice, 2835)
  assert.equal(result.delivery.priceMin, 2700)
  assert.equal(result.delivery.priceMax, 3300)
  assert.match(result.delivery.notice, /предварительная/i)
})

test('marks CDEK as confirmation-only for long mesh sheets', () => {
  const result = calculateDelivery({
    carrierKey: 'cdek',
    cityKey: 'spb',
    quantity: 1,
    sheetKey: '210x450',
  })

  assert.equal(result.carrier.key, 'cdek')
  assert.equal(result.delivery.requiresManagerCheck, true)
  assert.match(result.delivery.warnings.join(' '), /длина.*4.5/i)
})
