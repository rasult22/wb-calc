// Категории загружаются из CSV файла через хук useCategories
// Этот файл оставлен для обратной совместимости синхронных функций

export {
  getCategoryBySubjectSync as getCategoryBySubject,
  searchCategoriesSync as searchCategories,
} from '../hooks/useCategories';
