'use client';

import { Link, Text, Tooltip } from '@/uicomponents';
import styles from './integrations-list.module.css';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';

interface WebFormIntegrationDetailsProps {
  name: string;
  url?: string;
}

export const WebFormIntegrationDetails: React.FC<
  WebFormIntegrationDetailsProps
> = ({ name, url }) => {
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
