import { Button } from '@/uicomponents';
import { EditOutlined } from '@/uicomponents/icons';
import React from 'react';

export const UserAction = () => {
  return (
    <Button
      className='dz-table-btn dz-btn-action-1'
      type='default'
      size='middle'
      icon={<EditOutlined />}
    />
  );
};
