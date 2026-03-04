import React, { FC, ReactNode, useEffect, useState } from 'react';
import { UnitsDropdown } from './units-dropdown';
import { ComparisonDropdown } from './comparison-dropdown';
import { useScreenBreakpoint } from '@/lib/hooks';
import { Row, Col } from 'antd';
import { IUseFilterDropdowns, useFilterDropdowns } from '../../lib/hooks';

interface IExecutiveFilterDropdown extends IUseFilterDropdowns {
  submit: number;
  reset: number;
  allUnits?: { key: string; label: ReactNode }[];
  allTimeFrame?: { key: string; label: ReactNode }[];
}

export const ExecutiveFilterDropdowns: FC<IExecutiveFilterDropdown> = ({
  submit,
  reset,
  allUnits,
  allTimeFrame,
  activeTab,
  handleSelection,
}) => {
  const { selectedUnit, selectedTimeFrame, handleSelectionChange } = useFilterDropdowns({
    submit,
    reset,
    handleSelection,
    activeTab,
  });
  const { currentScreenSize } = useScreenBreakpoint();
  const [columnSpanUnits, setColumnSpanUnits] = useState<number>(8);
  const [columnSpanComparison, setColumnSpanComparison] = useState<number>(10);

  useEffect(() => {
    if (['xxl', 'xl', 'lg'].includes(currentScreenSize)) {
      setColumnSpanUnits(10);
      setColumnSpanComparison(20 - 6);
    } else if (['md', 'sm', 'xs'].includes(currentScreenSize)) {
      setColumnSpanUnits(24);
      setColumnSpanComparison(24);
    }
  }, [currentScreenSize]);

  return (
    <Row gutter={[12, 12]} align={'bottom'}>
      <Col span={columnSpanUnits}>
        <UnitsDropdown
          allUnits={allUnits}
          selectedUnit={selectedUnit}
          handleSelectionChange={handleSelectionChange}
        />
      </Col>
      <Col span={columnSpanComparison}>
        <ComparisonDropdown
          allTimeFrame={allTimeFrame}
          selectedTimeFrame={selectedTimeFrame}
          handleSelectionChange={handleSelectionChange}
        />
      </Col>
    </Row>
  );
};
