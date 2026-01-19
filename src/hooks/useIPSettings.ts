import { useState, useEffect, useCallback } from 'react';
import type { IPSettings } from '../types';
import { DEFAULT_IP_SETTINGS } from '../types';
import { defaultIPSettings } from '../data/ipSettings';

const STORAGE_KEY = 'wb-calc-ip-settings';
const SELECTED_IP_KEY = 'wb-calc-selected-ip';

function generateId(): string {
  return `ip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadFromStorage(): IPSettings[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load IP settings from localStorage:', e);
  }
  return defaultIPSettings;
}

function loadSelectedIP(): string | null {
  try {
    return localStorage.getItem(SELECTED_IP_KEY);
  } catch {
    return null;
  }
}

export function useIPSettings() {
  const [ipSettings, setIPSettings] = useState<IPSettings[]>(() => loadFromStorage());
  const [selectedIPId, setSelectedIPId] = useState<string>(() => {
    const savedId = loadSelectedIP();
    const settings = loadFromStorage();
    if (savedId && settings.some(ip => ip.id === savedId)) {
      return savedId;
    }
    return settings[0]?.id || '';
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ipSettings));
    } catch (e) {
      console.error('Failed to save IP settings to localStorage:', e);
    }
  }, [ipSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_IP_KEY, selectedIPId);
    } catch (e) {
      console.error('Failed to save selected IP to localStorage:', e);
    }
  }, [selectedIPId]);

  // Текущий выбранный ИП
  const currentIP = ipSettings.find(ip => ip.id === selectedIPId) || ipSettings[0];

  // Выбор ИП
  const selectIP = useCallback((id: string) => {
    if (ipSettings.some(ip => ip.id === id)) {
      setSelectedIPId(id);
    }
  }, [ipSettings]);

  // Создание нового ИП
  const createIP = useCallback((data: Omit<IPSettings, 'id'>): IPSettings => {
    const newIP: IPSettings = {
      ...data,
      id: generateId(),
    };
    setIPSettings(prev => [...prev, newIP]);
    setSelectedIPId(newIP.id);
    return newIP;
  }, []);

  // Обновление ИП
  const updateIP = useCallback((id: string, data: Partial<Omit<IPSettings, 'id'>>) => {
    setIPSettings(prev => prev.map(ip =>
      ip.id === id ? { ...ip, ...data } : ip
    ));
  }, []);

  // Удаление ИП
  const deleteIP = useCallback((id: string) => {
    setIPSettings(prev => {
      const filtered = prev.filter(ip => ip.id !== id);
      if (filtered.length === 0) {
        return prev; // Не удаляем последний ИП
      }
      return filtered;
    });

    // Если удаляем текущий выбранный, переключаемся на первый
    if (selectedIPId === id) {
      setIPSettings(prev => {
        const remaining = prev.filter(ip => ip.id !== id);
        if (remaining.length > 0) {
          setSelectedIPId(remaining[0].id);
        }
        return prev;
      });
    }
  }, [selectedIPId]);

  // Обновление опций тарифов для текущего ИП
  const toggleTariffOption = useCallback((optionName: string) => {
    if (!currentIP) return;

    const selectedOptions = currentIP.selected_options || [];
    const newOptions = selectedOptions.includes(optionName)
      ? selectedOptions.filter(o => o !== optionName)
      : [...selectedOptions, optionName];

    updateIP(currentIP.id, { selected_options: newOptions });
  }, [currentIP, updateIP]);

  // Сброс к настройкам по умолчанию
  const resetToDefaults = useCallback(() => {
    setIPSettings(defaultIPSettings);
    setSelectedIPId(defaultIPSettings[0]?.id || '');
  }, []);

  return {
    ipSettings,
    currentIP,
    selectedIPId,
    selectIP,
    createIP,
    updateIP,
    deleteIP,
    toggleTariffOption,
    resetToDefaults,
    defaultValues: DEFAULT_IP_SETTINGS,
  };
}
