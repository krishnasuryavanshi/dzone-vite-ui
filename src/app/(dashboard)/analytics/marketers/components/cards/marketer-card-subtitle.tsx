import { FC, ReactNode } from 'react';
import { Input } from '@/uicomponents/layout/skeleton';
import { Text } from '@/uicomponents/text';

interface MarketerCardSubTitleProps {
  subTitle: string | ReactNode;
}

export const MarketerCardSubTitle: FC<MarketerCardSubTitleProps> = ({
  subTitle,
}) => {
  return (
    <Text
      style={{
        fontSize: '0.6rem',
        fontWeight: 500,
        color: '#eb43b9ff',
        lineHeight: 'normal',
        margin: '0.6rem',
      }}>
      {subTitle || <Input active style={{ height: '1.5rem', width: '100%' }} />}
    </Text>
  );
};
