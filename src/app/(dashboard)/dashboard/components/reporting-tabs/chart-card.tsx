import { Card } from '@/uicomponents/layout/card';
import React, { FC, PropsWithChildren, ReactNode } from 'react';

import './chart-card.scss';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';

interface IChartCardProps extends PropsWithChildren {
  title: string;
  extra?: ReactNode;
}

export const ChartCard: FC<IChartCardProps> = ({ title, extra, children }) => {
  return (
    <Card className='dz-one-chart-card' title={<Translate i18nKey={title} />} extra={extra}>
      <DzBox>
        <Flex align='center' justify='center'>
          <DzBox style={{ height: '16.5rem', width: '100%' }}>{children}</DzBox>
        </Flex>
      </DzBox>
    </Card>
  );
};
