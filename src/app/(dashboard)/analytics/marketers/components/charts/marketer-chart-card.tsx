import { Card } from '@/uicomponents/layout/card';
import React, { FC, PropsWithChildren, ReactNode } from 'react';

import './marketer-chart-card.scss';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';

interface IMarketerChartCardProps extends PropsWithChildren {
  title: string;
  extra?: ReactNode;
}

export const ChartCard: FC<IMarketerChartCardProps> = ({ title, extra, children }) => {
  return (
    <Card className='dz-one-chart-card' title={<Translate i18nKey={title} />} extra={extra}>
      <DzBox>
        <Flex align='center' justify='center'>
          <DzBox style={{ width: '100%' }}>{children}</DzBox>
        </Flex>
      </DzBox>
    </Card>
  );
};
