'use client';
import React, { FC, useEffect, useState } from 'react';
import { IUser } from '../../lib/types';
import { fetchUser } from '../../services';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { CreateUserHeader } from './create-user-header';
import { UserForm } from './user-form';

interface IUsersEditContainerProps {
  userId: string;
}

export const UsersEditContainer: FC<IUsersEditContainerProps> = ({
  userId,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      setUser(null);
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await fetchUser(userId);
      setUser(data);
    } catch (error) {}
  };

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
