import React, { FC, useEffect, useState } from 'react';
import { NavigationMenu } from './navigation-menu';
import { AppLogo } from './app-logo';
import { CollapsedMobileTrigger } from './collapsed-mobile-trigger';
import { theme } from 'antd';
import { Layout } from '@/uicomponents/layout';

import './sider.scss';
import { DzBox } from '../dz-box';
import { Store } from '@/services';
import { StorageKey } from '@/lib/enums';

const { Sider: Sidebar } = Layout;

const siderWidth = '13.75rem';
const collapsedSiderWidth = '3.5rem';
const deviceBreakpoint = 'lg';

interface ISiderProps {
  handleBreakpoint: (broken: boolean) => void;
}

export const Sider: FC<ISiderProps> = ({ handleBreakpoint }) => {
  const isSiderCollapsed = Store.get(StorageKey.SiderCollapsed);
  const [collapsed, setCollapsed] = useState(!!isSiderCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [siderClass, setSiderClass] = useState('dz-sider');

  useEffect(() => {
    let classes = 'sider dz-sider';
    if (isMobile) {
      classes += ' dz-sider-mobile';
    } else {
      classes += ' dz-sider-desktop';
    }

    if (collapsed) {
      classes += ' dz-sider-collapsed';
    } else {
      classes += ' dz-sider-expanded';
    }
    Store.set(StorageKey.SiderCollapsed, collapsed);
    setSiderClass(classes);
  }, [isMobile, collapsed]);

  const {
    token: { borderRadius },
  } = theme.useToken();

  return (
    <>
      <CollapsedMobileTrigger
        onClick={() => setCollapsed(!collapsed)}
        isMobile={isMobile}
        collapsed={collapsed}
      />
      <Sidebar
        className={siderClass}
        style={{
          borderRadius: borderRadius,
          visibility: `${!isMobile || !collapsed ? 'visible' : 'hidden'}`,
        }}
        width={siderWidth}
        collapsedWidth={collapsedSiderWidth}
        breakpoint={deviceBreakpoint}
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={(broken) => {
          setIsMobile(broken);
          handleBreakpoint(broken);
        }}
      >
        <AppLogo onClick={() => setCollapsed(!collapsed)} showLogo={!collapsed} />
        <DzBox className='menu-wrapper'>
          <DzBox className='scrollable-menu-container'>
            <NavigationMenu isCollapsed={collapsed} />
          </DzBox>
        </DzBox>
      </Sidebar>
    </>
  );
};
