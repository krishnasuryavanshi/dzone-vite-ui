'use client';

import { Col } from '@/uicomponents/layout/grid';
import { FC, PropsWithChildren, useState } from 'react';
import { ChartCard } from './marketer-chart-card';
import { ChartsAdditional } from './marketer-charts-additional';

interface IMarketerChartColumnProps extends PropsWithChildren {
  chartTitle: string;
  hasExtra?: boolean;
  extraTitle?: string;
}

export const ChartColumn: FC<IMarketerChartColumnProps> = ({
  chartTitle,
  hasExtra = false,
  extraTitle,
  children,
}) => {
  const [gridColumns] = useState({
    xxl: 8,
    xl: 24,
    lg: 12,
    md: 12,
    sm: 24,
    xs: 24,
  });

  return (
    <Col {...gridColumns} className='dz-one-chart-card-container'>
      <ChartCard
        title={chartTitle}
        extra={hasExtra && <ChartsAdditional label={extraTitle as string} />}>
        {children}
      </ChartCard>
    </Col>
  );
};
