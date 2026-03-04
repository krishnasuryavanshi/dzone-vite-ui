import { DzBox } from '@/components/layout/v1';
import React from 'react';
import { Filters } from './filters';
import { UsersList } from './users-list';

export const UsersListContainer = () => {
  return (
    <DzBox>
      <Filters />
      <UsersList />
    </DzBox>
  );
};
