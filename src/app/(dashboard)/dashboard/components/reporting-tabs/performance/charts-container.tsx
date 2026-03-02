import { CanAccess } from '@/components/auth';
import { RestrictedAccessKeys } from '@/lib/enums';
import { Row } from '@/uicomponents/layout/grid';
import { FC } from 'react';
import {
  ClientRejectRate,
  ClientRejectionReasons,
  DetailsOfInaccurateData,
  InternalRejectRate,
  InternalRejectionResons,
  LeadStatus,
} from './charts';
import { Hideable } from '@/components/shared';

interface IChartsContainerProps {}

export const ChartsContainer: FC<IChartsContainerProps> = ({}) => {
  return (
    <Row gutter={[16, 16]}>
      <InternalRejectRate />
      <ClientRejectRate />
      <InternalRejectionResons />
      <Hideable show={false}>
        <ClientRejectionReasons />
      </Hideable>
      <Hideable show={false}>
        <DetailsOfInaccurateData />
      </Hideable>
      <LeadStatus />
    </Row>
  );
};
