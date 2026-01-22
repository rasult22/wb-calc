import { useState, useEffect } from 'react';
import type { IPSettings } from '../types';
import { tariffOptions } from '../data/tariffOptions';
import { IPSettingsModal } from './IPSettingsModal';

interface Props {
  ipSettings: IPSettings[];
  currentIP: IPSettings | undefined;
  selectedIPId: string;
  onSelectIP: (id: string) => void;
  onCreateIP: (data: Omit<IPSettings, 'id'>) => void;
  onUpdateIP: (id: string, data: Partial<Omit<IPSettings, 'id'>>) => void;
  onDeleteIP: (id: string) => void;
  onToggleTariffOption: (optionName: string) => void;
}

// Локальное состояние для полей быстрых настроек
interface QuickFieldsState {
  min_margin: string;
  tax_usn: string;
  tax_nds: string;
  acquiring: string;
}

export function IPSettingsPanel({
  ipSettings,
  currentIP,
  selectedIPId,
  onSelectIP,
  onCreateIP,
  onUpdateIP,
  onDeleteIP,
  onToggleTariffOption,
}: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
  }>({ isOpen: false, mode: 'create' });

  // Локальные значения для input полей (строки для свободного редактирования)
  const [quickFields, setQuickFields] = useState<QuickFieldsState>({
    min_margin: '',
    tax_usn: '',
    tax_nds: '',
    acquiring: '',
  });

  // Синхронизация локальных полей при смене IP или изменении данных извне
  useEffect(() => {
    if (currentIP) {
      setQuickFields({
        min_margin: (currentIP.min_margin * 100).toFixed(1),
        tax_usn: (currentIP.tax_usn * 100).toFixed(1),
        tax_nds: (currentIP.tax_nds * 100).toFixed(1),
        acquiring: (currentIP.acquiring * 100).toFixed(2),
      });
    }
  }, [currentIP?.id, currentIP?.min_margin, currentIP?.tax_usn, currentIP?.tax_nds, currentIP?.acquiring]);

  const totalOptionsRate = (currentIP?.selected_options || []).reduce((sum, optName) => {
    const opt = tariffOptions.find(o => o.name === optName);
    return sum + (opt?.rate || 0);
  }, 0);

  const handleOpenCreate = () => {
    setModalState({ isOpen: true, mode: 'create' });
  };

  const handleOpenEdit = () => {
    setModalState({ isOpen: true, mode: 'edit' });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'create' });
  };

  const handleSaveModal = (data: Omit<IPSettings, 'id'>) => {
    if (modalState.mode === 'create') {
      onCreateIP(data);
    } else if (currentIP) {
      onUpdateIP(currentIP.id, data);
    }
  };

  const handleDelete = () => {
    if (!currentIP || ipSettings.length <= 1) return;
    if (confirm(`Удалить "${currentIP.name}"?`)) {
      onDeleteIP(currentIP.id);
    }
  };

  const handleQuickChange = (field: keyof IPSettings, value: string | number) => {
    if (!currentIP) return;
    onUpdateIP(currentIP.id, { [field]: value });
  };

  // Обработка изменения локального значения поля (при вводе)
  const handleQuickFieldChange = (field: keyof QuickFieldsState, value: string) => {
    setQuickFields(prev => ({ ...prev, [field]: value }));
  };

  // Применение значения при потере фокуса
  const handleQuickFieldBlur = (field: keyof QuickFieldsState) => {
    if (!currentIP) return;
    const value = quickFields[field];
    const numValue = parseFloat(value.replace(',', '.')) / 100;

    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      onUpdateIP(currentIP.id, { [field]: numValue });
    } else {
      // Если значение невалидное, восстанавливаем из currentIP
      const currentValue = currentIP[field] as number;
      const decimals = field === 'acquiring' ? 2 : 1;
      setQuickFields(prev => ({
        ...prev,
        [field]: (currentValue * 100).toFixed(decimals)
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Настройки ИП</h2>
        <div className="flex gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* Выбор ИП */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Выберите ИП
          </label>
          <div className="flex gap-2">
            <select
              value={selectedIPId}
              onChange={(e) => onSelectIP(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ipSettings.map(ip => (
                <option key={ip.id} value={ip.id}>{ip.name}</option>
              ))}
            </select>
            <button
              onClick={handleOpenEdit}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              title="Редактировать"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              disabled={ipSettings.length <= 1}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Краткая информация */}
        {currentIP && (
          <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
            <div className="flex justify-between">
              <span className="text-gray-600">Тип маржи:</span>
              <span className="font-medium text-xs">
                {currentIP.margin_type === 'Маржинальность прихода' ? 'От прихода' : 'От продаж'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">УСН:</span>
              <span className="font-medium">{(currentIP.tax_usn * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Эквайринг:</span>
              <span className="font-medium">{(currentIP.acquiring * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Мин. маржа:</span>
              <span className="font-medium">{(currentIP.min_margin * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Быстрые настройки */}
      <div className="mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center text-sm text-purple-600 hover:text-purple-800 mb-2"
        >
          <span>{showSettings ? '▼' : '▶'}</span>
          <span className="ml-1">Быстрые настройки</span>
        </button>

        {showSettings && currentIP && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Тип маржи</label>
              <select
                value={currentIP.margin_type}
                onChange={(e) => handleQuickChange('margin_type', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Маржинальность прихода">От прихода</option>
                <option value="Маржинальность продаж">От продаж</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Мин. маржа (%)</label>
              <input
                type="text"
                inputMode="decimal"
                value={quickFields.min_margin}
                onChange={(e) => handleQuickFieldChange('min_margin', e.target.value)}
                onBlur={() => handleQuickFieldBlur('min_margin')}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">УСН (%)</label>
              <input
                type="text"
                inputMode="decimal"
                value={quickFields.tax_usn}
                onChange={(e) => handleQuickFieldChange('tax_usn', e.target.value)}
                onBlur={() => handleQuickFieldBlur('tax_usn')}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">НДС (%)</label>
              <input
                type="text"
                inputMode="decimal"
                value={quickFields.tax_nds}
                onChange={(e) => handleQuickFieldChange('tax_nds', e.target.value)}
                onBlur={() => handleQuickFieldBlur('tax_nds')}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Эквайринг (%)</label>
              <input
                type="text"
                inputMode="decimal"
                value={quickFields.acquiring}
                onChange={(e) => handleQuickFieldChange('acquiring', e.target.value)}
                onBlur={() => handleQuickFieldBlur('acquiring')}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">База налога</label>
              <select
                value={currentIP.tax_type}
                onChange={(e) => handleQuickChange('tax_type', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Налог с продаж">С продаж</option>
                <option value="Налог с прихода">С прихода</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Опции тарифов */}
      <div>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center text-sm text-purple-600 hover:text-purple-800"
        >
          <span>{showOptions ? '▼' : '▶'}</span>
          <span className="ml-1">
            Опции тарифов ({(currentIP?.selected_options || []).length})
            {totalOptionsRate > 0 && (
              <span className="ml-2 text-gray-500">
                +{(totalOptionsRate * 100).toFixed(2)}%
              </span>
            )}
          </span>
        </button>

        {showOptions && (
          <div className="mt-3 max-h-64 overflow-y-auto border rounded-md p-2">
            {tariffOptions.map(option => (
              <label
                key={option.name}
                className="flex items-start gap-2 p-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(currentIP?.selected_options || []).includes(option.name)}
                  onChange={() => onToggleTariffOption(option.name)}
                  className="mt-1 rounded text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="text-sm">{option.name}</div>
                  <div className="text-xs text-gray-500">
                    {option.type} • +{(option.rate * 100).toFixed(2)}%
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно */}
      <IPSettingsModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        initialData={currentIP}
        mode={modalState.mode}
      />
    </div>
  );
}
