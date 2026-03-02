import React, { FC } from 'react';
import { IUser } from '../lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import { DzBox } from '@/components/layout/v1';

interface IUserNameProps {
  record: IUser;
}

export const UserName: FC<IUserNameProps> = ({ record }) => {
  return (
    <Flex vertical style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      <DzBox>
        <Text strong>{`${record?.firstName} ${record?.lastName}`}</Text>
      </DzBox>
      <DzBox>
        <Text>{record?.email}</Text>
      </DzBox>
    </Flex>
  );
};
