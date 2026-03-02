import { Translate } from '@/components/i18n';
import { TableProps } from '@/lib/types/uicomponents';
import { last } from 'lodash';
import { ReactNode } from 'react';
import { getDateFilterColumn } from './date-filter-column';
import { getDateTimeFilterColumn } from './datetime-filter-column';
import { getDateRangeObjectFilterColumn } from './daterange-object-filter-column';
import { getFilterableColumn } from './filterable-column';
import { getSearchableColumn } from './searchable-column';

export type OnChange<T> = NonNullable<TableProps<T>['onChange']>;
export type Filters<T> = Parameters<OnChange<T>>[1];
export type Sorter<T> = Parameters<OnChange<T>>[2];

export function createColumn<T>(
  hasFilters?: boolean,
  filtereInfo?: Filters<T>,
) {
  return (
    name: string,
    dataIndex: string,
    extra?: Record<string, any> | null,
    renderer?: (value: any, record: T, index: number) => ReactNode,
    options?: Record<string, any>,
  ) => {
    const nestedDataIndexes = dataIndex?.split('.');
    const key = last(nestedDataIndexes);

    if (hasFilters !== true) {
      extra = {
        ...extra,
        filters: null,
        isFilterable: false,
        isSearchable: false,
        isDateFilter: false,
        isMinLengthRequiredForSearch: false,
      };
    }

    if (extra?.filters?.length || extra?.isFilterable) {
      const filterableColumnObj = getFilterableColumn({
        filters: extra?.filters,
        ...options?.dynamicFilters[key as string],
      });
      extra = {
        ...extra,
        ...filterableColumnObj,
        filteredValue: filtereInfo?.[key as string] || null,
      };
    }

    if (extra?.isSearchable) {
      const searchableColumnObj = getSearchableColumn(
        name,
        extra?.isMinLengthRequiredForSearch,
        extra?.searchCharacterMinLength,
      );
      extra = {
        ...extra,
        ...searchableColumnObj,
        filteredValue: filtereInfo?.[key as string] || null,
      };
    }

    if (extra?.isDateFilter) {
      const dateFilterColumnObj = getDateFilterColumn();
      extra = {
        ...extra,
        ...dateFilterColumnObj,
        filteredValue: filtereInfo?.[key as string] || null,
      };
    }

    if (extra?.isDateRangeObjectFilter) {
      const dateRangeFilterColumnObj = getDateRangeObjectFilterColumn();
      extra = {
        ...extra,
        ...dateRangeFilterColumnObj,
        filteredValue: filtereInfo?.[key as string] || null,
      };
    }

    if (extra?.isDateTimeFilter) {
      const dateTimeFilterColumnObj = getDateTimeFilterColumn();
      extra = {
        ...extra,
        ...dateTimeFilterColumnObj,
        filteredValue: filtereInfo?.[key as string] || null,
      };
    }

    return {
      title: <Translate i18nKey={name} />,
      dataIndex: nestedDataIndexes?.length > 1 ? nestedDataIndexes : dataIndex,
      key,
      render: renderer,
      width: extra?.filterIcon ? 250 : 200,
      ...extra,
    };
  };
}
