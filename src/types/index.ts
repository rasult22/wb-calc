// Настройки ИП
export interface IPSettings {
  name: string;
  margin_type: 'Маржинальность прихода' | 'Маржинальность продаж';
  min_margin: number;
  tax_usn: number;
  tax_type: 'Налог с продаж' | 'Налог с прихода';
  tax_nds: number;
  acquiring: number;
  selected_options?: string[];
}

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
