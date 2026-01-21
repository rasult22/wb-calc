// Настройки ИП
export interface IPSettings {
  id: string;
  name: string;
  margin_type: 'Маржинальность прихода' | 'Маржинальность продаж';
  min_margin: number;
  tax_usn: number;
  tax_type: 'Налог с продаж' | 'Налог с прихода';
  tax_nds: number;
  acquiring: number;
  selected_options: string[];
}

// Значения по умолчанию для нового ИП
export const DEFAULT_IP_SETTINGS: Omit<IPSettings, 'id'> = {
  name: '',
  margin_type: 'Маржинальность прихода',
  min_margin: 0.1,
  tax_usn: 0.06,
  tax_type: 'Налог с продаж',
  tax_nds: 0,
  acquiring: 0.02,
  selected_options: [],
};

// Категория комиссий
export interface CategoryCommission {
  category: string;
  subject: string;
  commission_fbo: number;
  commission_fbs_to_wb: number;
  commission_fbs_direct: number;
}

// Склад
export interface Warehouse {
  name: string;
  delivery_type: 'Короб' | 'Моно';
  delivery_1l: number;
  delivery_extra_l: number;
  storage_1l: number;
  storage_extra_l: number;
}

// Опция тарифа
export interface TariffOption {
  name: string;
  type: 'Опция' | 'Пакет';
  rate: number;
}

// Базовые тарифы логистики
export interface LogisticsRates {
  box: {
    delivery_1l: number;
    delivery_extra_l: number;
    storage_1l: number;
    storage_extra_l: number;
    return_processing: number;
  };
  mono: {
    delivery_1l: number;
    delivery_extra_l: number;
    storage_1l: number;
    storage_extra_l: number;
    storage_monopalette: number;
    return_processing: number;
  };
  volume_coefficients: Record<string, number>;
}

// Входные данные товара
export interface ProductInput {
  sku: string;
  purchase_price: number;
  sale_price: number;
  quantity: number;
  category_wb: string;
  height: number;
  width: number;
  length: number;

  // Опциональные
  is_active: boolean;
  manager: string;
  spp_percent: number;
  cashback: number;
  days_to_sell: number;
  shipping_fbo: number;
  shipping_fbs: number;
  extra_costs: number;
  buyout_rate: number;
  defect_rate: number;
  marketing_rate: number;

  // Выбор
  ip_name: string;
  platform: 'WB';
  direction: 'FBO' | 'FBS';
  warehouse: string;
  delivery_type: 'Короб' | 'Моно';
  location_index: number;
  acceptance_coef: number;
  acceptance_price: number;
}

// Результат расчёта
export interface CalculationResult {
  // Основные показатели
  profit_per_unit: number;
  profit_total: number;
  revenue_total: number;
  roi: number;
  margin_sales: number;
  margin_income: number;

  // Промежуточные
  volume: number;
  extra_volume: number;
  commission_rate: number;
  logistics_cost: number;
  storage_cost: number;
  return_processing: number;
  return_cost: number;
  mp_to_client: number;
  mp_commission: number;
  mp_total: number;
  tax: number;
  costs_no_purchase: number;
  real_costs: number;
  income: number;
  profit: number;

  // Маркетинг
  cpo: number;
  cps: number;
  ad_percent_in_profit: number;

  // Решение
  decision: '✅' | '❌' | '';
  status: string;
}

// Debug данные - все промежуточные значения расчёта
export interface DebugData {
  // Входные данные (для контекста)
  input: {
    sale_price: number;
    purchase_price: number;
    dimensions: string;
    direction: string;
    delivery_type: string;
    warehouse: string;
    warehouse_delivery_1l: number;
    warehouse_delivery_extra: number;
    warehouse_storage_1l: number;
    category: string;
    category_commission: number;
  };

  // Шаг 1: Объём
  volume: number;
  extra_volume: number;

  // Шаг 2: Комиссия
  options_sum: number;
  base_commission: number;
  clothing_discount: number;
  commission_rate: number;

  // Шаг 3: Логистика
  small_volume_rate: number | null;
  location_index_used: number;
  logistics_cost: number;

  // Шаг 4: Хранение и возвраты
  storage_cost: number;
  return_processing: number;

  // Шаг 5: Удержания МП
  acquiring_rub: number;
  mp_to_client: number;
  mp_commission: number;
  marketing_rub: number;
  buyout_rate: number;
  return_expense: number;
  cashback_expense: number;
  mp_total: number;

  // Шаг 6: Цена возврата
  return_cost: number;

  // Шаг 7: Приход
  income: number;

  // Шаг 8: Налоги
  tax_type: string;
  tax_base: number;
  tax_usn_rub: number;
  tax_nds_rub: number;
  tax_total: number;

  // Шаг 9: Себестоимость
  defect_cost: number;
  shipping_used: number;
  extra_costs: number;
  purchase_price: number;
  real_costs: number;

  // Шаг 10: Прибыль и маржа
  profit: number;
  margin_sales: number;
  margin_income: number;
  actual_margin: number;
  margin_type: string;
  min_margin_threshold: number;
  roi: number;

  // Шаг 11: Маркетинг
  cpo: number;
  cps: number;
  ad_percent_in_profit: number;

  // Шаг 12: Итог
  costs_no_purchase: number;
  profit_per_unit: number;
  profit_total: number;
  revenue_total: number;
  decision: string;
  status: string;
}

// Значения по умолчанию для формы
export const DEFAULT_PRODUCT_INPUT: ProductInput = {
  sku: '',
  purchase_price: 0,
  sale_price: 0,
  quantity: 1,
  category_wb: '',
  height: 10,
  width: 10,
  length: 10,
  is_active: true,
  manager: '',
  spp_percent: 0.26,
  cashback: 0,
  days_to_sell: 30,
  shipping_fbo: 0,
  shipping_fbs: 0,
  extra_costs: 0,
  buyout_rate: 0.95,
  defect_rate: 0.003,
  marketing_rate: 0.02,
  ip_name: '',
  platform: 'WB',
  direction: 'FBO',
  warehouse: '',
  delivery_type: 'Короб',
  location_index: 1,
  acceptance_coef: 0,
  acceptance_price: 0,
};
