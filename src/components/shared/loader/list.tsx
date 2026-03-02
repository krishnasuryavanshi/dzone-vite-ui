import { List, ListItem } from '@/uicomponents/layout/list';
import { SkeletonInput } from '@/uicomponents/layout/skeleton';
import React, { FC } from 'react';

export const ListLoader: FC = () => {
  return (
    <List
      size="large"
      dataSource={[1, 2, 3, 4, 5]}
      renderItem={() => (
        <ListItem>
          <SkeletonInput style={{ width: '100%' }} active />
        </ListItem>
      )}
    />
  );
};