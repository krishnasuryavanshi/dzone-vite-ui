import { DzBox } from '@/components/layout/v1';
import { LeftOutlined, RightOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { FC } from 'react';

interface INavigationProps {
  totalLeads: number;
  currentLeadNumber: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export const Navigation: FC<INavigationProps> = ({
  totalLeads,
  currentLeadNumber,
  handleNext,
  handlePrev,
}) => {
  return (
    <DzBox
      style={{
        border: '2px solid #3D71FB',
        borderRadius: '8px',
        padding: '0.125rem 0.25rem',
        width: 'fit-content',
        marginBottom: '1rem',
      }}
    >
      <Flex gap={'0.25rem'} align={'center'}>
        <Text style={{ fontSize: '0.75rem' }}>
          Lead {currentLeadNumber} of {totalLeads}
        </Text>
        <LeftOutlined
          disabled={currentLeadNumber === 1}
          onClick={() => {
            currentLeadNumber > 1 && handlePrev();
          }}
          style={{
            strokeWidth: '100',
            stroke: '#000',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        />
        <RightOutlined
          disabled={currentLeadNumber === totalLeads}
          onClick={() => {
            currentLeadNumber < totalLeads && handleNext();
          }}
          style={{
            strokeWidth: '100',
            stroke: '#000',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        />
      </Flex>
    </DzBox>
  );
};
