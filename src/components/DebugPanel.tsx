import { useState } from 'react';
import type { DebugData } from '../types';

interface DebugPanelProps {
  debug: DebugData;
}

function formatRub(value: number): string {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
}

function formatPercent(value: number): string {
  return (value * 100).toFixed(2) + '%';
}

function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

interface DebugRowProps {
  name: string;
  value: string;
  formula?: string;
  highlight?: 'green' | 'red' | 'yellow' | 'blue';
}

function DebugRow({ name, value, formula, highlight }: DebugRowProps) {
  const highlightClass = highlight
    ? {
        green: 'text-green-400',
        red: 'text-red-400',
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
      }[highlight]
    : 'text-gray-300';

  return (
    <div className="flex justify-between items-start py-1 border-b border-gray-700/50 last:border-0">
      <div className="flex-1">
        <span className="text-gray-400">{name}</span>
        {formula && (
          <span className="text-gray-500 text-xs ml-2">({formula})</span>
        )}
      </div>
      <span className={`font-mono ${highlightClass}`}>{value}</span>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg mb-2 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-750 flex items-center justify-between text-left transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-gray-200 font-medium">{title}</span>
        </span>
        <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="px-3 py-2 bg-gray-900/50 text-sm">
          {children}
        </div>
      )}
    </div>
  );
}

export function DebugPanel({ debug }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 flex items-center justify-between text-left transition-colors"
      >
        <span className="flex items-center gap-2 text-gray-300">
          <span className="text-lg">🔧</span>
          <span className="font-medium">Debug: Все промежуточные расчёты</span>
        </span>
        <span className="text-gray-500 text-sm">{isExpanded ? '▼ Свернуть' : '▶ Развернуть'}</span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-2 font-mono text-sm max-h-[70vh] overflow-y-auto">
          {/* Входные данные */}
          <Section title="Входные данные" icon="📥" defaultOpen>
            <DebugRow name="Цена продажи" value={formatRub(debug.input.sale_price)} />
            <DebugRow name="Закупочная цена" value={formatRub(debug.input.purchase_price)} />
            <DebugRow name="Размеры (В×Ш×Д)" value={debug.input.dimensions + ' см'} />
            <DebugRow name="Направление" value={debug.input.direction} />
            <DebugRow name="Тип доставки" value={debug.input.delivery_type} />
            <DebugRow name="Склад" value={debug.input.warehouse} />
            <DebugRow name="Категория" value={debug.input.category} />
          </Section>

          {/* Шаг 1: Объём */}
          <Section title="Шаг 1: Объём" icon="📦">
            <DebugRow
              name="volume"
              value={formatNumber(debug.volume, 3) + ' л'}
              formula="В × Ш × Д / 1000"
            />
            <DebugRow
              name="extra_volume"
              value={formatNumber(debug.extra_volume, 3) + ' л'}
              formula="max(0, volume - 1)"
            />
          </Section>

          {/* Шаг 2: Комиссия */}
          <Section title="Шаг 2: Комиссия МП" icon="💰">
            <DebugRow
              name="options_sum"
              value={formatPercent(debug.options_sum)}
              formula="сумма выбранных опций"
            />
            <DebugRow
              name="base_commission"
              value={debug.base_commission + '%'}
              formula="из справочника категорий"
            />
            <DebugRow
              name="clothing_discount"
              value={formatPercent(debug.clothing_discount)}
              formula="скидка для одежды/обуви"
              highlight={debug.clothing_discount < 0 ? 'green' : undefined}
            />
            <DebugRow
              name="commission_rate"
              value={formatPercent(debug.commission_rate)}
              formula="base/100 + options + discount"
              highlight="yellow"
            />
          </Section>

          {/* Шаг 3: Логистика */}
          <Section title="Шаг 3: Логистика" icon="🚚">
            {debug.small_volume_rate !== null && (
              <DebugRow
                name="small_volume_rate"
                value={formatNumber(debug.small_volume_rate)}
                formula="коэф. для малых объёмов"
              />
            )}
            <DebugRow
              name="location_index"
              value={formatNumber(debug.location_index_used, 0)}
              formula={debug.input.direction === 'FBO' ? 'из настроек' : '= 1 для FBS'}
            />
            <DebugRow
              name="logistics_cost"
              value={formatRub(debug.logistics_cost)}
              highlight="red"
            />
          </Section>

          {/* Шаг 4: Хранение и возвраты */}
          <Section title="Шаг 4: Хранение и обработка" icon="📋">
            <DebugRow
              name="storage_cost"
              value={formatRub(debug.storage_cost)}
              formula="бесплатно до 60 дней"
            />
            <DebugRow
              name="return_processing"
              value={formatRub(debug.return_processing)}
              formula="обработка возврата"
            />
          </Section>

          {/* Шаг 5: Удержания МП */}
          <Section title="Шаг 5: Удержания маркетплейса" icon="🏪">
            <DebugRow
              name="mp_to_client"
              value={formatRub(debug.mp_to_client)}
              formula="приёмка + хранение + логистика"
            />
            <DebugRow
              name="mp_commission"
              value={formatRub(debug.mp_commission)}
              formula="цена × commission_rate"
            />
            <DebugRow
              name="marketing_rub"
              value={formatRub(debug.marketing_rub)}
              formula="цена × marketing_rate"
            />
            <DebugRow
              name="acquiring_rub"
              value={formatRub(debug.acquiring_rub)}
              formula="цена × acquiring%"
            />
            <DebugRow
              name="buyout_rate"
              value={formatPercent(debug.buyout_rate)}
              formula="процент выкупа"
            />
            <DebugRow
              name="return_expense"
              value={formatRub(debug.return_expense)}
              formula="(1-buyout)/buyout × return_cost"
            />
            <DebugRow
              name="cashback_expense"
              value={formatRub(debug.cashback_expense)}
              formula="цена × cashback × 1.1"
            />
            <DebugRow
              name="mp_total"
              value={formatRub(debug.mp_total)}
              formula="сумма всех удержаний"
              highlight="red"
            />
          </Section>

          {/* Шаг 6: Цена возврата */}
          <Section title="Шаг 6: Полная цена возврата" icon="↩️">
            <DebugRow
              name="return_cost"
              value={formatRub(debug.return_cost)}
              formula={debug.input.direction === 'FBS'
                ? 'приёмка + доставка + доп.расходы + хранение + логистика + обработка + реклама'
                : 'хранение + логистика + обработка + реклама'}
            />
          </Section>

          {/* Шаг 7: Приход */}
          <Section title="Шаг 7: Приход на счёт" icon="💵">
            <DebugRow
              name="income"
              value={formatRub(debug.income)}
              formula="цена_продажи - mp_total"
              highlight={debug.income >= 0 ? 'green' : 'red'}
            />
          </Section>

          {/* Шаг 8: Налоги */}
          <Section title="Шаг 8: Налоги" icon="📊">
            <DebugRow
              name="tax_type"
              value={debug.tax_type}
              formula="режим налогообложения"
            />
            <DebugRow
              name="tax_base"
              value={formatRub(debug.tax_base)}
              formula={debug.tax_type === 'Налог с продаж' ? '= цена продажи' : '= income'}
            />
            <DebugRow
              name="tax_usn"
              value={formatRub(debug.tax_usn_rub)}
              formula="база × ставка УСН"
            />
            <DebugRow
              name="tax_nds"
              value={formatRub(debug.tax_nds_rub)}
              formula="база × ставка НДС"
            />
            <DebugRow
              name="tax_total"
              value={formatRub(debug.tax_total)}
              formula="УСН + НДС"
              highlight="red"
            />
          </Section>

          {/* Шаг 9: Себестоимость */}
          <Section title="Шаг 9: Себестоимость (реальные затраты)" icon="💸">
            <DebugRow
              name="purchase_price"
              value={formatRub(debug.purchase_price)}
              formula="закупочная цена"
            />
            <DebugRow
              name="defect_cost"
              value={formatRub(debug.defect_cost)}
              formula="закупка × defect_rate"
            />
            <DebugRow
              name="shipping"
              value={formatRub(debug.shipping_used)}
              formula={debug.input.direction === 'FBS' ? 'shipping_fbs' : 'shipping_fbo'}
            />
            <DebugRow
              name="extra_costs"
              value={formatRub(debug.extra_costs)}
              formula="доп. расходы"
            />
            <DebugRow
              name="real_costs"
              value={formatRub(debug.real_costs)}
              formula="закупка + брак + доставка + доп.расходы + налог"
              highlight="red"
            />
          </Section>

          {/* Шаг 10: Прибыль и маржа */}
          <Section title="Шаг 10: Прибыль и маржа" icon="📈" defaultOpen>
            <DebugRow
              name="profit"
              value={formatRub(debug.profit)}
              formula="income - real_costs"
              highlight={debug.profit >= 0 ? 'green' : 'red'}
            />
            <DebugRow
              name="margin_sales"
              value={formatPercent(debug.margin_sales)}
              formula="profit / цена_продажи"
            />
            <DebugRow
              name="margin_income"
              value={formatPercent(debug.margin_income)}
              formula="profit / |income|"
            />
            <DebugRow
              name="margin_type"
              value={debug.margin_type}
              formula="выбранный тип маржи"
              highlight="blue"
            />
            <DebugRow
              name="actual_margin"
              value={formatPercent(debug.actual_margin)}
              formula={debug.margin_type === 'Маржинальность прихода' ? '= margin_income' : '= margin_sales'}
              highlight="yellow"
            />
            <DebugRow
              name="min_margin_threshold"
              value={formatPercent(debug.min_margin_threshold)}
              formula="минимальная маржа из настроек"
            />
            <DebugRow
              name="roi"
              value={formatPercent(debug.roi)}
              formula="profit / real_costs"
              highlight={debug.roi >= 0 ? 'green' : 'red'}
            />
          </Section>

          {/* Шаг 11: Маркетинг */}
          <Section title="Шаг 11: Эффективность маркетинга" icon="📣">
            <DebugRow
              name="cpo"
              value={formatRub(debug.cpo)}
              formula="marketing_rate × цена"
            />
            <DebugRow
              name="cps"
              value={formatRub(debug.cps)}
              formula="(1/buyout) × цена × marketing_rate"
            />
            <DebugRow
              name="ad_percent_in_profit"
              value={formatPercent(debug.ad_percent_in_profit)}
              formula="cps / profit"
            />
          </Section>

          {/* Шаг 12: Итог */}
          <Section title="Шаг 12: Итоговое решение" icon="✨" defaultOpen>
            <DebugRow
              name="costs_no_purchase"
              value={formatRub(debug.costs_no_purchase)}
              formula="все расходы без закупки"
            />
            <DebugRow
              name="profit_per_unit"
              value={formatRub(debug.profit_per_unit)}
              formula="прибыль на 1 шт"
              highlight={debug.profit_per_unit >= 0 ? 'green' : 'red'}
            />
            <DebugRow
              name="profit_total"
              value={formatRub(debug.profit_total)}
              formula="profit × quantity"
              highlight={debug.profit_total >= 0 ? 'green' : 'red'}
            />
            <DebugRow
              name="revenue_total"
              value={formatRub(debug.revenue_total)}
              formula="цена × (1-spp) × quantity"
            />
            <DebugRow
              name="decision"
              value={debug.decision || '—'}
              highlight={debug.decision === '✅' ? 'green' : debug.decision === '❌' ? 'red' : undefined}
            />
            <DebugRow
              name="status"
              value={debug.status}
              highlight={debug.status === 'Срочно закупаем и продаем' ? 'green' : 'red'}
            />
          </Section>
        </div>
      )}
    </div>
  );
}
