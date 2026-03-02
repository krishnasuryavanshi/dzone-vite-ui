import { DzBox } from '@/components/layout/v1';
import { ArrowRightOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';

interface ISourceNameCellProps {
  name: string;
}

export const SourceNameCell: FC<ISourceNameCellProps> = ({ name }) => {
  return (
    <Flex gap={'2rem'} style={{ width: '100%' }} align='center'>
      <DzBox
        style={{
          flex: 1,
          border: '1px solid #e9e9e9',
          borderRadius: '4px',
          padding: '0.5rem',
          boxShadow: '0px 0px 1px 0px rgba(0, 0, 0, 0.25) inset',
        }}>
        <Text style={{ color: '#888888' }}>{name}</Text>
      </DzBox>
      <DzBox style={{ width: '2rem' }}>
        <ArrowRightOutlined style={{ strokeWidth: 50, stroke: '#888888' }} />
      </DzBox>
    </Flex>
  );
};
