import React, { useEffect } from 'react';
import { LineItemsContainer } from './components';
import { useLineItemContextStore } from './store/use-line-item-context-store';

const LineItemsPage = () => {
  const { fetchStatusData, reset } = useLineItemContextStore();

  useEffect(() => {
    fetchStatusData();
    return () => reset();
  }, []);

  return (
    <>
      <title>Line Items | DZ One</title>
      <LineItemsContainer />
    </>
  );
};

export default LineItemsPage;
