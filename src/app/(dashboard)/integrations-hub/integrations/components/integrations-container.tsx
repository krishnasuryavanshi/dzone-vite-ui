import React from 'react';
import { IntegrationsHeader } from './integrations-header';
import { IntegrationsList } from './integrations-list';
import { DzBox } from '@/components/layout/v1/dz-box';
import { HasPermission } from '@/components/auth/has-permission';
import { IntegrationsActionsEnum } from '@/lib/enums/permissions';
import styles from './integrations-container.module.css';

export const IntegrationsContainer: React.FC = () => {
  return (
    <HasPermission permissions={IntegrationsActionsEnum.View} showAccessDenied>
      <DzBox className={styles.integrationsContainer}>
        <IntegrationsHeader />
        <DzBox className={styles.integrationsContent}>
          <IntegrationsList />
        </DzBox>
      </DzBox>
    </HasPermission>
  );
};
