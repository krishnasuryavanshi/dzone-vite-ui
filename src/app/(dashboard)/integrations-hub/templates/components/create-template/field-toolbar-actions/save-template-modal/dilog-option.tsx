import { DzBox } from '@/components/layout/v1';
import React, { CSSProperties, FC, ReactNode } from 'react';
import { DilogRadioIcon } from './dilog-radio-icon';
import { Flex } from '@/uicomponents/layout';

import './dilog-option.scss';

interface IDilogOptionProps {
  isActive: boolean;
  children: ReactNode;
}

export const DilogOption: FC<IDilogOptionProps> = ({ children, isActive }) => {
  return (
    <DzBox className={`dilog-option ${isActive ? 'active' : ''}`}>
      <Flex align='flex-start' gap={'0.5rem'}>
        <DilogRadioIcon />
        {children}
      </Flex>
    </DzBox>
  );
};
