import { Layout } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { Trigger } from './trigger';

import './collapsed-mobile-trigger.scss';

interface ICollapsedMobileTriggerProps {
  onClick: () => void;
  isMobile: boolean;
  collapsed: boolean;
}

export const CollapsedMobileTrigger: FC<ICollapsedMobileTriggerProps> = ({
  onClick,
  isMobile,
  collapsed,
}) => {
  if (isMobile && collapsed) {
    return (
      <Layout className='collapsed-mobile-trigger-container'>
        <Trigger onClick={onClick} collapsed />
      </Layout>
    );
  } else {
    return null;
  }
};
