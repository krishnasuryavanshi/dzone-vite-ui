import { Card } from '@/uicomponents/layout/card';
import React, { FC, PropsWithChildren, ReactNode } from 'react';

import './supplier-chart-card.scss';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';

interface ISupplierChartCardProps extends PropsWithChildren {
  title: string;
  extra?: ReactNode;
}

export const ChartCard: FC<ISupplierChartCardProps> = ({ title, extra, children }) => {
  return (
    <Card
      className='dz-one-chart-card supplier-chart-container'
      title={<Translate i18nKey={title} />}
      extra={extra}
    >
      <DzBox>
        <Flex align='center' justify='center'>
          <DzBox style={{ height: '16.5rem', width: '100%' }}>{children}</DzBox>
        </Flex>
      </DzBox>
    </Card>
  );
};
