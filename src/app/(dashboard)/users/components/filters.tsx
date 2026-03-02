import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { DownOutlined, UserAddOutlined } from '@ant-design/icons';
import React from 'react';
import './users-list.scss';
export const Filters = () => {
  return (
    <Flex gap='0.75rem'>
      <Button type='primary' size='large' className='dz-btn-action-1'>
        <Translate i18nKey='pages.users.label.allUsers' />
        <DownOutlined style={{ marginLeft: '0.5rem' }} />
      </Button>

      <Button type='primary' size='large' className='dz-btn-action-1'>
        <Translate i18nKey='pages.users.label.newUser' />
        <UserAddOutlined style={{ marginLeft: '0.5rem' }} />
      </Button>
    </Flex>
  );
};
