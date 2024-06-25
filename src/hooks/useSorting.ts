// hooks/useSorting.ts
import { useState } from 'react';

type SortDirection = 'ascending' | 'descending';

interface SortConfig<T> {
  key: keyof T | string;
  direction: SortDirection;
}

const useSorting = <T>(items: T[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const sortedItems = () => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj[key], a);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj[key], b);

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: keyof T | string) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: keyof T | string) => {
    if (!sortConfig) return '';
    return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc') : '';
  };

  return { sortedItems, requestSort, getClassNamesFor };
};

export default useSorting;
