import { FC } from 'react';
import { DzIcon } from '../shared';

interface ILiveProps {}

export const Live: FC<ILiveProps> = () => {
  const src = '/icons/live-blue.svg';
  return <DzIcon src={src} />;
};
