import { Flex, Space } from '@/uicomponents/layout';
import { useModulesStore } from '../../../stores';
import { FC, memo, useEffect } from 'react';
import { Translate } from '@/components/i18n';
import './role-modules.scss';
import { CLR_GRAY_3 } from '@/lib/constants';
import { ModuleTabs } from './modules-tabs';
import { IRoleDetails } from '../../../lib/types';

interface IModulesContainerProps {
  roleDetails: IRoleDetails;
}

export const ModulesContainer: FC<IModulesContainerProps> = memo(
  ({ roleDetails }) => {
    const { fetchModules } = useModulesStore();

    useEffect(() => {
      fetchModules();
    }, []);

    return (
      <Flex vertical gap='0.75rem' style={{ minHeight: '52vh' }}>
        <Space style={{ color: CLR_GRAY_3, fontWeight: 700 }}>
          <Translate i18nKey='pages.rolesAndPermissions.label.modulesHeading' />
        </Space>
        <ModuleTabs roleDetails={roleDetails} />
      </Flex>
    );
  },
);

ModulesContainer.displayName = 'ModulesContainer';
