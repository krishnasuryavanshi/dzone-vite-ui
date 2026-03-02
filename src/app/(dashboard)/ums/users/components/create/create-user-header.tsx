import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { UsersTitle } from '../users-title';
import { UsersBackNavigation } from './users-back-navigation';

interface ICreateUserHeaderProps {
  isEditing?: boolean;
}

export const CreateUserHeader: FC<ICreateUserHeaderProps> = ({ isEditing }) => {
  return (
    <Flex gap='0.75rem' vertical>
      <UsersTitle />
      <UsersBackNavigation isEditing={isEditing} />
    </Flex>
  );
};
