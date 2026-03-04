import React from 'react';
import { Result, Button, Collapse, Text } from '@/uicomponents';

export const ErrorContainer = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <Result
      status='error'
      title='Something went wrong'
      subTitle='An unexpected error occurred. Please try again.'
      extra={
        <Button type='primary' onClick={reset}>
          Try Again
        </Button>
      }
    >
      <Collapse
        ghost
        items={[
          {
            key: 'details',
            label: <Text type='secondary'>Technical Details</Text>,
            children: <Text strong>{error.message}</Text>,
          },
        ]}
      />
    </Result>
  );
};
