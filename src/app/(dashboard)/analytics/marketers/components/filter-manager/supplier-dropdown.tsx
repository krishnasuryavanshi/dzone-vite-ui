import { Select } from '@/uicomponents/form/input/select';
import React, { FC, useEffect, useState } from 'react';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';

interface ISupplierItemsDropdownProps {
  allLineItems?: { key: string; label: string }[];
  selectedLineItem?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const SupplierItemsDropdown: FC<ISupplierItemsDropdownProps> = ({
  selectedLineItem,
  allLineItems,
  handleSelectionChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const filterValues = useFilterDashboardStore((state: FilterState) => state.filterValues);
  const setFilterValues = useFilterDashboardStore((state: FilterState) => state.setFilterValues);
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
      setFilterValues({ ...filterValues, selectedSuppliers: [] });
    }
  };

  useEffect(() => {
    if (filterValues?.reset) {
      setSelectedValue(null);
    }
  }, [filterValues]);

  return (
    <>
      <label htmlFor='selectSupplier'>Supplier</label>
      <Select
        id='selectSupplier'
        value={selectedValue}
        mode='multiple'
        title='Supplier'
        allowClear
        showSearch
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
        }
        style={{ width: '100%' }}
        placeholder='Please select'
        onChange={handleComaparisonSelection}
        options={allLineItems?.map((item) => ({
          value: item.label,
          label: item.label,
        }))}
        maxTagCount={1}
      />
    </>
  );
};
