import React, { useEffect } from 'react';
import { DzentContainer, DZentContainerProps } from './dzent-container';
import { useDzentStore } from '../store';
import { useUnsavedDataStore } from '@/stores/unsaved-data-store';

export const DzentContainerHost = ({ action }: DZentContainerProps) => {
  const { resetAll } = useDzentStore();
  const clear = useUnsavedDataStore((s) => s.clear);
  const [isReady, setReady] = React.useState(false);

  useEffect(() => {
    if (!isReady && resetAll) {
      resetAll();
      setReady(true);
      clear();
    }
  }, []);

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
