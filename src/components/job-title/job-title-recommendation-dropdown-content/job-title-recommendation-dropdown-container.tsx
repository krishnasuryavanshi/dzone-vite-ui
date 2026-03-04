import { DzBox } from '@/components/layout/v1';
import React, { FC, PropsWithChildren } from 'react';

interface IJobTitleRecommendationDropdownContainerProps extends PropsWithChildren {}

export const JobTitleRecommendationDropdownContainer: FC<
  IJobTitleRecommendationDropdownContainerProps
> = ({ children }) => {
  return (
    <DzBox
      style={{
        padding: '0.5rem 1rem',
        background: '#fff',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
        borderRadius: '8px',
        width: '20rem',
      }}
    >
      {children}
    </DzBox>
  );
};
