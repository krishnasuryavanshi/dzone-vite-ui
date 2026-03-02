import { Row } from 'antd';
import { FC } from 'react';
import { LeadsByCountry, LeadsByJobTitle, Pacing } from './charts';

interface IChartsContainerProps {}

export const ChartsContainer: FC<IChartsContainerProps> = ({}) => {
  return (
    <Row gutter={[16, 16]}>
      <LeadsByJobTitle />
      <LeadsByCountry />
      <Pacing />
    </Row>
  );
};
