import { DzBox } from '@/components/layout/v1';
import React, { FC } from 'react';

interface IDilogRadioIconProps {}

export const DilogRadioIcon: FC<IDilogRadioIconProps> = ({}) => {
  return (
    <DzBox className='dilog-radio-icon'>
      <DzBox className='dilog-radio-icon-inner'>
        <span></span>
      </DzBox>
    </DzBox>
  );
};
