import { Text } from '@/uicomponents';
import styles from './integrations-list.module.css';
import { DzBox } from '@/components/layout/v1';

interface HubSpotIntegrationDetailsProps {
  name: string;
  label?: string;
  connectionType?: string;
}

export const HubSpotIntegrationDetails: React.FC<HubSpotIntegrationDetailsProps> = ({
  name,
  label,
  connectionType,
}) => {
  return (
    <DzBox className={styles.detailsLeft}>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Name:</Text>
        <Text className={styles.detailValue}>{name}</Text>
      </DzBox>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Label:</Text>
        <Text className={styles.detailValue}>{label || '{Production}'}</Text>
      </DzBox>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Type:</Text>
        <Text className={styles.detailValue}>{connectionType || 'API Key'}</Text>
      </DzBox>
    </DzBox>
  );
};
