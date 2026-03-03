import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_GRAY_DARK } from '@/lib/constants';
import { ArrowLeft } from '@/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Link } from 'react-router-dom';
import React, { FC } from 'react';

interface IBackNavigationProps {
  isEditing?: boolean;
}

export const BackNavigation: FC<IBackNavigationProps> = ({ isEditing }) => {
  return (
    <Flex gap={'0.5rem'}>
      <Link to='/organizations'>
        <Flex
          align='center'
          justify='center'
          style={{
            borderRadius: '17px',
            background: DZONE_CLR_GRAY_DARK,
            height: '1.5rem',
            width: '1.5rem',
            cursor: 'pointer',
            paddingTop: '0.25rem',
          }}>
          <ArrowLeft />
        </Flex>
      </Link>
      <DzBox>
        <Text strong>
          {isEditing ? 'Edit Details' : 'Create New Organization'}
        </Text>
      </DzBox>
    </Flex>
  );
};
