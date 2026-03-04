import React, { FC } from 'react';
import { DzIcon } from '../shared';

interface IDigitalzoneProps {
  variant: 'small' | 'large' | 'applogo';
  color?: string;
}

export const Digitalzone: FC<IDigitalzoneProps> = ({ variant = 'small', color }) => {
  let src = '/images/brands/digitalzone-small.svg';
  if (variant === 'large') {
    src = '/images/brands/digitalzone-full.svg';
    if (color === 'white') {
      src = '/images/brands/digitalzone-full-white.svg';
    } else if (color === 'blue') {
      src = '/images/brands/digitalzone-full-blue.svg';
    }
  }

  if (variant === 'applogo') {
    src = '/images/brands/dz-one-logo.svg';
  }
  return <DzIcon src={src} />;
};
