import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, ReactNode } from 'react';
import { SupplierCardTitle } from './supplier-card-title';
import { SupplierCardMetrics } from './supplier-card-metrics';
import PercentDisplay from './supplier-card-percent-display';
import { SupplierCardSubTitle } from './supplier-card-subtitle';
import DZAmSparkline from '@/components/amcharts/sparkline/dz-spark-line';
import { DZONE_CLR_GRAY_4 } from '@/lib/constants';

interface IRecord {
  name: string;
  value: string;
}
interface ISupplierCardSparklineProps {
  id: string;
  title: string | ReactNode;
  subTitle?: string | ReactNode;
  current: IRecord;
  previous?: IRecord;
  percent: string;
  isPositive: boolean | null;
  waitingToGoLiveData: IRecord;
  isCurrencyMetric?: boolean | null;
  sparklineData?: { date: number; value: number }[];
  sparklineColor?: string;
}

export const SupplierCardSparkline: FC<ISupplierCardSparklineProps> = ({
  id,
  waitingToGoLiveData,
  title,
  subTitle,
  current,
  previous,
  percent,
  isPositive,
  isCurrencyMetric = false,
  sparklineData,
  sparklineColor = '#22c55e',
}) => {
  const hasCurrentData = current && current.value;

  return (
    <DzBox
      dzOneBox
      style={{
        padding: '0.875rem 1.2rem',
        height: '7rem',
        minWidth: '12.5rem',
        backgroundColor: DZONE_CLR_GRAY_4,
      }}
    >
      <SupplierCardTitle title={title || waitingToGoLiveData?.name} />
      <SupplierCardSubTitle subTitle={subTitle} />
      <Flex
        gap='0.5rem'
        justify='space-between'
        style={{ paddingTop: '1rem', paddingLeft: '1rem' }}
      >
        <Flex vertical style={{ flex: '1 1 auto' }}>
          <SupplierCardMetrics
            data={current}
            record={waitingToGoLiveData}
            isCurrency={isCurrencyMetric}
          />
          {previous && <SupplierCardMetrics data={previous} isPrevious={true} />}
        </Flex>
        <Flex gap='0.25rem' vertical>
          {/* {hasCurrentData && <SupplierIconRenderer isPositive={isPositive} />} */}
          {percent && <PercentDisplay isPositive={isPositive} percent={percent} />}
        </Flex>
        <Flex vertical style={{ flex: '0 1 180px', minWidth: '100px' }}>
          {sparklineData && (
            <div style={{ height: '100%', width: '100%' }}>
              <DZAmSparkline id={`${id}-sparkline`} data={sparklineData} color={sparklineColor} />
            </div>
          )}
        </Flex>
      </Flex>
    </DzBox>
  );
};
