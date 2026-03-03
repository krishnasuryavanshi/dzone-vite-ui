import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import React, { FC } from 'react';
import { CreateUserHeader } from './create-user-header';
import { UserForm } from './user-form';

interface IUsersCreateContainerProps {}

export const UsersCreateContainer: FC<IUsersCreateContainerProps> = ({}) => {
  return (
    <DzBox className='dz-page-content'>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <CreateUserHeader />
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <UserForm />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
