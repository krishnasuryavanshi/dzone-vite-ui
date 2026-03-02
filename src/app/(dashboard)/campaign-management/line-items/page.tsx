import React from 'react';
import { LineItemsContainer } from './components';
import { LineItemContextProvider } from './contexts';

const LineItemsPage = () => {
  return (
    <LineItemContextProvider>
      <LineItemsContainer />
    </LineItemContextProvider>
  );
};

export default LineItemsPage;
