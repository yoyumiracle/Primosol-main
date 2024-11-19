import { useMemo } from 'react';

export enum FILTER_TYPES {
  string,
  number,
}

export interface FilterCriterion {
  prop: string;
  operator: Operators;
  value?: any;
}

export type Operators = '>' | '<' | '===' | 'indexOf' | '!==' | '>=' | '<=';

const filterProps = (item: any, term: string, operator: Operators) => {
  if (term === undefined) return true;
  if (item === null || item === undefined) return false;

  switch (operator) {
    case '!==':
      return item !== term;
    case '===':
      return item === term;
    case '>':
      return item > term;
    case '<':
      return item < term;
    case '>=':
      return item >= term;
    case '<=':
      return item <= term;
    default:
      return typeof item === 'string' && item.toLowerCase().includes(term.toLowerCase());
  }
};

const useFilteredItems = (items: any[], criteria: FilterCriterion[]) => {
  return useMemo(() => {
    if (!items || !criteria || criteria.length === 0) {
      return items;
    }

    return items.filter(item => criteria.every(criterion => filterProps(item[criterion.prop], criterion.value, criterion.operator)));
  }, [items, criteria]);
};

export default useFilteredItems;
