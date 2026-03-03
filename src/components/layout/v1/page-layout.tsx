import React, { PropsWithChildren } from 'react';

import { DzTheme } from './dz-theme';
import './page-layout.scss';
import { DzPageContainer } from './dz-page-container';

const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <DzTheme theme='blueV2'>
      <DzPageContainer>{children}</DzPageContainer>
    </DzTheme>
  );
};

export default PageLayout;
