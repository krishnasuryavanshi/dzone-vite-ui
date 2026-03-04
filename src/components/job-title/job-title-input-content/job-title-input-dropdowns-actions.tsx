import React, { FC } from 'react';
import { Button } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';

interface JobTitleInputDropdownActionsProps {
  handleCloseDropdown: () => void;
  clearAll: () => void;
}

export const JobTitleInputDropdownActions: FC<JobTitleInputDropdownActionsProps> = ({
  handleCloseDropdown,
  clearAll,
}) => {
  return (
    <Flex gap={'0.5rem'} style={{ alignSelf: 'flex-end' }}>
      <Button
        type='default'
        size='small'
        style={{ fontSize: '0.75rem' }}
        onClick={handleCloseDropdown}
      >
        Close
      </Button>
      <Button
        type='text'
        style={{ color: 'red', fontSize: '0.75rem' }}
        size='small'
        onClick={clearAll}
      >
        Clear All
      </Button>
    </Flex>
  );
};
