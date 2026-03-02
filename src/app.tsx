import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { router } from './router';
import { ColorModeContextProvider } from './contexts/color-mode';
import { UnsavedDataWarningContextProvider } from './contexts';
import { Welcome } from './components/shared';

export const App = () => {
  return (
    <ColorModeContextProvider defaultMode="light">
      <UnsavedDataWarningContextProvider>
        <Suspense fallback={<Welcome />}>
          <RouterProvider router={router} />
        </Suspense>
      </UnsavedDataWarningContextProvider>
    </ColorModeContextProvider>
  );
};
