import React from 'react';
import { MarketersContainer } from './components/marketers-container';
import { DzBox } from '@/components/layout/v1';

const MarketersPage = () => {
  return (
    <DzBox style={{ height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
      <MarketersContainer />
    </DzBox>
  );
};

export default MarketersPage;
