import React from 'react';
import { Spin } from 'antd';
import { Flex } from '@/uicomponents/layout';

export const PageLoadingFallback = () => {
  return (
    <Flex justify="center" align="center" style={{ height: '100%', minHeight: '20rem' }}>
      <Spin size="large" />
    </Flex>
  );
};
