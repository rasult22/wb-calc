import { describe, it, expect } from 'vitest';
import {
  calculateVolume,
  calculateExtraVolume,
  calculateLogistics,
  calculateStorage,
  getReturnProcessing,
  calculateCommission,
  calculateReturnCost,
  calculateUnitEconomics,
} from '../calculator';
import {
  resnitsyInput,
  resnitsyIPSettings,
  koledinoWarehouse,
  resnitsyCategory,
  expectedResults,
} from './fixtures/resnitsy';

// =============================================================================
// Unit тесты для отдельных функций
// =============================================================================

describe('calculateVolume', () => {
  it('должен рассчитать объем для ресниц (3x16x18)', () => {
    const volume = calculateVolume(3, 16, 18);
    expect(volume).toBeCloseTo(0.864, 3);
  });

  it('должен рассчитать объем 1 литр (10x10x10)', () => {
    const volume = calculateVolume(10, 10, 10);
    expect(volume).toBe(1);
  });

  it('должен рассчитать объем 0 при нулевых размерах', () => {
    const volume = calculateVolume(0, 10, 10);
    expect(volume).toBe(0);
  });
});

describe('calculateExtraVolume', () => {
  it('должен вернуть 0 для объема меньше 1 литра', () => {
    expect(calculateExtraVolume(0.864)).toBe(0);
  });

  it('должен вернуть 0 для объема ровно 1 литр', () => {
    expect(calculateExtraVolume(1)).toBe(0);
  });

  it('должен вернуть 0.5 для объема 1.5 литра', () => {
    expect(calculateExtraVolume(1.5)).toBe(0.5);
  });
});

describe('calculateLogistics', () => {
  it('должен рассчитать логистику для ресниц (объем 0.864л, Коледино)', () => {
    const volume = 0.864;
    const extraVolume = 0;
    const logistics = calculateLogistics(
      volume,
      extraVolume,
      koledinoWarehouse,
      'FBO',
      1.0,
      'Короб'
    );
    expect(logistics).toBeCloseTo(expectedResults.logistics_cost, 0);
  });

  it('должен использовать коэффициент 32 для объема 0.8-1.0л', () => {
    // Для объема 0.864л коэффициент = 32
    // Формула: (32 * 92) / 46 = 64
    const logistics = calculateLogistics(0.864, 0, koledinoWarehouse, 'FBO', 1.0, 'Короб');
    expect(logistics).toBeCloseTo(64, 0);
  });

  it('должен использовать коэффициент 23 для объема до 0.2л', () => {
    // Формула: (23 * 92) / 46 = 46
    const logistics = calculateLogistics(0.15, 0, koledinoWarehouse, 'FBO', 1.0, 'Короб');
    expect(logistics).toBeCloseTo(46, 0);
  });

  it('должен рассчитать логистику для объема > 1л', () => {
    // Для объема 1.5л: il * delivery_1l + il * delivery_extra_l * extraVolume
    // 1.0 * 92 + 1.0 * 28 * 0.5 = 92 + 14 = 106
    const logistics = calculateLogistics(1.5, 0.5, koledinoWarehouse, 'FBO', 1.0, 'Короб');
    expect(logistics).toBeCloseTo(106, 0);
  });
});

describe('calculateStorage', () => {
  it('должен вернуть 0 (бесплатно до 60 дней на WB)', () => {
    expect(calculateStorage()).toBe(0);
  });
});

describe('getReturnProcessing', () => {
  it('должен вернуть 50 для Короб', () => {
    expect(getReturnProcessing('Короб')).toBe(50);
  });

  it('должен вернуть 50 для Моно', () => {
    expect(getReturnProcessing('Моно')).toBe(50);
  });
});

describe('calculateCommission', () => {
  it('должен рассчитать комиссию для ресниц (32.5%)', () => {
    const commission = calculateCommission(
      resnitsyCategory,
      'FBO',
      0, // без опций
      'Красота'
    );
    expect(commission).toBeCloseTo(0.325, 3);
  });

  it('должен добавить опции к комиссии (со скидкой -1%)', () => {
    // При опциях >= 1% и комиссии >= 14.5% дается скидка -1%
    const commission = calculateCommission(
      resnitsyCategory,
      'FBO',
      0.02, // +2% опций
      'Красота'
    );
    expect(commission).toBeCloseTo(0.335, 3); // 32.5% + 2% - 1% скидка
  });
});

describe('calculateReturnCost', () => {
  it('должен рассчитать цену возврата для FBO (ресницы)', () => {
    const returnCost = calculateReturnCost(
      'FBO',
      0, // acceptance_price
      0, // shipping_fbs
      0, // extra_costs
      0, // storage
      64, // logistics
      50, // return_processing
      600, // sale_price
      0.01 // marketing_rate
    );
    // storage(0) + logistics(64) + return_processing(50) + marketing(6) = 120
    expect(returnCost).toBeCloseTo(expectedResults.return_cost, 0);
  });

  it('должен рассчитать цену возврата для FBS', () => {
    const returnCost = calculateReturnCost(
      'FBS',
      10, // acceptance_price
      20, // shipping_fbs
      5, // extra_costs
      0, // storage
      64, // logistics
      50, // return_processing
      600, // sale_price
      0.01 // marketing_rate
    );
    // acceptance(10) + shipping_fbs(20) + extra(5) + storage(0) + logistics(64) + return_processing(50) + marketing(6) = 155
    expect(returnCost).toBeCloseTo(155, 0);
  });
});

// =============================================================================
// Интеграционный тест: полный расчет unit-экономики для ресниц
// =============================================================================

describe('calculateUnitEconomics - интеграционный тест (ресницы)', () => {
  const result = calculateUnitEconomics(
    resnitsyInput,
    resnitsyIPSettings,
    koledinoWarehouse,
    resnitsyCategory,
    [] // без тарифных опций
  );

  it('должен рассчитать правильный объем', () => {
    expect(result.volume).toBeCloseTo(expectedResults.volume, 3);
  });

  it('должен рассчитать правильную логистику', () => {
    expect(result.logistics_cost).toBeCloseTo(expectedResults.logistics_cost, 0);
  });

  it('должен рассчитать правильную комиссию МП', () => {
    expect(result.mp_commission).toBeCloseTo(expectedResults.mp_commission, 0);
  });

  it('должен рассчитать правильные удержания МП итого', () => {
    expect(result.mp_total).toBeCloseTo(expectedResults.mp_total, 0);
  });

  it('должен рассчитать правильный приход на счет', () => {
    expect(result.income).toBeCloseTo(expectedResults.income, 0);
  });

  it('должен рассчитать правильный налог', () => {
    expect(result.tax).toBeCloseTo(expectedResults.tax, 0);
  });

  it('должен рассчитать правильные реальные затраты', () => {
    expect(result.real_costs).toBeCloseTo(expectedResults.real_costs, 0);
  });

  it('должен рассчитать правильную прибыль', () => {
    expect(result.profit).toBeCloseTo(expectedResults.profit, 0);
  });

  it('должен рассчитать правильный ROI', () => {
    expect(result.roi).toBeCloseTo(expectedResults.roi, 2);
  });

  it('должен рассчитать правильную маржинальность продаж', () => {
    expect(result.margin_sales).toBeCloseTo(expectedResults.margin_sales, 2);
  });

  it('должен рассчитать правильную маржинальность прихода', () => {
    expect(result.margin_income).toBeCloseTo(expectedResults.margin_income, 2);
  });

  it('должен рассчитать правильную прибыль партии', () => {
    // Допускаем погрешность из-за округления
    expect(result.profit_total).toBeCloseTo(expectedResults.profit_total, -2);
  });

  it('должен вывести решение "Срочно закупаем"', () => {
    // Маржа прихода 46.23% > min_margin 10%
    expect(result.status).toBe('Срочно закупаем и продаем');
    expect(result.decision).toBe('✅');
  });
});
