import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, ReactNode } from 'react';
import { ExecutiveCardTitle } from './executive-card-title';
import { ExecutiveCardMetrics } from './executive-card-metrics';
import ExecutiveIconRenderer from './executive-icon-renderer';
import PercentDisplay from './executive-card-percent-display';
import { DZONE_CLR_GRAY_4 } from '@/lib/constants';

interface IRecord {
  name: string;
  value: string;
}
interface IExecutiveCardProps {
  title: string | ReactNode;
  current: IRecord;
  previous: IRecord;
  percent: string;
  isPositive: boolean | null;
  waitingToGoLiveData: IRecord;
}

export const ExecutiveCard: FC<IExecutiveCardProps> = ({
  waitingToGoLiveData,
  title,
  current,
  previous,
  percent,
  isPositive,
}) => {
  const hasCurrentData = current && current.value;

  return (
    <DzBox
      dzOneBox
      style={{
        padding: '0.875rem 1.2rem',
        height: '8rem',
        minWidth: '12.5rem',
        background: DZONE_CLR_GRAY_4,
      }}>
      <ExecutiveCardTitle title={title || waitingToGoLiveData?.name} />
      <Flex
        gap='0.5rem'
        justify='space-between'
        style={{ paddingTop: '0.5rem' }}>
        <Flex vertical>
          <ExecutiveCardMetrics data={current} record={waitingToGoLiveData} />
          {previous && (
            <ExecutiveCardMetrics data={previous} isPrevious={true} />
          )}
        </Flex>
        <Flex gap='0.25rem' vertical>
          {hasCurrentData && <ExecutiveIconRenderer isPositive={isPositive} />}
          <PercentDisplay isPositive={isPositive} percent={percent} />
        </Flex>
      </Flex>
    </DzBox>
  );
};
