import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Space } from '@/uicomponents/layout';
import { Tabs } from '@/uicomponents/tabs';
import { FC, memo, useEffect, useState } from 'react';
import { IRoleDetails } from '../../../lib/types';
import { useModulesStore } from '../../../stores';
import { Actions } from '../actions';

interface IModuleTabsProps {
  roleDetails: IRoleDetails;
}

export const ModuleTabs: FC<IModuleTabsProps> = memo(({ roleDetails }) => {
  const { modules, selectedModule, setSelectedModule, setSelectedModuleId } = useModulesStore();
  const [items, setItems] = useState<any[]>([]);

  const handleTabClick = (tab: string) => {
    setSelectedModule(tab);
    setSelectedModuleId(modules?.[tab]?.id as string);
  };

  useEffect(() => {
    if (modules) {
      const firstModule = Object.keys(modules)[0];
      setSelectedModule(firstModule);
      setSelectedModuleId(modules[firstModule].id);
      setItems(
        Object.values(modules).map((roleModule) => ({
          key: roleModule.name,
          label: (
            <Space style={{ color: DZONE_CLR_BLACK }}>
              <Translate i18nKey={roleModule.name} />
            </Space>
          ),
          children: <Actions roleDetails={roleDetails} />,
        })),
      );
    }
  }, [modules]);

  return (
    <Tabs
      className='role-modules-tabs'
      tabPosition='left'
      activeKey={selectedModule ?? undefined}
      onChange={handleTabClick}
      items={items}
      destroyInactiveTabPane={true}
    />
  );
});

ModuleTabs.displayName = 'ModulesTabs';
