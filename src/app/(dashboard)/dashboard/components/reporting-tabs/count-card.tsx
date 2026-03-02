import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_GRAY_4 } from '@/lib/constants';
import { Flex } from '@/uicomponents/layout';
import { Input } from '@/uicomponents/layout/skeleton';
import { Text } from '@/uicomponents/text';
import { Title } from '@/uicomponents/title';
import { FC, ReactNode } from 'react';

interface ICountCardProps {
  title: string | ReactNode;
  value: string | number | ReactNode;
}

export const CountCard: FC<ICountCardProps> = ({ title, value }) => {
  return (
    <DzBox
      dzOneBox
      style={{
        padding: '0.75rem 1rem',
        height: '6rem',
        background: DZONE_CLR_GRAY_4,
      }}>
      <Flex gap='0.75rem' vertical>
        <Text
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#000',
            lineHeight: 'normal',
          }}>
          {title || (
            <Input active style={{ height: '1.5rem', width: '150%' }} />
          )}
        </Text>
        <Title
          level={4}
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#000',
            lineHeight: 'normal',
          }}>
          {value || <Input active style={{ height: '1.5rem' }} />}
        </Title>
      </Flex>
    </DzBox>
  );
};
