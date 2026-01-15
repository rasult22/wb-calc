import type { Warehouse } from '../types';

export const warehouses: Warehouse[] = [
  // Короб
  { name: 'Коледино', delivery_type: 'Короб', delivery_1l: 92.0, delivery_extra_l: 28.0, storage_1l: 0.16, storage_extra_l: 0.16 },
  { name: 'Подольск', delivery_type: 'Короб', delivery_1l: 92.0, delivery_extra_l: 28.0, storage_1l: 0.16, storage_extra_l: 0.16 },
  { name: 'Казань', delivery_type: 'Короб', delivery_1l: 101.2, delivery_extra_l: 30.8, storage_1l: 0.18, storage_extra_l: 0.18 },
  { name: 'Электросталь', delivery_type: 'Короб', delivery_1l: 78.2, delivery_extra_l: 23.8, storage_1l: 0.14, storage_extra_l: 0.14 },
  { name: 'СЦ Белая Дача', delivery_type: 'Короб', delivery_1l: 94.3, delivery_extra_l: 28.7, storage_1l: 0.16, storage_extra_l: 0.16 },
  { name: 'СЦ Ростов-на-Дону', delivery_type: 'Короб', delivery_1l: 80.5, delivery_extra_l: 24.5, storage_1l: 0.14, storage_extra_l: 0.14 },
  { name: 'СЦ Владикавказ', delivery_type: 'Короб', delivery_1l: 59.8, delivery_extra_l: 18.2, storage_1l: 0.1, storage_extra_l: 0.1 },
  { name: 'СЦ Липецк', delivery_type: 'Короб', delivery_1l: 73.6, delivery_extra_l: 22.4, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'СЦ Новосибирск Пасечная', delivery_type: 'Короб', delivery_1l: 161.0, delivery_extra_l: 49.0, storage_1l: 0.28, storage_extra_l: 0.28 },
  { name: 'СЦ Ижевск', delivery_type: 'Короб', delivery_1l: 73.6, delivery_extra_l: 22.4, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'СЦ Омск', delivery_type: 'Короб', delivery_1l: 73.6, delivery_extra_l: 22.4, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'СЦ Хабаровск', delivery_type: 'Короб', delivery_1l: 87.4, delivery_extra_l: 26.6, storage_1l: 0.15, storage_extra_l: 0.15 },
  { name: 'СЦ Астрахань', delivery_type: 'Короб', delivery_1l: 73.6, delivery_extra_l: 22.4, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'СЦ Уфа', delivery_type: 'Короб', delivery_1l: 96.6, delivery_extra_l: 29.4, storage_1l: 0.17, storage_extra_l: 0.17 },
  { name: 'СЦ Шымкент', delivery_type: 'Короб', delivery_1l: 52.9, delivery_extra_l: 16.1, storage_1l: 0.09, storage_extra_l: 0.09 },
  { name: 'СЦ Томск', delivery_type: 'Короб', delivery_1l: 92.0, delivery_extra_l: 28.0, storage_1l: 0.16, storage_extra_l: 0.16 },
  { name: 'СЦ Челябинск 2', delivery_type: 'Короб', delivery_1l: 82.8, delivery_extra_l: 25.2, storage_1l: 0.14, storage_extra_l: 0.14 },
  { name: 'Санкт-Петербург СГТ', delivery_type: 'Короб', delivery_1l: 48.3, delivery_extra_l: 14.7, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'Ярославль СГТ', delivery_type: 'Короб', delivery_1l: 46.0, delivery_extra_l: 14.0, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'Ташкент 1', delivery_type: 'Короб', delivery_1l: 46.0, delivery_extra_l: 14.0, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'Обухово', delivery_type: 'Короб', delivery_1l: 78.2, delivery_extra_l: 23.8, storage_1l: 0.14, storage_extra_l: 0.14 },
  { name: 'СЦ Курск', delivery_type: 'Короб', delivery_1l: 73.6, delivery_extra_l: 22.4, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'Алматы Атакент', delivery_type: 'Короб', delivery_1l: 66.7, delivery_extra_l: 20.3, storage_1l: 0.12, storage_extra_l: 0.12 },
  { name: 'СЦ Иркутск', delivery_type: 'Короб', delivery_1l: 78.2, delivery_extra_l: 23.8, storage_1l: 0.14, storage_extra_l: 0.14 },
  { name: 'Софрино СГТ', delivery_type: 'Короб', delivery_1l: 43.7, delivery_extra_l: 13.3, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'Радумля СГТ', delivery_type: 'Короб', delivery_1l: 43.7, delivery_extra_l: 13.3, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'Краснодар (Тихорецкая)', delivery_type: 'Короб', delivery_1l: 75.9, delivery_extra_l: 23.1, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'Белые Столбы', delivery_type: 'Короб', delivery_1l: 128.8, delivery_extra_l: 39.2, storage_1l: 0.22, storage_extra_l: 0.22 },
  { name: 'Екатеринбург - Перспективный 12/2', delivery_type: 'Короб', delivery_1l: 55.2, delivery_extra_l: 16.8, storage_1l: 0.15, storage_extra_l: 0.15 },
  { name: 'Новосибирск', delivery_type: 'Короб', delivery_1l: 204.7, delivery_extra_l: 62.3, storage_1l: 0.36, storage_extra_l: 0.36 },
  { name: 'Владимир Воршинское', delivery_type: 'Короб', delivery_1l: 59.8, delivery_extra_l: 18.2, storage_1l: 0.1, storage_extra_l: 0.1 },
  { name: 'Волгоград', delivery_type: 'Короб', delivery_1l: 50.6, delivery_extra_l: 15.4, storage_1l: 0.09, storage_extra_l: 0.09 },
  { name: 'Воронеж', delivery_type: 'Короб', delivery_1l: 34.5, delivery_extra_l: 10.5, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'СЦ Барнаул', delivery_type: 'Короб', delivery_1l: 101.2, delivery_extra_l: 30.8, storage_1l: 0.18, storage_extra_l: 0.18 },
  { name: 'Тула', delivery_type: 'Короб', delivery_1l: 73.6, delivery_extra_l: 22.4, storage_1l: 0.13, storage_extra_l: 0.13 },
  { name: 'СЦ Минск', delivery_type: 'Короб', delivery_1l: 89.7, delivery_extra_l: 27.3, storage_1l: 0.16, storage_extra_l: 0.16 },
  { name: 'Обухово СГТ', delivery_type: 'Короб', delivery_1l: 34.5, delivery_extra_l: 10.5, storage_1l: 0.06, storage_extra_l: 0.06 },
  { name: 'Голицыно СГТ', delivery_type: 'Короб', delivery_1l: 34.5, delivery_extra_l: 10.5, storage_1l: 0.06, storage_extra_l: 0.06 },
  { name: 'Санкт-Петербург (Уткина Заводь)', delivery_type: 'Короб', delivery_1l: 138.0, delivery_extra_l: 42.0, storage_1l: 0.24, storage_extra_l: 0.24 },
  { name: 'Астана 2', delivery_type: 'Короб', delivery_1l: 66.7, delivery_extra_l: 20.3, storage_1l: 0.12, storage_extra_l: 0.12 },
  { name: 'Щербинка', delivery_type: 'Короб', delivery_1l: 92.0, delivery_extra_l: 28.0, storage_1l: 0.16, storage_extra_l: 0.16 },
  { name: 'Склад Шушары', delivery_type: 'Короб', delivery_1l: 101.2, delivery_extra_l: 30.8, storage_1l: 0.18, storage_extra_l: 0.18 },
  { name: 'Пенза', delivery_type: 'Короб', delivery_1l: 46.0, delivery_extra_l: 14.0, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'Невинномысск', delivery_type: 'Короб', delivery_1l: 48.3, delivery_extra_l: 14.7, storage_1l: 0.08, storage_extra_l: 0.08 },
  { name: 'СЦ Пушкино', delivery_type: 'Короб', delivery_1l: 69.0, delivery_extra_l: 21.0, storage_1l: 0.12, storage_extra_l: 0.12 },
  { name: 'СЦ Тюмень', delivery_type: 'Короб', delivery_1l: 87.4, delivery_extra_l: 26.6, storage_1l: 0.15, storage_extra_l: 0.15 },
  // Моно
  { name: 'Коледино', delivery_type: 'Моно', delivery_1l: 92.0, delivery_extra_l: 28.0, storage_1l: 53.75, storage_extra_l: 0 },
  { name: 'Подольск 3', delivery_type: 'Моно', delivery_1l: 78.2, delivery_extra_l: 23.8, storage_1l: 42.5, storage_extra_l: 0 },
  { name: 'СЦ Ижевск', delivery_type: 'Моно', delivery_1l: 87.4, delivery_extra_l: 26.6, storage_1l: 47.5, storage_extra_l: 0 },
  { name: 'СЦ Иваново', delivery_type: 'Моно', delivery_1l: 62.1, delivery_extra_l: 18.9, storage_1l: 33.75, storage_extra_l: 0 },
  { name: 'СЦ Хабаровск', delivery_type: 'Моно', delivery_1l: 39.1, delivery_extra_l: 11.9, storage_1l: 21.25, storage_extra_l: 0 },
  { name: 'СЦ Ярославль Громова', delivery_type: 'Моно', delivery_1l: 78.2, delivery_extra_l: 23.8, storage_1l: 41.25, storage_extra_l: 0 },
  { name: 'Белые Столбы', delivery_type: 'Моно', delivery_1l: 96.6, delivery_extra_l: 29.4, storage_1l: 52.5, storage_extra_l: 0 },
  { name: 'Алматы Атакент', delivery_type: 'Моно', delivery_1l: 32.2, delivery_extra_l: 9.8, storage_1l: 17.5, storage_extra_l: 0 },
  { name: 'Радумля СГТ', delivery_type: 'Моно', delivery_1l: 46.0, delivery_extra_l: 14.0, storage_1l: 25.0, storage_extra_l: 0 },
  { name: 'СЦ Пушкино', delivery_type: 'Моно', delivery_1l: 94.3, delivery_extra_l: 28.7, storage_1l: 51.25, storage_extra_l: 0 },
  { name: 'Казань', delivery_type: 'Моно', delivery_1l: 110.4, delivery_extra_l: 33.6, storage_1l: 65.0, storage_extra_l: 0 },
  { name: 'Склад Шушары', delivery_type: 'Моно', delivery_1l: 138.0, delivery_extra_l: 42.0, storage_1l: 75.0, storage_extra_l: 0 },
];

export function getWarehousesByType(deliveryType: 'Короб' | 'Моно'): Warehouse[] {
  return warehouses.filter(w => w.delivery_type === deliveryType);
}

export function getWarehouse(name: string, deliveryType: 'Короб' | 'Моно'): Warehouse | undefined {
  return warehouses.find(w => w.name === name && w.delivery_type === deliveryType);
}
