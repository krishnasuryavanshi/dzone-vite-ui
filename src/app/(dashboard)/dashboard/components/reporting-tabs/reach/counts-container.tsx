import { MapFunction } from '@/components/shared';
import { Col, Row } from '@/uicomponents/layout/grid';
import { FC, useState } from 'react';
import { ReachCountsType } from '../../../lib/enums';
import { CountReportCard } from '../count-report-card';

interface ICountsContainerProps {}

export const CountsContainer: FC<ICountsContainerProps> = ({}) => {
  const [gridColumns] = useState({
    xxl: 6,
    xl: 6,
    lg: 8,
    md: 8,
    sm: 12,
    xs: 24,
  });

  const [countskeys] = useState([
    ReachCountsType.LeadsDelivered,
    ReachCountsType.UniqueAccountsReached,
  ]);

  const renderCards = (key: string) => {
    return (
      <Col
        style={{ marginBottom: '1rem' }}
        {...gridColumns}>
        <CountReportCard type={key} />
      </Col>
    );
  };

  return (
    <Row gutter={16}>
      <MapFunction
        items={countskeys}
        renderItem={renderCards}
      />
    </Row>
  );
};
