import { useAllowedResources } from '@/lib/hooks';
import { Menu } from '@/uicomponents/menu';
import { FC, useEffect, useMemo, useState } from 'react';

import { customResources, resources as allResources } from '@/config/resources';
import { getResourceName } from '@/lib/utils/get-resource-name';
import { useLocation, Link } from 'react-router';
import { Translate } from '@/components/i18n';
import './navigation-menu.scss';

interface INavigationMenuProps {
  isCollapsed: boolean;
}

export const NavigationMenu: FC<INavigationMenuProps> = ({ isCollapsed }) => {
  const { pathname } = useLocation();
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

  const items = useMemo(() => {
    if (!resources?.length) return [];

    const getChildren = (parent: string) => {
      return resources
        .filter(({ meta }) => meta?.parent === parent)
        .map((menu) => createMenu(menu));
    };

    const createMenu = (menu: any) => {
      const label = menu?.list ? (
        <Link to={menu.list as string}>
          <Translate i18nKey={menu?.meta?.label as string} />
        </Link>
      ) : (
        <Translate i18nKey={menu?.meta?.label as string} />
      );

      const newMenu: any = {
        key: menu.name,
        label,
        icon: <span>{menu?.meta?.icon}</span>,
      };
      const children = getChildren(menu.name);
      if (children.length > 0) {
        newMenu.children = children;
      }
      return newMenu;
    };

    return resources
      .filter(({ meta }) => !meta?.hide)
      .filter(({ meta }) => !meta?.parent)
      .map((menu) => createMenu(menu));
  }, [resources]);

  if (!items.length) return null;

  return (
    <Menu
      className='dz-sider-menu-navigation'
      mode='inline'
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={(keys) => setOpenKeys(Array.isArray(keys) ? keys : [])}
      items={items}
    />
  );
};
