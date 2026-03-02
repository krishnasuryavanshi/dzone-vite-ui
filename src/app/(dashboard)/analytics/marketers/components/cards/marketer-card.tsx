import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, ReactNode } from 'react';
import { MarketerCardTitle } from './marketer-card-title';
import { MarketerCardMetrics } from './marketer-card-metrics';
import MarketerPercentDisplay from './marketer-card-percent-display';
import { MarketerCardSubTitle } from './marketer-card-subtitle';
import { DZONE_CLR_GRAY_4 } from '@/lib/constants';

interface IRecord {
  name: string;
  value: string;
}
interface IMarketerCardProps {
  title: string | ReactNode;
  subTitle?: string | ReactNode;
  current: IRecord;
  previous?: IRecord;
  percent: string;
  isPositive: boolean | null;
  waitingToGoLiveData: IRecord;
  isCurrencyMetric?: boolean | null;
}

export const MarketerCard: FC<IMarketerCardProps> = ({
  waitingToGoLiveData,
  title,
  subTitle,
  current,
  previous,
  percent,
  isPositive,
  isCurrencyMetric = false,
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
      }}>
      <MarketerCardTitle title={title || waitingToGoLiveData?.name} />
      <MarketerCardSubTitle subTitle={subTitle} />
      <Flex
        gap='0.5rem'
        justify='space-between'
        style={{ paddingTop: '1rem', paddingLeft: '1rem' }}>
        <Flex vertical>
          <MarketerCardMetrics
            data={current}
            record={waitingToGoLiveData}
            isCurrency={isCurrencyMetric}
          />
          {previous && (
            <MarketerCardMetrics data={previous} isPrevious={true} />
          )}
        </Flex>
        <Flex gap='0.25rem' vertical>
          {/* {hasCurrentData && <MarketerIconRenderer isPositive={isPositive} />} */}
          <MarketerPercentDisplay isPositive={isPositive} percent={percent} />
        </Flex>
      </Flex>
    </DzBox>
  );
};
