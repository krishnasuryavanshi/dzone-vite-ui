import { Translate } from '@/components/i18n/translate';
import { CLR_BLACK } from '@/lib/constants';
import { Space } from '@/uicomponents/layout';
import React, { FC } from 'react';

interface IOrganizationsTitleProps {}

export const OrganizationsTitle: FC<IOrganizationsTitleProps> = ({}) => {
  return (
    <Space style={{ color: CLR_BLACK, fontWeight: 600 }}>
      <Translate i18nKey='Organizations' />
    </Space>
  );
};
