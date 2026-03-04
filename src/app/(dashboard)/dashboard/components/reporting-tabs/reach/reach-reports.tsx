import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { ChartsContainer } from './charts-container';
import { CountsContainer } from './counts-container';

interface IReachReportsProps {
  show: boolean;
}

export const ReachReports: FC<IReachReportsProps> = ({ show }) => {
  if (!show) return null;
  return (
    <Flex gap='0' vertical>
      <CountsContainer />
      <ChartsContainer />
    </Flex>
  );
};
