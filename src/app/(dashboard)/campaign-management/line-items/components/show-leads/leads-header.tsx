import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Button, Title } from '@/uicomponents';
import React, { FC } from 'react';
import { Translate } from '@/components/i18n';
import { LeadsActions } from './leads-actions';
import { useLeadsCountStore } from '../../../leads/store';
import { DZONE_CLR_GRAY_4 } from '@/lib/constants';

interface ILeadsHeaderProps {
  lineItemId: string;
  totalFilteredLeads: number;
  leadStatus: string[];
  validationStatus: string[];
  refreshLeadsList: () => void;
  tenantCode?: string;
}

export const LeadsHeader: FC<ILeadsHeaderProps> = ({
  lineItemId,
  totalFilteredLeads,
  leadStatus,
  validationStatus,
  refreshLeadsList,
  tenantCode,
}) => {
  const totalLeads = useLeadsCountStore((state) => state.totalLeads);

  return (
    <DzBox
      dzOneBox
      style={{
        borderRadius: '0.5rem',
        background: DZONE_CLR_GRAY_4,
      }}
    >
      <Flex justify='space-between' align='center' style={{ height: '2.5rem' }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          <Translate i18nKey='pages.lineItems.label.totalLeads' /> ({totalLeads})
        </Title>

        <LeadsActions
          lineItemId={lineItemId}
          totalFilteredLeads={totalFilteredLeads}
          leadStatus={leadStatus}
          validationStatus={validationStatus}
          refreshLeadsList={refreshLeadsList}
          tenantCode={tenantCode}
        />
      </Flex>
    </DzBox>
  );
};
