/**
 * Тестовый кейс "ресницы" из Excel (строка 141)
 * Все значения проверены вручную и соответствуют расчетам в Excel
 */

import type { ProductInput, IPSettings, Warehouse, CategoryCommission } from '../../../types';

// Входные данные товара
export const resnitsyInput: ProductInput = {
  sku: 'resnitsy-test',
  purchase_price: 146,
  sale_price: 600,
  quantity: 3600,
  category_wb: 'Накладные ресницы',
  height: 3,
  width: 16,
  length: 18,
  is_active: true,
  manager: 'Имя',
  spp_percent: 0,
  cashback: 0,
  days_to_sell: 30,
  shipping_fbo: 0,
  shipping_fbs: 0,
  extra_costs: 0,
  buyout_rate: 0.95,
  defect_rate: 0.002, // 0.2% - выведено из расчета real_costs
  marketing_rate: 0.01, // 1%
  ip_name: 'ип Samga',
  platform: 'WB',
  direction: 'FBO',
  warehouse: 'Коледино',
  delivery_type: 'Короб',
  location_index: 1.0,
  acceptance_coef: 0,
  acceptance_price: 0,
};

// Настройки ИП "ип Samga"
export const resnitsyIPSettings: IPSettings = {
  id: 'samga',
  name: 'ип Samga',
  margin_type: 'Маржинальность прихода',
  min_margin: 0.10, // 10%
  tax_usn: 0.04, // 4%
  tax_type: 'Налог с продаж',
  tax_nds: 0,
  acquiring: 0.02, // 2%
  selected_options: [],
};

// Склад Коледино (Короб)
export const koledinoWarehouse: Warehouse = {
  name: 'Коледино',
  delivery_type: 'Короб',
  delivery_1l: 92,
  delivery_extra_l: 28,
  storage_1l: 0.16,
  storage_extra_l: 0.16,
};

// Категория "Накладные ресницы"
export const resnitsyCategory: CategoryCommission = {
  category: 'Красота',
  subject: 'Накладные ресницы',
  commission_fbo: 32.5,
  commission_fbs_to_wb: 32.5,
  commission_fbs_direct: 32.5,
};

// Ожидаемые промежуточные результаты (из Excel)
export const expectedResults = {
  // Шаг 1: Объем
  volume: 0.864,
  extra_volume: 0,

  // Шаг 2: Логистика
  logistics_cost: 64.00,

  // Шаг 3: Обработка возврата
  return_processing: 50.00,

  // Шаг 4: Цена возврата
  return_cost: 120.00, // storage(0) + logistics(64) + return_processing(50) + marketing(6)

  // Шаг 5: Комиссия МП
  commission_rate: 0.325, // 32.5%
  mp_commission: 195.00, // 600 * 32.5%

  // Шаг 6: Эквайринг
  acquiring: 12.00, // 600 * 2%

  // Шаг 7: Маркетинг
  marketing_rub: 6.00, // 600 * 1%

  // Шаг 8: Return expense
  return_expense: 6.32, // ((1 - 0.95) / 0.95) * 120

  // Шаг 9: МП → Клиент
  mp_to_client: 64.00, // acceptance(0) + storage(0) + logistics(64)

  // Шаг 10: Удержания МП Итого
  mp_total: 283.32, // mp_to_client(64) + commission(195) + marketing(6) + return_expense(6.32) + acquiring(12)

  // Шаг 11: Приход на счет
  income: 316.68, // 600 - 283.32

  // Шаг 12: Налог
  tax: 24.00, // 600 * 4%

  // Шаг 13: Реально тратим
  real_costs: 170.29, // purchase(146) + tax(24) + defect(0.29)

  // Шаг 14: Косты без закупки
  costs_no_purchase: 307.61, // defect(0.29) + shipping(0) + extra(0) + mp_total(283.32) + tax(24)

  // Шаг 15: Прибыль
  profit: 146.39, // income(316.68) - real_costs(170.29)

  // Шаг 16: Показатели эффективности
  roi: 0.8597, // 85.97%
  margin_sales: 0.2440, // 24.40%
  margin_income: 0.4623, // 46.23%

  // Шаг 17: Партия
  profit_total: 527012, // 146.39 * 3600 (с округлением)
  revenue_total: 2160000, // 600 * 3600
};
