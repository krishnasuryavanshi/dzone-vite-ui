import { CLR_WHITE, DZONE_CLR_BLACK, DZONE_CLR_GRAY_4 } from '@/lib/constants';
import { LeftOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';

interface IDrawerCloseButtonProps {}

export const DrawerCloseButton: FC<IDrawerCloseButtonProps> = ({}) => {
  return (
    <Flex
      align='center'
      justify='center'
      style={{
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: DZONE_CLR_BLACK,
        padding: '0.5rem',
      }}>
      <LeftOutlined
        style={{
          fontSize: '0.75rem',
          cursor: 'pointer',
          stroke: `${CLR_WHITE}`,
          strokeWidth: '50',
        }}
      />
    </Flex>
  );
};
