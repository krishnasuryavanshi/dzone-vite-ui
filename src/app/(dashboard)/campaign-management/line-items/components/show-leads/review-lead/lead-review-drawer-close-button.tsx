import { DzBox } from '@/components/layout/v1';
import { LeftOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';

interface ILeadReviewDrawerCloseButtonProps {}

export const LeadReviewDrawerCloseButton: FC<
  ILeadReviewDrawerCloseButtonProps
> = ({}) => {
  return (
    <Flex
      align='center'
      justify='center'
      style={{
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#EFF4FD',
        padding: '0.5rem',
      }}>
      <LeftOutlined
        style={{
          fontSize: '0.75rem',
          cursor: 'pointer',
          stroke: '#000',
          strokeWidth: '50',
        }}
      />
    </Flex>
  );
};
