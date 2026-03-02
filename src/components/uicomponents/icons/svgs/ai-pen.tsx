import { DzIcon, IDzIconProps } from '@/components/shared';
import React, { FC } from 'react';

interface IAiPenProps extends Partial<IDzIconProps> {}

export const AiPen: FC<IAiPenProps> = ({ ...props }) => {
  return <DzIcon src='/icons/ai-pen.svg' {...props} />;
};
