
import { FC } from 'react';
import { Flex } from '@/uicomponents/layout';
import { IPacingSummary } from '../../lib/types';
import { SummaryCard } from './summary-card';

interface ISummaryCardsProps {
  summary: IPacingSummary | null;
}

const getVarianceColor = (variance: number): string => {
  if (variance < 0) return 'var(--dzone-color-variance-negative)';
  if (variance > 0) return 'var(--dzone-color-variance-positive)';
  return 'var(--dzone-color-variance-zero)';
};

export const SummaryCards: FC<ISummaryCardsProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <Flex gap='1rem'>
      <SummaryCard
        title='Total Lead Expected'
        value={summary.expected.toLocaleString()}
      />
      <SummaryCard
        title='Published Lead'
        value={summary.published.toLocaleString()}
        valueColor='var(--dzone-color-primary)'
      />
      <SummaryCard
        title='Variance'
        value={summary.variance.toLocaleString()}
        valueColor={getVarianceColor(summary.variance)}
      />
      <SummaryCard
        title='Delivered Lead'
        value={
          summary.delivered !== null ? summary.delivered.toLocaleString() : 'NA'
        }
      />
    </Flex>
  );
};
