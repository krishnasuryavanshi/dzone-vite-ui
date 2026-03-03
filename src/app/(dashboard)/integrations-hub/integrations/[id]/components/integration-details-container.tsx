
import React from 'react';
import { DzBox } from '@/components/layout/v1/dz-box';
import { IntegrationDetails } from './integration-details';
import { HasPermission } from '@/components/auth/has-permission';
import { IntegrationsActionsEnum } from '@/lib/enums/permissions';

interface IntegrationDetailsContainerProps {
  integrationId: string;
}

export const IntegrationDetailsContainer: React.FC<
  IntegrationDetailsContainerProps
> = ({ integrationId }) => {
  return (
    <HasPermission permissions={IntegrationsActionsEnum.View} showAccessDenied>
      <DzBox className='integration-details-container'>
        <IntegrationDetails integrationId={integrationId} />
      </DzBox>
    </HasPermission>
  );
};
