'use client';
import React, { useContext, useEffect } from 'react';
import { DzentContainer, DZentContainerProps } from './dzent-container';
import { useDzentStore } from '../store';
import { UnsavedDataWarningContext } from '@/contexts/unsaved-data-warning';

export const DzentContainerHost = ({ action }: DZentContainerProps) => {
  const { resetAll } = useDzentStore();
  const { clear } = useContext(UnsavedDataWarningContext);
  const [isReady, setReady] = React.useState(false);

  useEffect(() => {
    if (!isReady && resetAll) {
      resetAll();
      setReady(true);
      clear();
    }
  }, [resetAll]);

  // while destroying host component, reset the store and clear unsaved data context
  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  if (!isReady) {
    return null;
  }
  return <DzentContainer action={action} />;
};
