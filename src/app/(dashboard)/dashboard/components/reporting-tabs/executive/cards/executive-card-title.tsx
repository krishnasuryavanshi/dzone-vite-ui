import { FC, ReactNode } from 'react';
import { Input } from '@/uicomponents/layout/skeleton';
import { Text } from '@/uicomponents/text';

interface ExecutiveCardTitleProps {
  title: string | ReactNode;
}

export const ExecutiveCardTitle: FC<ExecutiveCardTitleProps> = ({ title }) => {
  return (
    <Text
      style={{
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#000',
        lineHeight: 'normal',
      }}
    >
      {title || (
        <Input
          active
          style={{ height: '1.5rem', width: '100%' }}
        />
      )}
    </Text>
  );
};
