import React, { FC, useState } from 'react';
import { Col, Row } from 'antd';
import { ExecutiveReportCard } from './cards/executive-report-card';
import { ExecutiveReportType } from '../../../lib/enums';
import { ExecutiveGrids } from './executive-grid';
import { RestrictedAccessKeys } from '@/lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { access } from 'fs';

export interface IExecutiveReports {
  show: boolean;
}

type IExecutiveRestrictedAccessKeys = {
  [key in keyof typeof ExecutiveReportType as (typeof ExecutiveReportType)[key]]?: boolean;
};

export const ExecutiveReports: FC<IExecutiveReports> = ({ show }) => {
  const [gridColumns] = useState(() => ({
    xxl: 4,
    xl: 4,
    lg: 6,
    md: 8,
    sm: 24,
    xs: 24,
  }));

  const hasScheduledAccess = useRestrictedAccess(RestrictedAccessKeys.ScheduledInExecutiveDasboard);
  const hasDeliveredAccess = useRestrictedAccess(RestrictedAccessKeys.DeliveredInExecutiveDasboard);
  const hasInvoicedAccess = useRestrictedAccess(RestrictedAccessKeys.InvoicedInExecutiveDasboard);

  const restrictedAccessMap: IExecutiveRestrictedAccessKeys = {
    [ExecutiveReportType.Scheduled]: hasScheduledAccess,
    [ExecutiveReportType.Delivered]: hasDeliveredAccess,
    [ExecutiveReportType.Invoiced]: hasInvoicedAccess,
  };

  if (!show) return null;

  return (
    <>
      <Row gutter={[12, 12]}>
        {(Object.values(ExecutiveReportType) as string[]).map((key, index) => {
          const hasAccess =
            !(key in restrictedAccessMap) ||
            restrictedAccessMap[key as keyof typeof restrictedAccessMap];
          return (
            <Col key={index} {...gridColumns}>
              {hasAccess ? <ExecutiveReportCard type={key} /> : null}
            </Col>
          );
        })}
      </Row>
      <ExecutiveGrids />
    </>
  );
};
