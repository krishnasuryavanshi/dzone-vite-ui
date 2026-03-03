
import { FC, ReactNode } from 'react';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Title } from '@/uicomponents/title';
import styles from './summary.module.css';

interface ISummaryCardProps {
  title: string;
  value: string | number | ReactNode;
  valueColor?: string;
}

export const SummaryCard: FC<ISummaryCardProps> = ({
  title,
  value,
  valueColor,
}) => {
  return (
    <Flex
      vertical
      align='center'
      justify='center'
      gap='0.5rem'
      className={styles.card}>
      <Title
        level={4}
        className={styles.cardValue}
        style={{ color: valueColor || 'var(--dzone-color-black)' }}>
        {value}
      </Title>
      <Text className={styles.cardTitle}>{title}</Text>
    </Flex>
  );
};
