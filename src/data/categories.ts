import type { CategoryCommission } from '../types';

// Популярные категории для демо (полный список можно загружать из CSV)
export const categories: CategoryCommission[] = [
  // Одежда
  { category: 'Одежда', subject: 'Футболки', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Джинсы', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Платья', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Куртки', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Свитеры', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Брюки', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Рубашки', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Одежда', subject: 'Костюмы', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },

  // Обувь
  { category: 'Обувь', subject: 'Кроссовки', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Обувь', subject: 'Ботинки', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Обувь', subject: 'Туфли', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Обувь', subject: 'Сапоги', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Обувь', subject: 'Сандалии', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },

  // Электроника
  { category: 'Электроника', subject: 'Наушники', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Электроника', subject: 'Зарядные устройства', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Электроника', subject: 'Чехлы для телефонов', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Электроника', subject: 'Кабели', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Электроника', subject: 'Powerbank', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },

  // Красота и здоровье
  { category: 'Красота и здоровье', subject: 'Крем для лица', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },
  { category: 'Красота и здоровье', subject: 'Шампуни', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },
  { category: 'Красота и здоровье', subject: 'Косметика декоративная', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },
  { category: 'Красота и здоровье', subject: 'Мыло косметическое', commission_fbo: 22.5, commission_fbs_to_wb: 22.5, commission_fbs_direct: 3.0 },
  { category: 'Красота и здоровье', subject: 'Парфюмерия', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },
  { category: 'Красота и здоровье', subject: 'Маски для лица', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },

  // Товары для дома
  { category: 'Товары для дома', subject: 'Посуда', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Товары для дома', subject: 'Текстиль для дома', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Товары для дома', subject: 'Декор', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Товары для дома', subject: 'Хранение', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Товары для дома', subject: 'Освещение', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },

  // Детские товары
  { category: 'Детские товары', subject: 'Игрушки', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Детские товары', subject: 'Детская одежда', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Детские товары', subject: 'Подгузники', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Детские товары', subject: 'Детское питание', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },

  // Спорт
  { category: 'Спорт', subject: 'Спортивная одежда', commission_fbo: 14.5, commission_fbs_to_wb: 14.5, commission_fbs_direct: 3.0 },
  { category: 'Спорт', subject: 'Тренажёры', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Спорт', subject: 'Спортивное питание', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Спорт', subject: 'Коврики для йоги', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },

  // Автотовары
  { category: 'Автоаксессуары и дополнительное оборудование', subject: 'Коврики автомобильные', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },
  { category: 'Автоаксессуары и дополнительное оборудование', subject: 'Держатели в авто', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },
  { category: 'Автоаксессуары и дополнительное оборудование', subject: 'Эмблемы для авто', commission_fbo: 16.5, commission_fbs_to_wb: 20.0, commission_fbs_direct: 3.0 },

  // Продукты
  { category: 'Продукты', subject: 'Чай', commission_fbo: 14.0, commission_fbs_to_wb: 17.0, commission_fbs_direct: 3.0 },
  { category: 'Продукты', subject: 'Кофе', commission_fbo: 14.0, commission_fbs_to_wb: 17.0, commission_fbs_direct: 3.0 },
  { category: 'Продукты', subject: 'Снеки', commission_fbo: 14.0, commission_fbs_to_wb: 17.0, commission_fbs_direct: 3.0 },
  { category: 'Продукты', subject: 'Шоколад', commission_fbo: 14.0, commission_fbs_to_wb: 17.0, commission_fbs_direct: 3.0 },

  // Канцелярия
  { category: 'Канцелярские товары', subject: 'Ручки', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Канцелярские товары', subject: 'Блокноты', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Канцелярские товары', subject: 'Органайзеры', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },

  // Аксессуары
  { category: 'Аксессуары', subject: 'Сумки', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Аксессуары', subject: 'Рюкзаки', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Аксессуары', subject: 'Кошельки', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Аксессуары', subject: 'Часы', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
  { category: 'Аксессуары', subject: 'Ремни', commission_fbo: 15.0, commission_fbs_to_wb: 18.0, commission_fbs_direct: 3.0 },
];

export function searchCategories(query: string, limit: number = 20): CategoryCommission[] {
  const lowerQuery = query.toLowerCase();
  return categories
    .filter(c =>
      c.subject.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

export function getCategoryBySubject(subject: string): CategoryCommission | undefined {
  return categories.find(c => c.subject === subject);
}

export function getAllSubjects(): string[] {
  return categories.map(c => c.subject);
}
