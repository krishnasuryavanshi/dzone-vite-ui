import { DzIcon } from '@/components/shared';
import React, { FC } from 'react';

type IEditIConProps = Record<string, never>;

export const EditICon: FC<IEditIConProps> = () => {
  return <DzIcon src='/icons/edit-icon.svg' />;
};
