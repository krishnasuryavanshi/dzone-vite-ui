import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { Trigger } from './trigger';
import { Digitalzone } from '../../../brands';
import { DzBox } from '../dz-box';

interface IAppLogoProps {
  onClick: () => void;
  showLogo?: boolean;
}

export const AppLogo: FC<IAppLogoProps> = ({ onClick, showLogo }) => {
  return (
    <Flex
      align='center'
      justify='flex-start'
      gap='1rem'
      style={{ height: '3.5rem', padding: '1rem' }}
    >
      <Trigger onClick={onClick} collapsed={!showLogo} />
      {showLogo ? (
        <DzBox style={{ height: '1.5rem' }}>
          <Digitalzone variant='applogo' />
        </DzBox>
      ) : null}
    </Flex>
  );
};
