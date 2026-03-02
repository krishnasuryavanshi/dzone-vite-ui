import { DzIcon, IDzIconProps } from '@/components/shared';
import React, { FC } from 'react';

interface IArrowLeftProps extends Partial<IDzIconProps> {}

export const ArrowLeft: FC<IArrowLeftProps> = ({ ...props }) => {
  return <DzIcon src='/icons/arrow-left.svg' {...props} />;
};
