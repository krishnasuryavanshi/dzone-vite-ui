
import React from 'react';
import { Text } from '@/components/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Button } from '@/components/uicomponents';
import styles from '../pacing-chart-drawer.module.css';
import { CLR_BLUE_PRIMARY } from '@/lib/constants';
import { Pacing } from '../../../lib/enums';

interface LeadCountWarningProps {
  targetLeadGoal: number;
  currentTotal: number;
  onAutoAdjust?: () => void;
  isChildTable?: boolean;
  pacingSchedule?: string;
}

export const LeadCountWarning: React.FC<LeadCountWarningProps> = ({
  targetLeadGoal,
  currentTotal,
  onAutoAdjust,
  isChildTable = false,
  pacingSchedule,
}) => {
  const difference = Math.abs(currentTotal - targetLeadGoal);
  const isOver = currentTotal > targetLeadGoal;

  // Render content based on whether it's child table and over/under
  if (isChildTable) {
    // Determine the period text based on pacing schedule
    // For Weekly pacing, child rows are daily
    // For Monthly pacing, child rows are weekly
    const periodText =
      pacingSchedule === Pacing.WEEKLY
        ? 'weekly'
        : pacingSchedule === Pacing.MONTHLY
          ? 'monthly'
          : 'target';

    // For child tables
    if (isOver) {
      return (
        <Flex
          className={styles.childWarningSection}
          vertical={false}
          gap='small'
          align='center'>
          <Text type='danger' style={{ fontSize: '0.875rem' }}>
            Lead count exceeds the {periodText} lead required. Remove{' '}
            {difference} leads to meet the goal
          </Text>
        </Flex>
      );
    } else {
      // Child table, under target - no auto adjust button
      return (
        <Flex
          className={styles.childWarningSection}
          vertical={false}
          gap='small'
          align='center'>
          <Text style={{ fontSize: '0.875rem', color: '#C7535B' }}>
            Lead count is below the {periodText} target. Add {difference} more
            leads to meet the goal.
          </Text>
        </Flex>
      );
    }
  } else {
    // For main/parent tables
    if (isOver) {
      return (
        <Flex
          className={styles.warningSection}
          vertical={false}
          gap='small'
          align='center'>
          <Text style={{ fontSize: '0.875rem', color: '#C7535B' }}>
            Lead count is more than the target. Remove {difference} more leads
            to meet the goal or{' '}
            {onAutoAdjust && (
              <Button
                type='link'
                onClick={onAutoAdjust}
                style={{
                  padding: 0,
                  height: 'auto',
                  fontSize: '0.875rem',
                  display: 'inline',
                  color: '#727BE2',
                }}>
                Increase the lead goal to {currentTotal.toLocaleString()}
              </Button>
            )}
          </Text>
        </Flex>
      );
    } else {
      // Parent table, under target - no auto adjust button
      return (
        <Flex
          className={styles.warningSection}
          vertical={false}
          gap='small'
          align='center'>
          <Text type='danger' style={{ fontSize: '0.875rem' }}>
            Lead count is below the target. Add {difference} more leads to meet
            the goal.
          </Text>
        </Flex>
      );
    }
  }
};
