import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CategoryCommission } from '../types';

const CSV_URL = import.meta.env.BASE_URL + 'data/wb_commissions.csv';

// Глобальный кэш для избежания повторных загрузок
let categoriesCache: CategoryCommission[] | null = null;
let loadingPromise: Promise<CategoryCommission[]> | null = null;

function parseCSV(csvText: string): CategoryCommission[] {
  const lines = csvText.trim().split('\n');
  const categories: CategoryCommission[] = [];

  // Пропускаем заголовок
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Простой парсинг CSV (без кавычек в данных)
    const parts = line.split(',');
    if (parts.length >= 5) {
      categories.push({
        category: parts[0].trim(),
        subject: parts[1].trim(),
        commission_fbo: parseFloat(parts[2]) || 0,
        commission_fbs_to_wb: parseFloat(parts[3]) || 0,
        commission_fbs_direct: parseFloat(parts[4]) || 0,
      });
    }
  }

  return categories;
}

async function loadCategories(): Promise<CategoryCommission[]> {
  if (categoriesCache) {
    return categoriesCache;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = fetch(CSV_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.status}`);
      }
      return response.text();
    })
    .then(csvText => {
      categoriesCache = parseCSV(csvText);
      return categoriesCache;
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryCommission[]>(categoriesCache || []);
  const [isLoading, setIsLoading] = useState(!categoriesCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoriesCache) {
      setCategories(categoriesCache);
      setIsLoading(false);
      return;
    }

    loadCategories()
      .then(data => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const searchCategories = useCallback((query: string, limit: number = 20): CategoryCommission[] => {
    if (!query) return categories.slice(0, limit);

    const lowerQuery = query.toLowerCase();
    return categories
      .filter(c =>
        c.subject.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }, [categories]);

  const getCategoryBySubject = useCallback((subject: string): CategoryCommission | undefined => {
    return categories.find(c => c.subject === subject);
  }, [categories]);

  const getAllSubjects = useMemo((): string[] => {
    return categories.map(c => c.subject);
  }, [categories]);

  return {
    categories,
    isLoading,
    error,
    searchCategories,
    getCategoryBySubject,
    getAllSubjects,
  };
}

// Синхронные функции для использования вне React компонентов
// (работают только после первой загрузки)
export function getCategoryBySubjectSync(subject: string): CategoryCommission | undefined {
  return categoriesCache?.find(c => c.subject === subject);
}

export function searchCategoriesSync(query: string, limit: number = 20): CategoryCommission[] {
  if (!categoriesCache) return [];
  if (!query) return categoriesCache.slice(0, limit);

  const lowerQuery = query.toLowerCase();
  return categoriesCache
    .filter(c =>
      c.subject.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

// Предзагрузка категорий при инициализации приложения
export function preloadCategories(): Promise<CategoryCommission[]> {
  return loadCategories();
}
