import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Flex, Space } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { useModulesStore } from '../../../stores';
import { Tooltip } from '@/uicomponents/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  getActionsEnumKey,
  getModuleEnumKey,
  getPermissionsGroupEnumKey,
} from '../../../lib/utils/enum-mapper';
import { MessageDetails } from '../../../lib/utils';

interface IPermissionGroupNameProps {
  groupName: string;
  actionId: string;
}

export const PermissionGroupName: FC<IPermissionGroupNameProps> = ({
  groupName,
  actionId,
}) => {
  const { selectedModule, modules } = useModulesStore();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (selectedModule && modules) {
      const moduleEnumKey = getModuleEnumKey(selectedModule);
      const permissionEnumKey = getPermissionsGroupEnumKey(groupName);
      const actionName = modules[selectedModule].actions.find(
        (action) => action.id === actionId,
      )?.value;
      if (actionName) {
        const actionEnumKey = getActionsEnumKey(actionName);

        setMessage(
          MessageDetails[moduleEnumKey!]?.[actionEnumKey]?.groupTooltip?.[
            permissionEnumKey
          ] || 'Only selected field will be visible to users.',
        );
      }
    }
  }, [selectedModule, modules]);

  return (
    <Flex style={{ paddingTop: '0.75rem' }}>
      <Space
        style={{
          fontSize: '1.125rem',
          paddingRight: '0.2rem',
          color: DZONE_CLR_BLACK,
        }}>
        <Translate i18nKey={groupName} />
      </Space>
      <Tooltip
        placement='right'
        overlayStyle={{ whiteSpace: 'wrap', maxWidth: '12.5rem' }}
        overlayInnerStyle={{
          fontSize: '12px',
          textAlign: 'center',
        }}
        title={<Translate i18nKey={message} />}>
        <InfoCircleOutlined />
      </Tooltip>
    </Flex>
  );
};
