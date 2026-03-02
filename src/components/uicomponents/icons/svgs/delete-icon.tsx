import { DzIcon } from '@/components/shared';
import React, { FC } from 'react';

type IDeleteIconProps = Record<string, never>;

export const DeleteIcon: FC<IDeleteIconProps> = () => {
  return <DzIcon src='/icons/delete.svg' />;
};
