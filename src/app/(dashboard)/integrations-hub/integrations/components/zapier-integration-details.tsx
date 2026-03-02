'use client';

import { Link, Text, Tooltip } from '@/uicomponents';
import styles from './integrations-list.module.css';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';

interface ZapierIntegrationDetailsProps {
  name: string;
  url?: string;
  label?: string;
}

export const ZapierIntegrationDetails: React.FC<
  ZapierIntegrationDetailsProps
> = ({ name, url, label }) => {
  return (
    <DzBox className={styles.detailsLeft}>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Name:</Text>
        <Tooltip
          title={name}
          placement='top'
          overlayClassName={styles.integrationTooltip}>
          <Text className={styles.detailValue}>{name}</Text>
        </Tooltip>
      </DzBox>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Type:</Text>
        <Text className={styles.detailValue}>{label || 'Not configured'}</Text>
      </DzBox>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>URL:</Text>
        <Hideable show={!!url}>
          <Tooltip
            title={url}
            placement='top'
            overlayClassName={styles.integrationTooltip}>
            <Link href={url} target='_blank' className={styles.detailValue}>
              {url}
            </Link>
          </Tooltip>
        </Hideable>
        <Hideable show={!url}>
          <Text className={styles.detailValue}>{'Not configured'}</Text>
        </Hideable>
      </DzBox>
    </DzBox>
  );
};
