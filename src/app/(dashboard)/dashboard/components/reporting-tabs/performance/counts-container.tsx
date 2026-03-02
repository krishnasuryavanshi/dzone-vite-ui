import { MapFunction } from '@/components/shared';
import { Col, Row } from '@/uicomponents/layout/grid';
import { FC, useState } from 'react';
import { PerformanceCountsType } from '../../../lib/enums';
import { CountReportCard } from '../count-report-card';
import { useRestrictedAccess } from '@/lib/hooks';
import { RestrictedAccessKeys } from '@/lib/enums';

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

  const hasAverageTimePacingRestrictedAccess = useRestrictedAccess(
    RestrictedAccessKeys.AverageTimeinPacingReserved,
  );

  const [countskeys] = useState<string[]>([
    PerformanceCountsType.NumberOfContactsGenerated,
    PerformanceCountsType.NumberOfLeadsDelivered,
    PerformanceCountsType.PercentageOfContactsThatBecomeDeliverableLeads,
    PerformanceCountsType.AverageTimeFromCampaignCreationToFirstLeadDelivery,
    PerformanceCountsType.AverageTimeFromContactResearchToQualityAudit,
    PerformanceCountsType.AverageTimeFromQaReadyToLeadDelivery,
    PerformanceCountsType.AverageTimeInPacingReserved,
  ]);
  const filteredCountsKeys = countskeys.filter((key) => {
    if (key === PerformanceCountsType.AverageTimeInPacingReserved) {
      return hasAverageTimePacingRestrictedAccess;
    }
    return true;
  });

  const renderCards = (key: string) => {
    return (
      <Col style={{ marginBottom: '1rem' }} {...gridColumns}>
        <CountReportCard type={key} />
      </Col>
    );
  };

  return (
    <Row gutter={16}>
      <MapFunction items={filteredCountsKeys} renderItem={renderCards} />
    </Row>
  );
};
