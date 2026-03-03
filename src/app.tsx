import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router';
import { ThemeProvider } from './components/providers/theme-provider';

export const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
