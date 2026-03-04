import { Select } from '@/uicomponents/form/input/select';
import React, { FC, useEffect, useState } from 'react';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';

type SelectionChangeArg = {
  type: string;
  selectedItems: string[];
};
interface ICampaginsDropdownProps {
  allLineItems?: { key: string; label: React.ReactNode }[];
  selectedLineItem?: string[];
  handleSelectionChange?: (data: SelectionChangeArg) => void;
}

export const CampaignItemsDropdown: FC<ICampaginsDropdownProps> = ({
  selectedLineItem,
  allLineItems,
  handleSelectionChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string[] | null>(null);
  const filterValues = useFilterDashboardStore((state: FilterState) => state.filterValues);
  const setFilterValues = useFilterDashboardStore((state: FilterState) => state.setFilterValues);
  const handleComaparisonSelection = (data: string[]) => {
    if (data) {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedCampaign',
          selectedItems: data,
        });
      setSelectedValue(data);
    } else {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedCampaign',
          selectedItems: [],
        });
      setSelectedValue(null);
      setFilterValues({ ...filterValues, selectedCompaigns: [] });
    }
  };

  useEffect(() => {
    if (filterValues?.reset) {
      setSelectedValue(null);
    }
  }, [filterValues]);

  return (
    <>
      <label htmlFor='selectCompaigns'>Campaigns</label>
      <Select
        id='selectCompaigns'
        value={selectedValue}
        mode='multiple'
        title='Campaigns'
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
