import { useScreenBreakpoint } from '@/lib/hooks';
import { Col, Row } from '@/uicomponents/layout/grid';
import { FC, ReactNode, useEffect, useState } from 'react';
import { IUseFilterDropdowns, useFilterDropdowns } from '../../lib/hooks';
import { CampaignsDropdown } from './campaigns-dropdown';
import { DurationDropdown } from './duration-dropdown';
import { LineItemsDropdown } from './line-items-dropdown';
import { Hideable } from '@/components/shared';

interface IFilterDropdownsProps extends IUseFilterDropdowns {
  allDurations?: { key: string; label: ReactNode }[];
}

export const FilterDropdowns: FC<IFilterDropdownsProps> = ({
  allCampaigns,
  allLineItems,
  allDurations,
  submit,
  reset,
  handleSelection,
  activeTab,
}) => {
  const {
    selectedLineItems,
    selectedCampaigns,
    selectedDuration,
    availableCampaigns,
    availableLineItems,
    handleSelectionChange,
  } = useFilterDropdowns({
    allCampaigns,
    allLineItems,
    submit,
    reset,
    handleSelection,
    activeTab,
  });

  const { currentScreenSize } = useScreenBreakpoint();
  const [columnSpan, setColumnSpan] = useState(4);

  useEffect(() => {
    if (['xxl', 'xl', 'lg', 'md'].includes(currentScreenSize)) {
      setColumnSpan(6);
    } else {
      setColumnSpan(12);
    }
  }, [currentScreenSize]);

  return (
    <Row gutter={[12, 12]} align={'bottom'}>
      <Hideable show={false}>
        <Col span={columnSpan}></Col>
      </Hideable>
      <Col span={columnSpan}>
        <CampaignsDropdown
          availableCampaigns={availableCampaigns}
          handleSelectionChange={handleSelectionChange}
          selectedCampaigns={selectedCampaigns}
        />
      </Col>
      <Col span={columnSpan}>
        <LineItemsDropdown
          availableLineItems={availableLineItems}
          handleSelectionChange={handleSelectionChange}
          selectedLineItems={selectedLineItems}
        />
      </Col>
      <Col span={columnSpan}>
        <DurationDropdown
          availableDurations={allDurations}
          handleSelectionChange={handleSelectionChange}
          selectedDurations={selectedDuration}
        />
      </Col>
    </Row>
  );
};
