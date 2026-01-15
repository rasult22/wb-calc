import type { CalculationResult } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface Props {
  result: CalculationResult | null;
  isValid: boolean;
}

export function ResultCard({ result, isValid }: Props) {
  if (!isValid || !result) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
        Заполните все обязательные поля для расчёта
      </div>
    );
  }

  const isProfit = result.profit > 0;
  const decisionColor = result.decision === '✅'
    ? 'bg-green-100 border-green-500 text-green-800'
    : 'bg-red-100 border-red-500 text-red-800';

  return (
    <div className="space-y-4">
      {/* Главный результат */}
      <div className={`rounded-lg border-2 p-6 ${decisionColor}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl">{result.decision}</span>
          <span className="text-lg font-medium">{result.status}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm opacity-75">Чистая прибыль с 1 шт</div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.profit_per_unit)}
            </div>
          </div>
          <div>
            <div className="text-sm opacity-75">Прибыль партии</div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.profit_total)}
            </div>
          </div>
        </div>
      </div>

      {/* Показатели эффективности */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Показатели эффективности</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">ROI</div>
            <div className={`text-xl font-bold ${result.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(result.roi)}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Маржа продаж</div>
            <div className={`text-xl font-bold ${result.margin_sales >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(result.margin_sales)}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Маржа прихода</div>
            <div className={`text-xl font-bold ${result.margin_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(result.margin_income)}
            </div>
          </div>
        </div>
      </div>

      {/* Детализация расходов */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Детализация расходов</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Объём товара</span>
            <span className="font-medium">{result.volume.toFixed(2)} л</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Комиссия WB</span>
            <span className="font-medium">
              {formatPercent(result.commission_rate)} ({formatCurrency(result.mp_commission)})
            </span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Логистика</span>
            <span className="font-medium">{formatCurrency(result.logistics_cost)}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Хранение</span>
            <span className="font-medium">{formatCurrency(result.storage_cost)}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Обработка возврата</span>
            <span className="font-medium">{formatCurrency(result.return_processing)}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Полная цена возврата</span>
            <span className="font-medium">{formatCurrency(result.return_cost)}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Удержания МП итого</span>
            <span className="font-medium text-red-600">{formatCurrency(result.mp_total)}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Налог</span>
            <span className="font-medium">{formatCurrency(result.tax)}</span>
          </div>

          <div className="flex justify-between py-1 border-b bg-gray-50 -mx-4 px-4">
            <span className="text-gray-800 font-medium">Приход на счёт</span>
            <span className="font-bold">{formatCurrency(result.income)}</span>
          </div>

          <div className="flex justify-between py-1 border-b">
            <span className="text-gray-600">Реальные затраты</span>
            <span className="font-medium text-red-600">{formatCurrency(result.real_costs)}</span>
          </div>

          <div className="flex justify-between py-2 bg-purple-50 -mx-4 px-4 rounded-b-lg">
            <span className="text-purple-800 font-medium">Чистая прибыль</span>
            <span className={`font-bold text-lg ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(result.profit)}
            </span>
          </div>
        </div>
      </div>

      {/* Маркетинг */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Эффективность маркетинга</h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">CPO (цена заказа)</div>
            <div className="font-bold">{formatCurrency(result.cpo)}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">CPS (цена продажи)</div>
            <div className="font-bold">{formatCurrency(result.cps)}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Реклама в ЧП</div>
            <div className="font-bold">{formatPercent(result.ad_percent_in_profit)}</div>
          </div>
        </div>
      </div>

      {/* Выручка партии */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-80">Выручка партии</div>
            <div className="text-2xl font-bold">{formatCurrency(result.revenue_total)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Прибыль партии</div>
            <div className="text-2xl font-bold">{formatCurrency(result.profit_total)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
