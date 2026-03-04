import React from 'react';
import { Flex, Layout } from '@/uicomponents/layout';
import { theme } from 'antd';

const { Header: Heading } = Layout;

export const HeaderPanel = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  return (
    <Heading
      style={{
        padding: '0 1rem',
        paddingLeft: '0.5rem',
        borderRadius: borderRadius,
        boxShadow: '4px 4px 10px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <Flex justify='flex-end'>{children}</Flex>
    </Heading>
  );
};
