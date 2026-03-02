'use client';

import { Title } from '@/uicomponents';
import React, { FC, PropsWithChildren } from 'react';

export const FormTitle: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Title
      style={{
        color: '#fff',
        fontSize: '2.5rem',
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: '0.5rem',
      }}>
      {children}
    </Title>
  );
};

export default FormTitle;
