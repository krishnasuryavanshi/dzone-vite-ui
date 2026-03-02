'use client';
import { CLR_BLACK } from '@/lib/constants';
import { Space } from '@/uicomponents/layout';
import { Translate } from '@/components/i18n';

export const RolesAndPermissionsTitle = () => {
  return (
    <Space style={{ color: CLR_BLACK, fontWeight: 600 }}>
      <Translate i18nKey='pages.rolesAndPermissions.title' />
    </Space>
  );
};
