import { useState, useMemo } from 'react';
import type { ProductInput, CalculationResult } from './types';
import { DEFAULT_PRODUCT_INPUT } from './types';
import { useIPSettings } from './hooks/useIPSettings';
import { useCategories } from './hooks/useCategories';
import { tariffOptions } from './data/tariffOptions';
import { getWarehouse, getWarehousesByType } from './data/warehouses';
import { calculateUnitEconomics } from './utils/calculator';
import { IPSettingsPanel } from './components/IPSettingsPanel';
import { ProductForm } from './components/ProductForm';
import { ResultCard } from './components/ResultCard';

function App() {
  // Хук для управления ИП
  const {
    ipSettings,
    currentIP,
    selectedIPId,
    selectIP,
    createIP,
    updateIP,
    deleteIP,
    toggleTariffOption,
  } = useIPSettings();

  // Хук для категорий
  const { getCategoryBySubject } = useCategories();

  // Состояние товара
  const [product, setProduct] = useState<ProductInput>(() => {
    const warehouses = getWarehousesByType('Короб');
    return {
      ...DEFAULT_PRODUCT_INPUT,
      ip_name: currentIP?.name || '',
      warehouse: warehouses[0]?.name || '',
    };
  });

  // Проверка валидности данных для расчёта
  const isValidForCalculation = useMemo(() => {
    return (
      product.purchase_price > 0 &&
      product.sale_price > 0 &&
      product.quantity > 0 &&
      product.height > 0 &&
      product.width > 0 &&
      product.length > 0 &&
      product.category_wb !== '' &&
      product.warehouse !== '' &&
      currentIP !== undefined
    );
  }, [product, currentIP]);

  // Расчёт Unit-экономики
  const calculationResult = useMemo<CalculationResult | null>(() => {
    if (!isValidForCalculation || !currentIP) return null;

    const warehouse = getWarehouse(product.warehouse, product.delivery_type);
    const category = getCategoryBySubject(product.category_wb);

    if (!warehouse || !category) return null;

    return calculateUnitEconomics(
      { ...product, ip_name: currentIP.name },
      currentIP,
      warehouse,
      category,
      tariffOptions
    );
  }, [product, currentIP, isValidForCalculation, getCategoryBySubject]);

  // Обработчики
  const handleSelectIP = (id: string) => {
    selectIP(id);
    const ip = ipSettings.find(i => i.id === id);
    if (ip) {
      setProduct(prev => ({ ...prev, ip_name: ip.name }));
    }
  };

  const handleProductChange = (updatedProduct: ProductInput) => {
    setProduct(updatedProduct);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Шапка */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Калькулятор Unit-экономики WB</h1>
          <p className="text-purple-200 text-sm mt-1">
            Рассчитайте прибыльность товара на Wildberries
          </p>
        </div>
      </header>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - ввод данных */}
          <div className="lg:col-span-2 space-y-4">
            <IPSettingsPanel
              ipSettings={ipSettings}
              currentIP={currentIP}
              selectedIPId={selectedIPId}
              onSelectIP={handleSelectIP}
              onCreateIP={createIP}
              onUpdateIP={updateIP}
              onDeleteIP={deleteIP}
              onToggleTariffOption={toggleTariffOption}
            />

            <ProductForm
              product={product}
              onChange={handleProductChange}
            />
          </div>

          {/* Правая колонка - результаты */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Результаты расчёта</h2>
              <ResultCard
                result={calculationResult}
                isValid={isValidForCalculation}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-gray-800 text-gray-400 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Калькулятор Unit-экономики WB v1.0</p>
          <p className="mt-1">Данные о комиссиях и тарифах актуальны на 2025 год</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
