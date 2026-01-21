import type {
  ProductInput,
  CalculationResult,
  IPSettings,
  Warehouse,
  CategoryCommission,
  TariffOption,
  DebugData,
} from '../types';
import { logisticsRates } from '../data/logisticsRates';

/**
 * Расчёт объёма товара в литрах
 */
export function calculateVolume(height: number, width: number, length: number): number {
  return (height * width * length) / 1000;
}

/**
 * Расчёт дополнительного объёма (сверх 1 литра)
 */
export function calculateExtraVolume(volume: number): number {
  return Math.max(0, volume - 1);
}

/**
 * Получение коэффициента для малых объёмов
 */
function getSmallVolumeRate(volume: number): number {
  const coefficients = logisticsRates.volume_coefficients;

  if (volume <= 0.2) return coefficients['0.2'];
  if (volume <= 0.4) return coefficients['0.4'];
  if (volume <= 0.6) return coefficients['0.6'];
  if (volume <= 0.8) return coefficients['0.8'];
  return coefficients['1.0'];
}

/**
 * Расчёт стоимости логистики
 */
export function calculateLogistics(
  volume: number,
  extraVolume: number,
  warehouse: Warehouse,
  direction: 'FBO' | 'FBS',
  locationIndex: number,
  deliveryType: 'Короб' | 'Моно'
): number {
  const baseRate = deliveryType === 'Короб'
    ? logisticsRates.box.delivery_1l
    : logisticsRates.mono.delivery_1l;

  if (volume <= 1) {
    // Для малых объёмов — фиксированные ставки
    const smallVolumeRate = getSmallVolumeRate(volume);
    return (smallVolumeRate * warehouse.delivery_1l) / baseRate;
  }

  // Для объёмов > 1л
  const il = direction === 'FBO' ? locationIndex : 1;
  return il * warehouse.delivery_1l + il * warehouse.delivery_extra_l * extraVolume;
}

/**
 * Расчёт хранения (на WB бесплатно до 60 дней)
 */
export function calculateStorage(): number {
  // На WB хранение бесплатно до 60 дней
  return 0;
}

/**
 * Получение стоимости обработки возврата
 */
export function getReturnProcessing(deliveryType: 'Короб' | 'Моно'): number {
  return deliveryType === 'Короб'
    ? logisticsRates.box.return_processing
    : logisticsRates.mono.return_processing;
}

/**
 * Расчёт суммы процентов выбранных опций тарифов
 */
export function calculateOptionsSum(
  selectedOptions: string[],
  tariffOptions: TariffOption[]
): number {
  return selectedOptions.reduce((sum, optName) => {
    const opt = tariffOptions.find(o => o.name === optName);
    return sum + (opt?.rate || 0);
  }, 0);
}

/**
 * Расчёт комиссии маркетплейса
 */
export function calculateCommission(
  category: CategoryCommission,
  direction: 'FBO' | 'FBS',
  optionsSum: number,
  parentCategory: string
): number {
  return calculateCommissionWithDetails(category, direction, optionsSum, parentCategory).rate;
}

/**
 * Расчёт комиссии с детализацией (для debug)
 */
export function calculateCommissionWithDetails(
  category: CategoryCommission,
  direction: 'FBO' | 'FBS',
  optionsSum: number,
  parentCategory: string
): { rate: number; baseCommission: number; clothingDiscount: number } {
  // Базовая комиссия из справочника
  const baseCommission = direction === 'FBO'
    ? category.commission_fbo
    : category.commission_fbs_to_wb;

  // Скидка для категорий "Одежда" и "Обувь"
  let clothingDiscount = 0;
  if ((parentCategory === 'Одежда' || parentCategory === 'Обувь') && optionsSum >= 0.05) {
    clothingDiscount = -0.03; // -3% скидка
  } else if (optionsSum >= 0.01 && baseCommission >= 14.5 &&
             parentCategory !== 'Одежда' && parentCategory !== 'Обувь') {
    clothingDiscount = -0.01; // -1% скидка для других категорий
  }

  return {
    rate: baseCommission / 100 + optionsSum + clothingDiscount,
    baseCommission,
    clothingDiscount,
  };
}

/**
 * Расчёт полной цены возврата
 */
export function calculateReturnCost(
  direction: 'FBO' | 'FBS',
  acceptancePrice: number,
  shippingFbs: number,
  extraCosts: number,
  storageCost: number,
  logisticsCost: number,
  returnProcessing: number,
  salePrice: number,
  marketingRate: number
): number {
  if (direction === 'FBS') {
    return acceptancePrice + shippingFbs + extraCosts + storageCost +
           logisticsCost + returnProcessing + salePrice * marketingRate;
  }
  return storageCost + logisticsCost + returnProcessing + salePrice * marketingRate;
}

/**
 * Основной расчёт Unit-экономики
 */
export function calculateUnitEconomics(
  input: ProductInput,
  ipSettings: IPSettings,
  warehouse: Warehouse,
  category: CategoryCommission,
  tariffOptions: TariffOption[]
): CalculationResult {
  // 1. Объём
  const volume = calculateVolume(input.height, input.width, input.length);
  const extraVolume = calculateExtraVolume(volume);

  // 2. Сумма опций тарифов
  const optionsSum = calculateOptionsSum(ipSettings.selected_options || [], tariffOptions);

  // 3. Комиссия
  const commissionRate = calculateCommission(
    category,
    input.direction,
    optionsSum,
    category.category
  );

  // 4. Логистика
  const logisticsCost = calculateLogistics(
    volume,
    extraVolume,
    warehouse,
    input.direction,
    input.location_index,
    input.delivery_type
  );

  // 5. Хранение (бесплатно)
  const storageCost = calculateStorage();

  // 6. Обработка возврата
  const returnProcessing = getReturnProcessing(input.delivery_type);

  // 7. Эквайринг
  const acquiring = input.sale_price * ipSettings.acquiring;

  // 8. МП → Клиент
  const mpToClient = input.acceptance_price + storageCost + logisticsCost;

  // 9. Комиссия МП в рублях
  const mpCommission = input.sale_price * commissionRate;

  // 10. Цена возврата
  const returnCost = calculateReturnCost(
    input.direction,
    input.acceptance_price,
    input.shipping_fbs,
    input.extra_costs,
    storageCost,
    logisticsCost,
    returnProcessing,
    input.sale_price,
    input.marketing_rate
  );

  // 11. Удержания МП итого
  const buyoutRate = input.buyout_rate || 0.95;
  const returnExpense = buyoutRate < 1 ? ((1 - buyoutRate) / buyoutRate) * returnCost : 0;
  const cashbackExpense = input.sale_price * input.cashback * 1.1;

  const mpTotal = mpToClient +
                  mpCommission +
                  input.sale_price * input.marketing_rate +
                  returnExpense +
                  acquiring +
                  cashbackExpense;

  // 12. Приход на счёт
  const income = input.sale_price - mpTotal;

  // 13. Налог
  let taxBase: number;
  if (ipSettings.tax_type === 'Налог с продаж') {
    taxBase = input.sale_price;
  } else {
    taxBase = income;
  }
  const tax = taxBase * ipSettings.tax_usn + taxBase * ipSettings.tax_nds;

  // 14. Реально тратим
  const shipping = input.direction === 'FBS' ? input.shipping_fbs : input.shipping_fbo;
  const realCosts = input.purchase_price * input.defect_rate +
                    shipping +
                    input.extra_costs +
                    tax +
                    input.purchase_price;

  // 15. Чистая прибыль
  const profit = income - realCosts;

  // 16. Косты без закупки
  const costsNoPurchase = input.purchase_price * input.defect_rate +
                          shipping +
                          input.extra_costs +
                          mpTotal +
                          tax;

  // 17. Показатели эффективности
  const roi = realCosts !== 0 ? profit / realCosts : 0;
  const marginSales = input.sale_price !== 0 ? profit / input.sale_price : 0;
  const marginIncome = income !== 0 ? profit / Math.abs(income) : 0;

  // 18. Прибыль партии
  const profitPerUnit = profit;
  const profitTotal = profitPerUnit * input.quantity;
  const revenueTotal = input.sale_price * (1 - input.spp_percent) * input.quantity;

  // 19. CPO и CPS
  const cpo = input.marketing_rate * input.sale_price;
  const cps = (1 / buyoutRate) * input.sale_price * input.marketing_rate;
  const adPercentInProfit = profit !== 0 ? cps / profit : 0;

  // 20. Решение
  const actualMargin = ipSettings.margin_type === 'Маржинальность прихода'
    ? marginIncome
    : marginSales;

  const status = actualMargin >= ipSettings.min_margin
    ? 'Срочно закупаем и продаем'
    : 'Недостаточная маржа';

  const decision = input.is_active
    ? (status === 'Срочно закупаем и продаем' ? '✅' : '❌')
    : '';

  return {
    profit_per_unit: profitPerUnit,
    profit_total: profitTotal,
    revenue_total: revenueTotal,
    roi,
    margin_sales: marginSales,
    margin_income: marginIncome,
    volume,
    extra_volume: extraVolume,
    commission_rate: commissionRate,
    logistics_cost: logisticsCost,
    storage_cost: storageCost,
    return_processing: returnProcessing,
    return_cost: returnCost,
    mp_to_client: mpToClient,
    mp_commission: mpCommission,
    mp_total: mpTotal,
    tax,
    costs_no_purchase: costsNoPurchase,
    real_costs: realCosts,
    income,
    profit,
    cpo,
    cps,
    ad_percent_in_profit: adPercentInProfit,
    decision,
    status,
  };
}

/**
 * Форматирование числа как валюты
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Форматирование числа как процента
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Получение коэффициента для малых объёмов (экспорт для debug)
 */
export function getSmallVolumeRateForDebug(volume: number): number | null {
  if (volume > 1) return null;

  const coefficients = logisticsRates.volume_coefficients;
  if (volume <= 0.2) return coefficients['0.2'];
  if (volume <= 0.4) return coefficients['0.4'];
  if (volume <= 0.6) return coefficients['0.6'];
  if (volume <= 0.8) return coefficients['0.8'];
  return coefficients['1.0'];
}

/**
 * Расчёт Unit-экономики с полной debug информацией
 */
export function calculateUnitEconomicsWithDebug(
  input: ProductInput,
  ipSettings: IPSettings,
  warehouse: Warehouse,
  category: CategoryCommission,
  tariffOptions: TariffOption[]
): { result: CalculationResult; debug: DebugData } {
  // 1. Объём
  const volume = calculateVolume(input.height, input.width, input.length);
  const extraVolume = calculateExtraVolume(volume);

  // 2. Сумма опций тарифов
  const optionsSum = calculateOptionsSum(ipSettings.selected_options || [], tariffOptions);

  // 3. Комиссия (с детализацией)
  const commissionDetails = calculateCommissionWithDetails(
    category,
    input.direction,
    optionsSum,
    category.category
  );
  const commissionRate = commissionDetails.rate;

  // 4. Логистика
  const smallVolumeRate = getSmallVolumeRateForDebug(volume);
  const locationIndexUsed = input.direction === 'FBO' ? input.location_index : 1;
  const logisticsCost = calculateLogistics(
    volume,
    extraVolume,
    warehouse,
    input.direction,
    input.location_index,
    input.delivery_type
  );

  // 5. Хранение (бесплатно)
  const storageCost = calculateStorage();

  // 6. Обработка возврата
  const returnProcessing = getReturnProcessing(input.delivery_type);

  // 7. Эквайринг
  const acquiring = input.sale_price * ipSettings.acquiring;

  // 8. МП → Клиент
  const mpToClient = input.acceptance_price + storageCost + logisticsCost;

  // 9. Комиссия МП в рублях
  const mpCommission = input.sale_price * commissionRate;

  // 10. Маркетинг в рублях
  const marketingRub = input.sale_price * input.marketing_rate;

  // 11. Цена возврата
  const returnCost = calculateReturnCost(
    input.direction,
    input.acceptance_price,
    input.shipping_fbs,
    input.extra_costs,
    storageCost,
    logisticsCost,
    returnProcessing,
    input.sale_price,
    input.marketing_rate
  );

  // 12. Удержания МП итого
  const buyoutRate = input.buyout_rate || 0.95;
  const returnExpense = buyoutRate < 1 ? ((1 - buyoutRate) / buyoutRate) * returnCost : 0;
  const cashbackExpense = input.sale_price * input.cashback * 1.1;

  const mpTotal = mpToClient +
                  mpCommission +
                  marketingRub +
                  returnExpense +
                  acquiring +
                  cashbackExpense;

  // 13. Приход на счёт
  const income = input.sale_price - mpTotal;

  // 14. Налог
  let taxBase: number;
  if (ipSettings.tax_type === 'Налог с продаж') {
    taxBase = input.sale_price;
  } else {
    taxBase = income;
  }
  const taxUsnRub = taxBase * ipSettings.tax_usn;
  const taxNdsRub = taxBase * ipSettings.tax_nds;
  const tax = taxUsnRub + taxNdsRub;

  // 15. Реально тратим
  const shipping = input.direction === 'FBS' ? input.shipping_fbs : input.shipping_fbo;
  const defectCost = input.purchase_price * input.defect_rate;
  const realCosts = defectCost +
                    shipping +
                    input.extra_costs +
                    tax +
                    input.purchase_price;

  // 16. Чистая прибыль
  const profit = income - realCosts;

  // 17. Косты без закупки
  const costsNoPurchase = defectCost +
                          shipping +
                          input.extra_costs +
                          mpTotal +
                          tax;

  // 18. Показатели эффективности
  const roi = realCosts !== 0 ? profit / realCosts : 0;
  const marginSales = input.sale_price !== 0 ? profit / input.sale_price : 0;
  const marginIncome = income !== 0 ? profit / Math.abs(income) : 0;

  // 19. Прибыль партии
  const profitPerUnit = profit;
  const profitTotal = profitPerUnit * input.quantity;
  const revenueTotal = input.sale_price * (1 - input.spp_percent) * input.quantity;

  // 20. CPO и CPS
  const cpo = input.marketing_rate * input.sale_price;
  const cps = (1 / buyoutRate) * input.sale_price * input.marketing_rate;
  const adPercentInProfit = profit !== 0 ? cps / profit : 0;

  // 21. Решение
  const actualMargin = ipSettings.margin_type === 'Маржинальность прихода'
    ? marginIncome
    : marginSales;

  const status = actualMargin >= ipSettings.min_margin
    ? 'Срочно закупаем и продаем'
    : 'Недостаточная маржа';

  const decision = input.is_active
    ? (status === 'Срочно закупаем и продаем' ? '✅' : '❌')
    : '';

  const result: CalculationResult = {
    profit_per_unit: profitPerUnit,
    profit_total: profitTotal,
    revenue_total: revenueTotal,
    roi,
    margin_sales: marginSales,
    margin_income: marginIncome,
    volume,
    extra_volume: extraVolume,
    commission_rate: commissionRate,
    logistics_cost: logisticsCost,
    storage_cost: storageCost,
    return_processing: returnProcessing,
    return_cost: returnCost,
    mp_to_client: mpToClient,
    mp_commission: mpCommission,
    mp_total: mpTotal,
    tax,
    costs_no_purchase: costsNoPurchase,
    real_costs: realCosts,
    income,
    profit,
    cpo,
    cps,
    ad_percent_in_profit: adPercentInProfit,
    decision,
    status,
  };

  const debug: DebugData = {
    // Входные данные
    input: {
      sale_price: input.sale_price,
      purchase_price: input.purchase_price,
      dimensions: `${input.height}×${input.width}×${input.length}`,
      direction: input.direction,
      delivery_type: input.delivery_type,
      warehouse: warehouse.name,
      warehouse_delivery_1l: warehouse.delivery_1l,
      warehouse_delivery_extra: warehouse.delivery_extra_l,
      warehouse_storage_1l: warehouse.storage_1l,
      category: `${category.category} → ${category.subject}`,
      category_commission: input.direction === 'FBO' ? category.commission_fbo : category.commission_fbs_to_wb,
    },

    // Шаг 1: Объём
    volume,
    extra_volume: extraVolume,

    // Шаг 2: Комиссия
    options_sum: optionsSum,
    base_commission: commissionDetails.baseCommission,
    clothing_discount: commissionDetails.clothingDiscount,
    commission_rate: commissionRate,

    // Шаг 3: Логистика
    small_volume_rate: smallVolumeRate,
    location_index_used: locationIndexUsed,
    logistics_cost: logisticsCost,

    // Шаг 4: Хранение и возвраты
    storage_cost: storageCost,
    return_processing: returnProcessing,

    // Шаг 5: Удержания МП
    acquiring_rub: acquiring,
    mp_to_client: mpToClient,
    mp_commission: mpCommission,
    marketing_rub: marketingRub,
    buyout_rate: buyoutRate,
    return_expense: returnExpense,
    cashback_expense: cashbackExpense,
    mp_total: mpTotal,

    // Шаг 6: Цена возврата
    return_cost: returnCost,

    // Шаг 7: Приход
    income,

    // Шаг 8: Налоги
    tax_type: ipSettings.tax_type,
    tax_base: taxBase,
    tax_usn_rub: taxUsnRub,
    tax_nds_rub: taxNdsRub,
    tax_total: tax,

    // Шаг 9: Себестоимость
    defect_cost: defectCost,
    shipping_used: shipping,
    extra_costs: input.extra_costs,
    purchase_price: input.purchase_price,
    real_costs: realCosts,

    // Шаг 10: Прибыль и маржа
    profit,
    margin_sales: marginSales,
    margin_income: marginIncome,
    actual_margin: actualMargin,
    margin_type: ipSettings.margin_type,
    min_margin_threshold: ipSettings.min_margin,
    roi,

    // Шаг 11: Маркетинг
    cpo,
    cps,
    ad_percent_in_profit: adPercentInProfit,

    // Шаг 12: Итог
    costs_no_purchase: costsNoPurchase,
    profit_per_unit: profitPerUnit,
    profit_total: profitTotal,
    revenue_total: revenueTotal,
    decision,
    status,
  };

  return { result, debug };
}
