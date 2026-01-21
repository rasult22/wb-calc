import { useState, useMemo } from 'react';
import type { ProductInput } from '../types';
import { useCategories } from '../hooks/useCategories';
import { getWarehousesByType } from '../data/warehouses';

interface Props {
  product: ProductInput;
  onChange: (product: ProductInput) => void;
}

export function ProductForm({ product, onChange }: Props) {
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  const { categories, isLoading: categoriesLoading, searchCategories } = useCategories();

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories.slice(0, 20);
    return searchCategories(categorySearch, 20);
  }, [categorySearch, categories, searchCategories]);

  const availableWarehouses = useMemo(() => {
    return getWarehousesByType(product.delivery_type);
  }, [product.delivery_type]);

  const filteredWarehouses = useMemo(() => {
    if (!warehouseSearch) return availableWarehouses.slice(0, 20);
    const search = warehouseSearch.toLowerCase();
    return availableWarehouses
      .filter(wh => wh.name.toLowerCase().includes(search))
      .slice(0, 20);
  }, [warehouseSearch, availableWarehouses]);

  const handleChange = (field: keyof ProductInput, value: string | number | boolean) => {
    onChange({ ...product, [field]: value });
  };

  const handleCategorySelect = (subject: string) => {
    handleChange('category_wb', subject);
    setCategorySearch(subject);
    setShowCategoryDropdown(false);
  };

  const handleWarehouseSelect = (name: string) => {
    handleChange('warehouse', name);
    setWarehouseSearch(name);
    setShowWarehouseDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4">Данные товара</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Название товара */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название товара (SKU)
          </label>
          <input
            type="text"
            value={product.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="Например: Чехол для iPhone 15"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Категория */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категория WB
          </label>
          <input
            type="text"
            value={categorySearch || product.category_wb}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              setShowCategoryDropdown(true);
            }}
            onFocus={() => setShowCategoryDropdown(true)}
            placeholder="Начните вводить..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {categoriesLoading ? (
                <div className="px-3 py-4 text-center text-gray-500">
                  Загрузка категорий...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-500">
                  Ничего не найдено
                </div>
              ) : (
                filteredCategories.map(cat => (
                  <div
                    key={cat.subject}
                    onClick={() => handleCategorySelect(cat.subject)}
                    className="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                  >
                    <div className="text-sm font-medium">{cat.subject}</div>
                    <div className="text-xs text-gray-500">
                      {cat.category} • FBO: {cat.commission_fbo}%
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Цены */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Закупочная цена, ₽
          </label>
          <input
            type="number"
            value={product.purchase_price || ''}
            onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value) || 0)}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Цена продажи, ₽
          </label>
          <input
            type="number"
            value={product.sale_price || ''}
            onChange={(e) => handleChange('sale_price', parseFloat(e.target.value) || 0)}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Количество, шт
          </label>
          <input
            type="number"
            value={product.quantity || ''}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
            min="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Размеры */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Высота, см
          </label>
          <input
            type="number"
            value={product.height || ''}
            onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
            min="0.1"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ширина, см
          </label>
          <input
            type="number"
            value={product.width || ''}
            onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
            min="0.1"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Длина, см
          </label>
          <input
            type="number"
            value={product.length || ''}
            onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
            min="0.1"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Логистика */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Направление
          </label>
          <select
            value={product.direction}
            onChange={(e) => handleChange('direction', e.target.value as 'FBO' | 'FBS')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="FBO">FBO (Склад WB)</option>
            <option value="FBS">FBS (Свой склад)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип доставки
          </label>
          <select
            value={product.delivery_type}
            onChange={(e) => {
              const type = e.target.value as 'Короб' | 'Моно';
              handleChange('delivery_type', type);
              // Сбросить склад при смене типа
              const warehouses = getWarehousesByType(type);
              if (warehouses.length > 0) {
                handleChange('warehouse', warehouses[0].name);
                setWarehouseSearch('');
              }
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Короб">Короб</option>
            <option value="Моно">Монопалета</option>
          </select>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Склад WB
          </label>
          <input
            type="text"
            value={showWarehouseDropdown ? warehouseSearch : (product.warehouse || '')}
            onChange={(e) => {
              setWarehouseSearch(e.target.value);
              setShowWarehouseDropdown(true);
            }}
            onFocus={() => {
              setWarehouseSearch(product.warehouse || '');
              setShowWarehouseDropdown(true);
            }}
            placeholder="Начните вводить..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {showWarehouseDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredWarehouses.length === 0 ? (
                <div className="px-3 py-4 text-center text-gray-500">
                  Ничего не найдено
                </div>
              ) : (
                filteredWarehouses.map(wh => (
                  <div
                    key={`${wh.name}-${wh.delivery_type}`}
                    onClick={() => handleWarehouseSelect(wh.name)}
                    className="px-3 py-2 hover:bg-purple-50 cursor-pointer"
                  >
                    <div className="text-sm font-medium">{wh.name}</div>
                    <div className="text-xs text-gray-500">
                      Доставка: {wh.delivery_1l}₽/л • Хранение: {wh.storage_1l}₽/л
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Доп. параметры */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            СПП + Кошелек WB, %
          </label>
          <input
            type="number"
            value={(product.spp_percent * 100) || ''}
            onChange={(e) => handleChange('spp_percent', (parseFloat(e.target.value) || 0) / 100)}
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Процент выкупа, %
          </label>
          <input
            type="number"
            value={(product.buyout_rate * 100) || ''}
            onChange={(e) => handleChange('buyout_rate', (parseFloat(e.target.value) || 0) / 100)}
            min="1"
            max="100"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Маркетинг, %
          </label>
          <input
            type="number"
            value={(product.marketing_rate * 100) || ''}
            onChange={(e) => handleChange('marketing_rate', (parseFloat(e.target.value) || 0) / 100)}
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Процент брака, %
          </label>
          <input
            type="number"
            value={(product.defect_rate * 100) || ''}
            onChange={(e) => handleChange('defect_rate', (parseFloat(e.target.value) || 0) / 100)}
            min="0"
            max="100"
            step="0.1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Доп. затраты на ед., ₽
          </label>
          <input
            type="number"
            value={product.extra_costs || ''}
            onChange={(e) => handleChange('extra_costs', parseFloat(e.target.value) || 0)}
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {product.direction === 'FBO' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Коэф. распределения (ИЛ)
            </label>
            <input
              type="number"
              value={product.location_index || ''}
              onChange={(e) => handleChange('location_index', parseFloat(e.target.value) || 1)}
              min="0.1"
              step="0.1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
