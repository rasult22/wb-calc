import { useState } from 'react';
import type { IPSettings } from '../types';
import { tariffOptions } from '../data/tariffOptions';

interface Props {
  ipSettings: IPSettings[];
  selectedIP: string;
  onSelectIP: (name: string) => void;
  onUpdateIP: (ip: IPSettings) => void;
}

export function IPSettingsPanel({ ipSettings, selectedIP, onSelectIP, onUpdateIP }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const currentIP = ipSettings.find(ip => ip.name === selectedIP);

  const handleOptionToggle = (optionName: string) => {
    if (!currentIP) return;

    const selectedOptions = currentIP.selected_options || [];
    const newOptions = selectedOptions.includes(optionName)
      ? selectedOptions.filter(o => o !== optionName)
      : [...selectedOptions, optionName];

    onUpdateIP({ ...currentIP, selected_options: newOptions });
  };

  const totalOptionsRate = (currentIP?.selected_options || []).reduce((sum, optName) => {
    const opt = tariffOptions.find(o => o.name === optName);
    return sum + (opt?.rate || 0);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Настройки ИП</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Выберите ИП
          </label>
          <select
            value={selectedIP}
            onChange={(e) => onSelectIP(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {ipSettings.map(ip => (
              <option key={ip.name} value={ip.name}>{ip.name}</option>
            ))}
          </select>
        </div>

        {currentIP && (
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">УСН:</span>
              <span className="font-medium">{(currentIP.tax_usn * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Эквайринг:</span>
              <span className="font-medium">{(currentIP.acquiring * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Мин. маржа:</span>
              <span className="font-medium">{(currentIP.min_margin * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

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
                  onChange={() => handleOptionToggle(option.name)}
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
    </div>
  );
}
