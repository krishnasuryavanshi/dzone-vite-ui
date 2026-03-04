import { Translate } from '@/components/i18n';
import { CLR_BLACK, CLR_WHITE, DZONE_CLR_BLACK } from '@/lib/constants';
import { ItemType } from '@/lib/types/uicomponents';
import { Breadcrumb } from '@/uicomponents/breadcrumb';
import { ArrowLeft } from '@/components/uicomponents/icons/svgs';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC, useEffect, useState } from 'react';
import { useEditStore } from '../stores';

interface IRolePermissionBreadcrumbProps {
  name?: string;
  onBack?: () => void;
}
export const RolePermissioBreadcrumb: FC<IRolePermissionBreadcrumbProps> = ({ name, onBack }) => {
  const { isEditing } = useEditStore();

  const [items, setItems] = useState<ItemType[]>([
    {
      title: (
        <Text style={{ color: CLR_BLACK, fontWeight: 600 }}>
          <Translate i18nKey='pages.rolesAndPermissions.label.createNewRole' />
        </Text>
      ),
    },
  ]);

  useEffect(() => {
    if (name && isEditing) {
      setItems([
        {
          title: <Translate i18nKey={name} />,
        },
        {
          title: (
            <Text style={{ color: CLR_BLACK, fontWeight: 600 }}>
              <Translate i18nKey='pages.rolesAndPermissions.label.permissions' />
            </Text>
          ),
        },
      ]);
    }
  }, [name, isEditing]);

  return (
    <Flex align='center'>
      <Flex
        onClick={onBack}
        align='center'
        justify='center'
        style={{
          marginRight: '0.5rem',
          borderRadius: '50%',
          background: DZONE_CLR_BLACK,
          height: '1.75rem',
          width: '1.75rem',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <ArrowLeft style={{ color: CLR_WHITE, fontSize: '1.3rem' }} />
      </Flex>
      <Breadcrumb items={items} />
    </Flex>
  );
};
