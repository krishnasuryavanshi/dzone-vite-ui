import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Result, Button, Collapse, Text } from '@/uicomponents';
import { logError } from '@/services/logger';
import styles from './error-fallback.module.css';

export const ErrorFallback = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    logError(error);
    if (error instanceof Error) {
      Sentry.captureException(error);
    }
  }, [error]);

  if (isRouteErrorResponse(error)) {
    return (
      <Result
        status={error.status === 404 ? '404' : '500'}
        title={error.status === 404 ? 'Page Not Found' : `Error ${error.status}`}
        subTitle={
          error.status === 404
            ? "The page you're looking for doesn't exist."
            : error.statusText || 'An unexpected error occurred.'
        }
        extra={
          <Button type='primary' onClick={() => navigate('/')}>
            Go Home
          </Button>
        }
      />
    );
  }

  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <Result
      status='500'
      title='Something went wrong'
      subTitle='An unexpected error occurred. Please try again.'
      extra={[
        <Button key='home' type='primary' onClick={() => navigate('/')}>
          Go Home
        </Button>,
        <Button key='retry' onClick={() => window.location.reload()}>
          Try Again
        </Button>,
      ]}
    >
      <Collapse
        ghost
        items={[
          {
            key: 'details',
            label: <Text type='secondary'>Technical Details</Text>,
            children: (
              <>
                <Text strong>{errorMessage}</Text>
                {errorStack && <pre className={styles.stackTrace}>{errorStack}</pre>}
              </>
            ),
          },
        ]}
      />
    </Result>
  );
};
