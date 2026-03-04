import { Text } from '@/uicomponents';
import styles from './integrations-list.module.css';
import { DzBox } from '@/components/layout/v1';

interface FtpIntegrationDetailsProps {
  name: string;
  type?: string;
}

export const FtpIntegrationDetails: React.FC<FtpIntegrationDetailsProps> = ({ name, type }) => {
  return (
    <DzBox className={styles.detailsLeft}>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Name:</Text>
        <Text className={styles.detailValue}>{name}</Text>
      </DzBox>
      <DzBox className={styles.detailItem}>
        <Text className={styles.detailLabel}>Type:</Text>
        <Text className={styles.detailValue}>{type || '-'}</Text>
      </DzBox>
    </DzBox>
  );
};
