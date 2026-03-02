import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Flex } from '@/uicomponents/layout';
import { Progress } from '@/uicomponents/progress';
import { Text } from '@/uicomponents/text';
import React from 'react';
import {
  DZENT_BG_LIGHT_BLUE,
  DZENT_TEXT_MUTED,
} from '@/lib/constants/color-constants';

type SummaryProgressProps = {
  progress?: number;
};

export const SummaryProgress = ({ progress = 0 }: SummaryProgressProps) => {
  return (
    <DzBox
      style={{
        backgroundColor: DZENT_BG_LIGHT_BLUE,
        borderRadius: '8px',
        paddingBlock: '0.5rem 0.875rem',
        paddingInline: '0.875rem',
      }}>
      <Flex justify='space-between' align='center'>
        <Text style={{ fontWeight: 500, color: DZENT_TEXT_MUTED }}>
          Summary Progress
        </Text>
        <Text strong style={{ color: DZONE_CLR_BLACK }}>
          {progress}%
        </Text>
      </Flex>
      <Progress
        className='chat-summary-progress'
        percent={progress}
        showInfo={false}
      />
    </DzBox>
  );
};
