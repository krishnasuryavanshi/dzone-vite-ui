import React from 'react';
import { useParams } from 'react-router';
import { UsersEditContainer } from '../components/create';

const EditUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  return (
    <>
      <title>User Details | DZ One</title>
      <UsersEditContainer userId={userId!} />
    </>
  );
};

export default EditUserPage;
