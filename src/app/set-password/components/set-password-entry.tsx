'use client';
import { Digitalzone } from '@/components/brands';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, PropsWithChildren } from 'react';

interface ISetPasswordEntryProps extends PropsWithChildren {}

export const SetPasswordEntry: FC<ISetPasswordEntryProps> = ({ children }) => {
  return (
    <DzBox
      className='dz-page-content'
      style={{
        height: '100vh',
        width: '100vw',
        paddingTop: '0',
        background: '#EAF1FF',
      }}>
      <DzBox
        className='dz-page-content'
        style={{ borderRadius: '0.75rem', background: '#fff' }}>
        <Flex vertical gap={'1rem'}>
          <DzBox
            style={{
              paddingTop: '2.5rem',
              paddingLeft: '2rem',
              height: '6.25rem',
            }}>
            <Digitalzone variant='large' color='blue' />
          </DzBox>
          <DzBox style={{ paddingTop: '9rem' }}>{children}</DzBox>
        </Flex>
      </DzBox>
    </DzBox>
  );
};
