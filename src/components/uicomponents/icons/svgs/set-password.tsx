import { DzIcon } from '@/components/shared';
import React, { FC } from 'react';

type ISetPasswordProps = Record<string, never>;

export const SetPasswordIcon: FC<ISetPasswordProps> = () => {
  return <DzIcon src='/icons/set-password.svg' />;
};
