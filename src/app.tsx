import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { ColorModeContextProvider } from './contexts/color-mode';

export const App = () => {
  return (
    <ColorModeContextProvider defaultMode="light">
      <RouterProvider router={router} />
    </ColorModeContextProvider>
  );
};
