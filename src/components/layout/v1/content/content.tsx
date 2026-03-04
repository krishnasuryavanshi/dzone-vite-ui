import React, { Suspense, FC, PropsWithChildren } from 'react';

import './content.scss';
import { ContentPanel } from './content-panel';
import { PageLoadingFallback } from './page-loading-fallback';

interface IContentProps extends PropsWithChildren {}

export const Content: FC<IContentProps> = ({ children }) => {
  return (
    <ContentPanel>
      <Suspense fallback={<PageLoadingFallback />}>{children}</Suspense>
    </ContentPanel>
  );
};
