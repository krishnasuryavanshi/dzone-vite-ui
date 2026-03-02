'use client';
import { CLR_BLACK } from '@/lib/constants';
import { Space } from '@/uicomponents/layout';
import { Translate } from '@/components/i18n';
import { FC } from 'react';

interface IUsersTitleProps {
  orgName?: string;
}

export const UsersTitle: FC<IUsersTitleProps> = ({ orgName }) => {
  return (
    <Space style={{ color: CLR_BLACK, fontWeight: 600 }}>
      <Translate i18nKey='Users' />
      {orgName && ` - ${orgName}`}
    </Space>
  );
};
