import React from 'react';
import './screen-loader.scss';
import { Spin } from '@/uicomponents';

export const ScreenLoader: React.FC = () => {
  return (
    <div className='loader-overlay'>
      <div className='loader'>
        <Spin />
      </div>
    </div>
  );
};
