import { Row } from 'antd';
import { FC } from 'react';
import { DollarAmountForBillableLeads, NoOfBillableLeads } from './charts';

interface IChartsContainerProps {}

export const ChartsContainer: FC<IChartsContainerProps> = ({}) => {
  return (
    <Row gutter={[16, 16]}>
      <NoOfBillableLeads />
      <DollarAmountForBillableLeads />
    </Row>
  );
};
