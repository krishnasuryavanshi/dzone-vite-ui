import { DzBox } from '@/components/layout/v1';
import Image from 'next/image';
import styles from './empty-history.module.css';

export const EmptyHistory = () => (
  <DzBox className={styles.emptyHistoryContainer}>
    <Image
      src='/images/empty-history.png'
      alt='No chat history illustration'
      width={250}
      height={250}
      priority
    />
    <DzBox className={styles.emptyHistoryText}>
      Your chat history will appear
      <br />
      here once you begin interacting
      <br />
      with DZ One
    </DzBox>
  </DzBox>
);
