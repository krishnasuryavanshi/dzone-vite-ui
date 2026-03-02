'use client';

import { Col } from '@/uicomponents/layout/grid';
import { FC, PropsWithChildren, useState } from 'react';
import { ChartCard } from './supplier-chart-card';
import { ChartsAdditional } from './supplier-charts-additional';

interface ISupplierChartColumnProps extends PropsWithChildren {
  chartTitle: string;
  hasExtra?: boolean;
  extraTitle?: string;
}

export const ChartColumn: FC<ISupplierChartColumnProps> = ({
  chartTitle,
  hasExtra = false,
  extraTitle,
  children,
}) => {
  const [gridColumns] = useState({
    xxl: 8,
    xl: 12,
    lg: 12,
    md: 12,
    sm: 24,
    xs: 24,
  });

  return (
    <Col {...gridColumns}>
      <ChartCard
        title={chartTitle}
        extra={hasExtra && <ChartsAdditional label={extraTitle as string} />}>
        {children}
      </ChartCard>
    </Col>
  );
};
