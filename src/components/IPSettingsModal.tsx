import { useState, useEffect } from 'react';
import type { IPSettings } from '../types';
import { DEFAULT_IP_SETTINGS } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<IPSettings, 'id'>) => void;
  initialData?: IPSettings;
  mode: 'create' | 'edit';
}

// Локальное состояние для процентных полей
interface PercentFieldsState {
  min_margin: string;
  tax_usn: string;
  tax_nds: string;
  acquiring: string;
}

type PercentField = keyof PercentFieldsState;

export function IPSettingsModal({ isOpen, onClose, onSave, initialData, mode }: Props) {
  const [formData, setFormData] = useState<Omit<IPSettings, 'id'>>(DEFAULT_IP_SETTINGS);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Локальные значения для процентных полей
  const [percentFields, setPercentFields] = useState<PercentFieldsState>({
    min_margin: '',
    tax_usn: '',
    tax_nds: '',
    acquiring: '',
  });

  // Синхронизация при открытии модалки
  useEffect(() => {
    if (isOpen) {
      let data: Omit<IPSettings, 'id'>;
      if (mode === 'edit' && initialData) {
        const { id, ...rest } = initialData;
        data = rest;
      } else {
        data = { ...DEFAULT_IP_SETTINGS };
      }
      setFormData(data);
      setPercentFields({
        min_margin: (data.min_margin * 100).toFixed(1),
        tax_usn: (data.tax_usn * 100).toFixed(1),
        tax_nds: (data.tax_nds * 100).toFixed(1),
        acquiring: (data.acquiring * 100).toFixed(2),
      });
      setErrors({});
    }
  }, [isOpen, initialData, mode]);

  const handleChange = (field: keyof Omit<IPSettings, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Обработка изменения локального значения процентного поля
  const handlePercentFieldChange = (field: PercentField, value: string) => {
    setPercentFields(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Применение значения при потере фокуса
  const handlePercentFieldBlur = (field: PercentField) => {
    const value = percentFields[field];
    const numValue = parseFloat(value.replace(',', '.')) / 100;
    const decimals = field === 'acquiring' ? 2 : 1;

    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setFormData(prev => ({ ...prev, [field]: numValue }));
      // Нормализуем отображаемое значение
      setPercentFields(prev => ({
        ...prev,
        [field]: (numValue * 100).toFixed(decimals)
      }));
    } else {
      // Восстанавливаем из formData
      setPercentFields(prev => ({
        ...prev,
        [field]: (formData[field] as number * 100).toFixed(decimals)
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите название ИП';
    }

    if (formData.min_margin < 0 || formData.min_margin > 1) {
      newErrors.min_margin = 'Значение должно быть от 0 до 100%';
    }

    if (formData.tax_usn < 0 || formData.tax_usn > 1) {
      newErrors.tax_usn = 'Значение должно быть от 0 до 100%';
    }

    if (formData.tax_nds < 0 || formData.tax_nds > 1) {
      newErrors.tax_nds = 'Значение должно быть от 0 до 100%';
    }

    if (formData.acquiring < 0 || formData.acquiring > 1) {
      newErrors.acquiring = 'Значение должно быть от 0 до 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === 'create' ? 'Создать ИП' : 'Редактировать ИП'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Название ИП */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название ИП *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Например: ИП Иванов"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Тип маржи */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип расчёта маржи
            </label>
            <select
              value={formData.margin_type}
              onChange={(e) => handleChange('margin_type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Маржинальность прихода">Маржинальность прихода</option>
              <option value="Маржинальность продаж">Маржинальность продаж</option>
            </select>
            <p className="text-gray-500 text-xs mt-1">
              {formData.margin_type === 'Маржинальность прихода'
                ? 'Прибыль / Себестоимость × 100%'
                : 'Прибыль / Выручка × 100%'}
            </p>
          </div>

          {/* Минимальная маржа */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Минимальная маржа (%)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={percentFields.min_margin}
              onChange={(e) => handlePercentFieldChange('min_margin', e.target.value)}
              onBlur={() => handlePercentFieldBlur('min_margin')}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.min_margin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.min_margin && <p className="text-red-500 text-xs mt-1">{errors.min_margin}</p>}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Налоги</h3>

            {/* УСН */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                УСН (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={percentFields.tax_usn}
                onChange={(e) => handlePercentFieldChange('tax_usn', e.target.value)}
                onBlur={() => handlePercentFieldBlur('tax_usn')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.tax_usn ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tax_usn && <p className="text-red-500 text-xs mt-1">{errors.tax_usn}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Стандартные ставки: 6% (доходы) или 15% (доходы минус расходы)
              </p>
            </div>

            {/* Тип налога */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                База для расчёта налога
              </label>
              <select
                value={formData.tax_type}
                onChange={(e) => handleChange('tax_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Налог с продаж">Налог с продаж (выручка)</option>
                <option value="Налог с прихода">Налог с прихода (прибыль)</option>
              </select>
            </div>

            {/* НДС */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                НДС (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={percentFields.tax_nds}
                onChange={(e) => handlePercentFieldChange('tax_nds', e.target.value)}
                onBlur={() => handlePercentFieldBlur('tax_nds')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.tax_nds ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tax_nds && <p className="text-red-500 text-xs mt-1">{errors.tax_nds}</p>}
              <p className="text-gray-500 text-xs mt-1">
                0% для ИП на УСН, 20% для ООО на ОСНО
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Прочие расходы</h3>

            {/* Эквайринг */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Эквайринг (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={percentFields.acquiring}
                onChange={(e) => handlePercentFieldChange('acquiring', e.target.value)}
                onBlur={() => handlePercentFieldBlur('acquiring')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.acquiring ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.acquiring && <p className="text-red-500 text-xs mt-1">{errors.acquiring}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Комиссия за приём платежей (обычно 1.5-2.5%)
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {mode === 'create' ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
