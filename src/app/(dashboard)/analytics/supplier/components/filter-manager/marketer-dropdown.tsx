import React, { FC, useEffect, useState } from 'react';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { Select } from '@/uicomponents/select';

interface IMarketersDropdownProps {
  allLineItems?: { key: string; label: React.ReactNode }[];
  selectedLineItem?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const MarketersItemsDropdown: FC<IMarketersDropdownProps> = ({
  selectedLineItem,
  allLineItems,
  handleSelectionChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const filterValues = useFilterDashboardStore(
    (state: FilterState) => state.filterValues,
  );
  const setFilterValues = useFilterDashboardStore(
    (state: FilterState) => state.setFilterValues,
  );
  const handleComaparisonSelection = (data: any) => {
    if (data) {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedMarketerItems',
          selectedItems: data,
        });

      setSelectedValue(data);
    } else {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedMarketerItems',
          selectedItems: [],
        });
      setSelectedValue(null);
      setFilterValues({ ...filterValues, selectedMarketers: [] });
    }
  };

  useEffect(() => {
    if (filterValues?.reset) {
      setSelectedValue(null);
    }
  }, [filterValues]);

  return (
    <>
      <label htmlFor='selectMarketers'>Marketers</label>
      <Select
        id='selectMarketers'
        value={selectedValue}
        mode='multiple'
        title='Marketers'
        allowClear
        showSearch
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: '100%' }}
        placeholder='Please select'
        onChange={handleComaparisonSelection}
        options={allLineItems?.map((item) => ({
          value: item.key,
          label: item.label,
        }))}
        maxTagCount={1}
      />
    </>
  );
};
