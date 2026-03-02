import React from 'react';
import Image from 'next/image';

export const ThreeDotsActionsIcon = () => {
  return (
    <Image
      src='/icons/three-dots-actions.png'
      alt='Actions'
      width={20}
      height={20}
      style={{ display: 'block' }}
    />
  );
};
