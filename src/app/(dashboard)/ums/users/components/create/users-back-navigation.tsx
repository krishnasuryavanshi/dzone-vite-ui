import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import React, { FC } from 'react';
import { ArrowLeft } from '@/uicomponents/icons/svgs';
import { DZONE_CLR_GRAY_DARK } from '@/lib/constants';
import Link from 'next/link';

interface IUsersBackNavigationProps {
  isEditing?: boolean;
}

export const UsersBackNavigation: FC<IUsersBackNavigationProps> = ({
  isEditing,
}) => {
  return (
    <Flex gap={'0.5rem'}>
      <Link href='/ums/users'>
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
        <Text strong>{isEditing ? 'Edit Details' : 'Invite New User'}</Text>
      </DzBox>
    </Flex>
  );
};
