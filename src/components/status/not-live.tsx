import { FC } from 'react';
import { DzIcon } from '../shared';

interface INotLiveProps {}

export const NotLive: FC<INotLiveProps> = () => {
  const src = '/icons/not-live-red.svg';
  return <DzIcon src={src} />;
};
