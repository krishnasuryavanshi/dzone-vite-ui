import React, { FC } from 'react';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { CreateUserHeader } from './create-user-header';
import { UserForm } from './user-form';
import { useUserDetailQuery } from '../../hooks';

interface IUsersEditContainerProps {
  userId: string;
}

export const UsersEditContainer: FC<IUsersEditContainerProps> = ({
  userId,
}) => {
  const { data } = useUserDetailQuery(userId, !!userId);
  const user = data?.data ?? null;

  if (!user) {
    return null;
  }

  return (
    <DzBox className='dz-page-content'>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <CreateUserHeader isEditing />
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <UserForm isEditing user={user} />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
