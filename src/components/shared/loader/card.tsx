import React, { FC } from 'react';
import {
  Skeleton,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonInput,
} from '@/uicomponents/layout/skeleton';
import { CardMeta, Card } from '@/uicomponents/layout/card';

export const CardLoader: FC = () => {
  return (
    <Card style={{ width: 300, marginTop: 16 }}>
      <Skeleton loading active avatar>
        <CardMeta
          avatar={<SkeletonAvatar active size='large' shape='circle' />}
          title={<SkeletonInput style={{ width: 150 }} active />}
          description={<SkeletonInput style={{ width: 200 }} active />}
        />
        <SkeletonButton style={{ width: 100, marginTop: 10 }} active />
      </Skeleton>
    </Card>
  );
};
