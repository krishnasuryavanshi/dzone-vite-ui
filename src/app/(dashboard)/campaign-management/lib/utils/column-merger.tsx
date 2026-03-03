import React from 'react';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import styles from '../styles/sticky-columns.module.css';
import { RecordStatusBadge } from '../components/record-status-badge';

interface NameIdRendererProps {
  name: string;
  id: string;
  updatedBy?: string | null;
  showBadge?: boolean;
}

// Common component for all name/id combinations
export const NameIdRenderer: FC<NameIdRendererProps> = ({
  name,
  id,
  updatedBy,
  showBadge = false,
}) => (
  <Flex
    align='center'
    justify='space-between'
    gap='0.5rem'
    style={{ width: '100%' }}>
    <Flex
      vertical
      gap='0'
      className={styles.mergedColumn}
      style={{ minWidth: 0, flex: 1 }}>
      <Text className={styles.mergedColumnName} ellipsis={{ tooltip: name }}>
        {name}
      </Text>
      {id && <Text className={styles.mergedColumnId}>{id}</Text>}
    </Flex>
    {showBadge && <RecordStatusBadge updatedBy={updatedBy} />}
  </Flex>
);
NameIdRenderer.displayName = 'NameIdRenderer';

// Generic renderer factory for creating column renderers
const createNameIdRenderer = (
  nameExtractor: (value: any, record: any) => string,
  idExtractor: (value: any, record: any) => string,
  showBadge: boolean = false,
) => {
  const renderer = (value: any, record: any) => {
    const name = nameExtractor(value, record);
    const id = idExtractor(value, record);
    return (
      <NameIdRenderer
        name={name}
        id={id}
        updatedBy={record.updatedBy}
        showBadge={showBadge}
      />
    );
  };
  renderer.displayName = 'NameIdRenderer';
  return renderer;
};

// Campaign name/id renderer (with badge - for Campaign list)
export const campaignNameIdRenderer = createNameIdRenderer(
  (_value, record) => record.campaignName || record.name || _value || '',
  (_value, record) => record.campaign?.campaignId || record.campaignId || '',
  true,
);

// Campaign name/id renderer (no badge - for Line Item list's Campaign column)
export const campaignNameIdRendererNoBadge = createNameIdRenderer(
  (_value, record) => record.campaignName || record.name || _value || '',
  (_value, record) => record.campaign?.campaignId || record.campaignId || '',
);

// Line item name/id renderer (with badge)
export const lineItemNameIdRenderer = createNameIdRenderer(
  (_value, record) => record.name || '',
  (_value, record) => record.lineItemId || '',
  true,
);

// Marketer name/id renderer (no badge)
export const marketerNameIdRenderer = createNameIdRenderer(
  (_value, record) => _value || record.marketer || '',
  (_value, record) => record.tenantCode || '',
);
