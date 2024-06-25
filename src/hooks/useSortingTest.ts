// hooks/useSorting.ts
import { useState } from 'react';
import { IAthlete } from '../types/types';

type SortKey = keyof IAthlete | 'club.name';

interface SortConfig {
  key: SortKey;
  direction: 'ascending' | 'descending';
}

const useSortingTest = (items: IAthlete[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedItems = () => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'club.name') {
        aValue = a.club.name;
        bValue = b.club.name;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: SortKey) => {
    if (!sortConfig) return '';
    return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc') : '';
  };

  return { sortedItems, requestSort, getClassNamesFor };
};

export default useSortingTest;