import { useAllowedResources } from '@/lib/hooks';
import { Menu } from '@/uicomponents/menu';
import { FC, useEffect, useState } from 'react';

import { customResources, resources as allResources } from '@/config/resources';
import { getResourceName } from '@/lib/utils/get-resource-name';
import { usePathname } from '@/lib/hooks/use-router';
import { MenuLink } from './menu-link';
import './navigation-menu.scss';

interface INavigationMenuProps {
  isCollapsed: boolean;
}

export const NavigationMenu: FC<INavigationMenuProps> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const { resources } = useAllowedResources();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const resourceName = getResourceName(pathname, customResources);
    const selectedResource = allResources.find((r) => r.name === resourceName);
    setOpenKeys(
      selectedResource?.meta?.parent && !isCollapsed
        ? [selectedResource?.meta?.parent]
        : [],
    );
    setSelectedKeys(selectedResource ? [selectedResource.name] : []);
  }, [pathname, isCollapsed]);

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
