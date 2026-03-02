import React, { FC } from 'react';
import { DzIcon } from '../shared';

interface ICheckProps {}

export const Check: FC<ICheckProps> = ({}) => {
  const src = '/icons/check-green.svg';
  return <DzIcon src={src} />;
};
