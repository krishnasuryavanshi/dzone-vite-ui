import React from 'react';
import { useNavigate } from 'react-router';
import { Result, Button } from '@/uicomponents';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="Page Not Found"
      subTitle="The page you're looking for doesn't exist."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Go Home
        </Button>
      }
    />
  );
};
