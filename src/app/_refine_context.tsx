'use client';

import { I18nProvider, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { SessionProvider, useSession } from 'next-auth/react';
import React from 'react';

import routerProvider from '@refinedev/nextjs-router';

import { ColorModeContextProvider } from '@/contexts/color-mode';
import { authProvider, dataProvider } from '@/providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Welcome } from '@/components/shared';
import { AuthStatus } from '@/lib/enums';
import { useAllowedResources } from '@/lib/hooks';
// import '@refinedev/antd/dist/reset.css'; // Not needed in Vite app
import { useTranslation } from 'react-i18next';
import '../global.scss';
import './i18n';
import { UnsavedDataWarningContextProvider } from '../contexts';

type RefineContextProps = {
  defaultMode?: string;
};

type AppProps = {
  defaultMode?: string;
};

const App = (props: React.PropsWithChildren<AppProps>) => {
  const defaultMode = props?.defaultMode;

  const { t, i18n } = useTranslation();
  const i18nProvider: I18nProvider = {
    translate: (key: string, options?: any) => t(key, options) as string,
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const { status } = useSession();
  const { resources } = useAllowedResources();

  if (status === AuthStatus.Loading) {
    return <Welcome />;
  }

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <UnsavedDataWarningContextProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              // notificationProvider={useNotificationProvider} // all the notification handled manually
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true, // Doesn't work with App router
                useNewQueryKeys: true,
              }}>
              {props.children}
              <RefineKbar />
            </Refine>
          </UnsavedDataWarningContextProvider>
        </ColorModeContextProvider>
      </AntdRegistry>
    </RefineKbarProvider>
  );
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>,
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};
