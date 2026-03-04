import { DzDropdown } from '@/components/shared/custom';
import React, { FC, ReactNode } from 'react';

interface IDurationDropdownProps {
  availableDurations?: { key: string; label: ReactNode }[];
  selectedDurations?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const DurationDropdown: FC<IDurationDropdownProps> = ({
  availableDurations,
  selectedDurations,
  handleSelectionChange,
}) => {
  const handleDurationSelection = (data: any) => {
    handleSelectionChange &&
      handleSelectionChange({
        type: 'selectedDurations',
        selectedItems: data.selectedKeys,
      });
  };

  return (
    <DzDropdown
      className='dz-dropdown filter-dropdown filter-dropdown-Campaigns'
      items={availableDurations}
      label='Duration'
      multiple={false}
      selectedItems={selectedDurations}
      onSelect={handleDurationSelection}
      searchable={false}
    >
      {(selectedDurations?.includes('week') && 'This Week') ||
        (selectedDurations?.includes('month') && 'This Month') ||
        (selectedDurations?.includes('quarter') && 'This Quarter') ||
        (selectedDurations?.includes('year') && 'This Year')}
    </DzDropdown>
  );
};
