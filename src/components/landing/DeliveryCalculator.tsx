'use client'

import { useMemo, useState } from 'react'
import {
  calculateDelivery,
  deliveryCarriers,
  deliveryCities,
  deliverySheets,
  type CarrierKey,
  type CityKey,
  type SheetKey,
} from '@/lib/delivery-calculator'

const rub = new Intl.NumberFormat('ru-RU', {
  currency: 'RUB',
  maximumFractionDigits: 0,
  style: 'currency',
})

function numberText(value: number, unit: string) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ${unit}`
}

export default function DeliveryCalculator() {
  const [carrierKey, setCarrierKey] = useState<CarrierKey>('dellin')
  const [cityKey, setCityKey] = useState<CityKey>('moscow')
  const [quantity, setQuantity] = useState(2)
  const [sheetKey, setSheetKey] = useState<SheetKey>('210x450')

  const result = useMemo(
    () => calculateDelivery({ carrierKey, cityKey, quantity, sheetKey }),
    [carrierKey, cityKey, quantity, sheetKey]
  )

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Расчёт доставки
          </p>
          <h2 className="font-[family-name:var(--font-family-display)] text-[clamp(28px,5vw,48px)] font-extrabold leading-tight text-[#0F0F0F]">
            Калькулятор доставки ROCKMESH
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#6B6B6B]">
            Подберите город, размер карты и количество — увидите вес, габарит, объём и предварительную стоимость доставки до вашей ТК.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-black/10 bg-[#F7F7F7] p-4 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#0F0F0F]">
                  Город доставки
                </span>
                <select
                  value={cityKey}
                  onChange={(event) => setCityKey(event.target.value as CityKey)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#0F0F0F] outline-none focus:border-[#FF6B00]"
                >
                  {deliveryCities.map((city) => (
                    <option key={city.key} value={city.key}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#0F0F0F]">
                  Размер карты
                </span>
                <select
                  value={sheetKey}
                  onChange={(event) => setSheetKey(event.target.value as SheetKey)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#0F0F0F] outline-none focus:border-[#FF6B00]"
                >
                  {deliverySheets.map((sheet) => (
                    <option key={sheet.key} value={sheet.key}>
                      {sheet.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#0F0F0F]">
                  Количество карт
                </span>
                <div className="flex h-12 overflow-hidden rounded-xl border border-black/10 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="w-12 border-r border-black/10 text-xl font-bold text-[#0F0F0F]"
                    aria-label="Уменьшить количество"
                  >
                    -
                  </button>
                  <input
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="min-w-0 flex-1 text-center text-sm font-bold text-[#0F0F0F] outline-none"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(200, value + 1))}
                    className="w-12 border-l border-black/10 text-xl font-bold text-[#0F0F0F]"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
              </label>

              <div>
                <span className="mb-2 block text-sm font-semibold text-[#0F0F0F]">
                  Транспортная компания
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {deliveryCarriers.map((carrier) => {
                    const active = carrier.key === carrierKey
                    return (
                      <button
                        key={carrier.key}
                        type="button"
                        onClick={() => setCarrierKey(carrier.key)}
                        className={`flex h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-bold transition ${
                          active
                            ? 'border-[#FF6B00] bg-white text-[#0F0F0F] shadow-[0_8px_24px_rgba(255,107,0,0.16)]'
                            : 'border-black/10 bg-white text-[#6B6B6B] hover:border-black/20'
                        }`}
                      >
                        <span>{carrier.name}</span>
                        <span className="text-xs font-semibold text-[#6B6B6B]">{carrier.kind}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <Metric label="Площадь" value={numberText(result.totals.areaM2, 'м²')} />
              <Metric label="Вес" value={numberText(result.totals.weightKg, 'кг')} />
              <Metric
                label="Габарит"
                value={`${result.package.lengthM} x ${result.package.widthM} x ${result.package.heightM} м`}
              />
              <Metric label="Товар" value={rub.format(result.totals.productPrice)} />
            </div>
          </div>

          <aside className="rounded-2xl bg-[#0F0F0F] p-5 text-white sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white/50">Предварительно</div>
                <div className="mt-1 font-[family-name:var(--font-family-display)] text-3xl font-extrabold">
                  {rub.format(result.delivery.priceMin)} - {rub.format(result.delivery.priceMax)}
                </div>
              </div>
              <span className="rounded-full bg-[#FF6B00] px-3 py-1 text-xs font-bold">
                {result.carrier.name}
              </span>
            </div>

            <div className="space-y-3 border-y border-white/10 py-5 text-sm">
              <Row label="Маршрут" value={`Чебоксары -> ${result.city.name}`} />
              <Row label="Срок" value={result.delivery.term} />
              <Row label="Объём" value={numberText(result.package.volumeM3, 'м³')} />
              <Row label="Статус" value={result.delivery.requiresManagerCheck ? 'нужна проверка' : 'можно считать'} />
            </div>

            {result.delivery.warnings.length > 0 && (
              <div className="mt-5 rounded-xl bg-[#FF6B00]/12 p-4 text-sm leading-relaxed text-[#FFD7BD]">
                {result.delivery.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            )}

            <p className="mt-5 text-xs leading-relaxed text-white/50">{result.delivery.notice}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">{label}</div>
      <div className="mt-1 text-sm font-bold text-[#0F0F0F]">{value}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/50">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}
