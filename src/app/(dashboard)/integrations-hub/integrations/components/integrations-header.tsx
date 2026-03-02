'use client';

import React from 'react';
import { Title } from '@/uicomponents';
import { DzBox } from '@/components/layout/v1/dz-box';
import styles from './integrations-header.module.css';

export const IntegrationsHeader: React.FC = () => {
  return (
    <DzBox className={styles.integrationsHeader}>
      <Title level={3} style={{ margin: 0 }}>
        Integration Hub
      </Title>
    </DzBox>
  );
};
