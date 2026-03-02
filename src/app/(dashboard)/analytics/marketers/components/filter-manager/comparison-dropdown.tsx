import { Select } from '@/uicomponents/select';
import React, { FC, useEffect, useState } from 'react';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';

interface IComparisonDropdownProps {
  allLineItems?: { key: string; label: React.ReactNode }[];
  selectedLineItem?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const ComparisonDropdown: FC<IComparisonDropdownProps> = ({
  selectedLineItem,
  allLineItems,
  handleSelectionChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>('week');
  const filterValues = useFilterDashboardStore(
    (state: FilterState) => state.filterValues,
  );
  const handleComaparisonSelection = (data: any) => {
    if (data) {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedLineItems',
          selectedItems: data,
        });

      setSelectedValue(data);
    } else {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedLineItems',
          selectedItems: [],
        });
      setSelectedValue(null);
    }
  };

  useEffect(() => {
    if (filterValues?.reset) {
      setSelectedValue(null);
    }
  }, [filterValues]);

  return (
    <>
      <label htmlFor='selectComparison'>Comparison</label>
      <Select
        id='selectComparison'
        value={selectedValue}
        title='Comparison'
        allowClear
        style={{ width: '100%' }}
        placeholder='Please select'
        onChange={handleComaparisonSelection}
        options={allLineItems?.map((item) => ({
          value: item.key,
          label: item.label,
        }))}
      />
    </>
  );
};
