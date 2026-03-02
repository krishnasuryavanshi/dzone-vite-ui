import React, { FC, useEffect, useState } from 'react';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { Select } from '@/uicomponents/select';

interface ILineItemsDropdownProps {
  allLineItems?: { key: string; label: React.ReactNode }[];
  selectedLineItem?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const LineItemsDropdown: FC<ILineItemsDropdownProps> = ({
  selectedLineItem,
  allLineItems,
  handleSelectionChange,
}) => {
  const [selectedValue, setSelectedValue] = React.useState(null);
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
      setFilterValues({ ...filterValues, selectedLineItems: [] });
    }
  };

  useEffect(() => {
    if (filterValues?.reset) {
      setSelectedValue(null);
    }
  }, [filterValues]);

  return (
    <>
      <label htmlFor='selectLineitem'>Line Items</label>
      <Select
        id='selectLineitem'
        value={selectedValue}
        mode='multiple'
        title='Lineitem'
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
