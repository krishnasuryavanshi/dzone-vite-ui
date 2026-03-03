
import { FC, useMemo } from 'react';
import { Modal } from '@/uicomponents/modal';
import { Text, Title } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { ReadonlyPacingTable } from './readonly-pacing-table';
import styles from './pacing-period-diff-modal.module.css';
import { PacingType } from '@/app/(dashboard)/campaign-management/line-items/lib/enums';

interface PacingPeriodDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousValue: any;
  newValue: any;
}

export const PacingPeriodDiffModal: FC<PacingPeriodDiffModalProps> = ({
  isOpen,
  onClose,
  previousValue,
  newValue,
}) => {
  // Determine pacing schedule type from data
  const pacingSchedule = useMemo(() => {
    if (previousValue?.[0]?.schedules?.length > 0) {
      return PacingType.CUSTOM_PACING; // Or extract from data if available
    }
    return 'Daily';
  }, [previousValue]);

  const calculateTotalLeads = (data: any) => {
    if (!data) return 0;
    return data.reduce(
      (sum: number, period: any) => sum + (period.LeadsCount || 0),
      0,
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title='Pacing Period Changes'
      footer={null}
      width={1400}
      className={styles.modal}>
      <Flex gap={24} className={styles.container}>
        <Flex vertical className={styles.section}>
          <Title level={5} className={styles.sectionTitle}>
            Previous Value
          </Title>
          <Text type='secondary' className={styles.totalLeads}>
            Total Leads: {calculateTotalLeads(previousValue)}
          </Text>
          {previousValue && previousValue.length > 0 ? (
            <ReadonlyPacingTable
              data={previousValue}
              pacingSchedule={pacingSchedule}
            />
          ) : (
            <Text type='secondary' className={styles.emptyState}>
              No data available
            </Text>
          )}
        </Flex>

        <Flex vertical className={styles.section}>
          <Title level={5} className={styles.sectionTitle}>
            New Value
          </Title>
          <Text type='secondary' className={styles.totalLeads}>
            Total Leads: {calculateTotalLeads(newValue)}
          </Text>
          {newValue && newValue.length > 0 ? (
            <ReadonlyPacingTable
              data={newValue}
              pacingSchedule={pacingSchedule}
            />
          ) : (
            <Text type='secondary' className={styles.emptyState}>
              No data available
            </Text>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};
