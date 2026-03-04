import { CloseOutlined, LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text, Spin } from '@/uicomponents';
import React, { FC } from 'react';
import { Progress } from '@/uicomponents/progress';
import { Translate } from '@/components/i18n';

interface IToastProgressProps {
  progress: number;
  show: boolean;
  title: string;
}

export const ToastProgress: FC<IToastProgressProps> = ({ progress, show, title }) => {
  if (!show) return null;
  return (
    <Flex align='flex-start' gap='1rem' style={{ width: '100%' }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: '2.25rem' }} spin />} />
      <Flex vertical gap={'0.5rem'} style={{ flex: 1 }}>
        <Flex justify='space-between' align='center'>
          <Text strong>
            <Translate i18nKey={title} />
          </Text>
          <CloseOutlined color='#000' />
        </Flex>
        <Progress percent={progress} status='active' showInfo={false} trailColor='#fff' />
      </Flex>
    </Flex>
  );
};
