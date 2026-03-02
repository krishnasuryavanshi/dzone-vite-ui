import { DzDropdown } from '@/components/shared/custom';
import React, { FC } from 'react';

const timeFrameLabels: Record<string, string> = {
  MTD: 'MTD vs MTD',
  LM: 'Last Month vs Same Month',
  QTD: 'QTD vs QTD',
  LQ: 'Last Quarter vs Same Quarter',
  YTD: 'YTD vs YTD',
};

interface IComparisonDropdownProps {
  allTimeFrame?: { key: string; label: React.ReactNode }[];
  selectedTimeFrame?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const ComparisonDropdown: FC<IComparisonDropdownProps> = ({
  selectedTimeFrame,
  allTimeFrame,
  handleSelectionChange,
}) => {
  const handleComaparisonSelection = (data: any) => {
    handleSelectionChange &&
      handleSelectionChange({
        type: 'selectedTimeFrame',
        selectedItems: data.selectedKeys,
      });
  };

  return (
    <DzDropdown
      className="dz-dropdown filter-dropdown filter-dropdown-Campaigns"
      items={allTimeFrame}
      label="Comparison"
      multiple={false}
      selectedItems={selectedTimeFrame}
      onSelect={handleComaparisonSelection}
      searchable={false}
    >
       {selectedTimeFrame?.map((timeFrame) => (
        <React.Fragment key={timeFrame}>
          {timeFrameLabels[timeFrame]}
        </React.Fragment>
      ))}
    </DzDropdown>
  );
};
