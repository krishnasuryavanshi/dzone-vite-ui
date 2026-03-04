import { Flex, Space } from '@/uicomponents/layout';
import { useModulesStore } from '../../../stores';
import { FC, memo, useEffect } from 'react';
import { Translate } from '@/components/i18n';
import './role-modules.scss';
import { CLR_GRAY_3 } from '@/lib/constants';
import { ModuleTabs } from './modules-tabs';
import { IRoleDetails } from '../../../lib/types';
import { useModulesQuery } from '../../../hooks';
import { IModule } from '../../../lib/types';
import { useDependanciesStore } from '../../../stores/use-dependancy-store';

interface IModulesContainerProps {
  roleDetails: IRoleDetails;
}

export const ModulesContainer: FC<IModulesContainerProps> = memo(({ roleDetails }) => {
  const { setModules } = useModulesStore();
  const { data } = useModulesQuery(true);

  useEffect(() => {
    if (!data?.data) return;

    const actionsDependacies: Record<string, string[]> = {};
    const modulesData = data.data.reduce(
      (acc: Record<string, IModule>, roleModule: IModule) => {
        roleModule?.actions.forEach((action) => {
          if (action.children?.length) {
            actionsDependacies[action.id] = action.children;
          }
        });
        acc[roleModule.name] = roleModule;
        return acc;
      },
      {} as Record<string, IModule>,
    );

    useDependanciesStore.getState().setDependantAction(actionsDependacies);
    setModules(modulesData);
  }, [data]);

  return (
    <Flex vertical gap='0.75rem' style={{ minHeight: '52vh' }}>
      <Space style={{ color: CLR_GRAY_3, fontWeight: 700 }}>
        <Translate i18nKey='pages.rolesAndPermissions.label.modulesHeading' />
      </Space>
      <ModuleTabs roleDetails={roleDetails} />
    </Flex>
  );
});

ModulesContainer.displayName = 'ModulesContainer';
