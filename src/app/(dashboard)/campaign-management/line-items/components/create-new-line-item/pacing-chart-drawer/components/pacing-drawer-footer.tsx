import React from 'react';
import { Button, Text } from '@/components/uicomponents';
import { Flex } from '@/components/uicomponents/layout/flex';
import { Hideable } from '@/components/shared';
import type { Dayjs } from 'dayjs';
import { Space } from '@/uicomponents/layout';
import { LeadCountWarning } from '../lead-count-warning';

interface PacingDrawerFooterProps {
  currentTotal: number;
  targetLeadGoal: number;
  lineItemId?: string;
  onClose: () => void;
  handleSave: () => void;
  handleAutoAdjust: () => void;
  dateRange: [Dayjs, Dayjs] | null;
  isParentLeadRequiredError?: boolean;
  isChildLeadRequiredError?: boolean;
  pacingSchedule?: string;
}

export const PacingDrawerFooter: React.FC<PacingDrawerFooterProps> = ({
  currentTotal,
  targetLeadGoal,
  lineItemId,
  onClose,
  handleSave,
  handleAutoAdjust,
  dateRange,
  isParentLeadRequiredError = false,
  isChildLeadRequiredError = false,
  pacingSchedule,
}) => {
  // Use the explicit error flags and pacing type
  // For Daily pacing: Always show warning when there's a parent error (since there are no child tables)
  // For Non-Daily pacing: Show warning only when there's a parent error and no child error (to avoid duplicates)
  const isDailyPacing = pacingSchedule === 'Daily';
  const showParentWarning = isDailyPacing
    ? isParentLeadRequiredError // For Daily, always show parent error
    : isParentLeadRequiredError && !isChildLeadRequiredError; // For others, avoid duplicates

  // Disable save button if there's a parent error
  // For non-Daily pacing, child errors alone don't prevent saving
  const disableSaveButton = isParentLeadRequiredError;

  return (
    <Flex vertical gap='small'>
      <Flex justify='space-between' align='center'>
        <Flex vertical>
          <Space>
            <Text type='secondary'>Lead Goal</Text>
            <Text strong style={{ fontSize: '1.125rem' }}>
              {currentTotal}/{targetLeadGoal}
            </Text>
          </Space>
          <Hideable show={!!showParentWarning}>
            <LeadCountWarning
              targetLeadGoal={targetLeadGoal}
              currentTotal={currentTotal}
              onAutoAdjust={handleAutoAdjust}
              isChildTable={false}
              pacingSchedule={pacingSchedule}
            />
          </Hideable>
        </Flex>
        <Hideable show={!!lineItemId}>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type='primary'
              onClick={handleSave}
              disabled={!dateRange || !!disableSaveButton}
              title={
                disableSaveButton ? 'Please resolve the lead count mismatch before saving' : ''
              }
            >
              Save
            </Button>
          </Space>
        </Hideable>
      </Flex>
    </Flex>
  );
};
