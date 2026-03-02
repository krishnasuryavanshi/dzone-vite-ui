'use client';
import { useAllowedResources } from '@/lib/hooks';
import { Menu } from '@/uicomponents/menu';
import { useResource } from '@refinedev/core';
import { FC, useEffect, useState } from 'react';

import { customResources } from '@/config/resources';
import { getResourceName } from '@/lib/utils/get-resource-name';
import { usePathname } from 'next/navigation';
import { MenuLink } from './menu-link';
import './navigation-menu.scss';

interface INavigationMenuProps {
  isCollapsed: boolean;
}

export const NavigationMenu: FC<INavigationMenuProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const { resources } = useAllowedResources();
  const { resource, select } = useResource();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    let selectedResource = null;
    if (!resource) {
      const resourceName = getResourceName(pathname, customResources);
      const res = select(resourceName as string);
      selectedResource = res?.resource;
    } else {
      selectedResource = resource;
    }
    setOpenKeys(
      selectedResource?.meta?.parent && !isCollapsed
        ? [selectedResource?.meta?.parent]
        : [],
    );
    setSelectedKeys([selectedResource?.name]);
  }, [resource]);

  if (!resources?.length) return null;

  const handleOnTitleClick = (openedKeys: any[]) => {
    setOpenKeys(Array.isArray(openedKeys) ? openedKeys : []);
  };

  const getChildren = (parent: string) => {
    return resources
      .filter(({ meta }) => meta?.parent === parent)
      .map((menu) => {
        return createMenu(menu);
      });
  };

  const createMenu = (menu: any) => {
    const newMenu: any = {
      key: menu.name,
      label: (
        <MenuLink
          link={menu?.list as string}
          label={menu?.meta?.label as string}
        />
      ),
      icon: <span>{menu?.meta?.icon}</span>,
    };
    const children = getChildren(menu.name);
    if (children.length > 0) {
      newMenu.children = children;
    }
    return newMenu;
  };

  const items = resources
    .filter(({ meta }) => !meta?.hide)
    .filter(({ meta }) => !meta?.parent)
    .map((menu) => {
      return createMenu(menu);
    });

  return (
    <Menu
      className='dz-sider-menu-navigation'
      mode='inline'
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOnTitleClick}
      items={items}
    />
  );
};
