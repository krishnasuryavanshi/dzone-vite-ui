import { DzDropdown } from '@/components/shared/custom';
import React, { FC } from 'react';

const executiveUnitType = {
  Revenue: 'Revenue',
  Leads: 'Leads',
  LineItems: 'LineItems',
  Campaigns: 'Campaigns',
};

interface IUnitsDropdownProps {
  allUnits?: { key: string; label: React.ReactNode }[];
  selectedUnit?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const UnitsDropdown: FC<IUnitsDropdownProps> = ({
  selectedUnit,
  allUnits,
  handleSelectionChange,
}) => {
  const handleUnitSelection = (data: any) => {
    handleSelectionChange &&
      handleSelectionChange({
        type: 'selectedUnit',
        selectedItems: data.selectedKeys,
      });
  };

  return (
    <DzDropdown
      className='dz-dropdown filter-dropdown filter-dropdown-Units'
      items={allUnits}
      label='Units'
      multiple={false}
      selectedItems={selectedUnit}
      onSelect={handleUnitSelection}
      searchable={false}>
      {selectedUnit &&
        selectedUnit.map((unit) => (
          <React.Fragment key={unit}>
            {executiveUnitType[unit as keyof typeof executiveUnitType]}
          </React.Fragment>
        ))}
    </DzDropdown>
  );
};
