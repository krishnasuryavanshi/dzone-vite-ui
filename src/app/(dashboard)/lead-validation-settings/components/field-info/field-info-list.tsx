import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { Text } from '@/uicomponents/text';
import { ReactNode } from 'react';

interface FieldInfoConfig {
  config: DzRecord;
}
export const FieldInfoList = ({ config }: FieldInfoConfig) => {
  const List = config.type === 'ordered_list' ? OrderedList : UnOrderedList;
  return (
    <DzBox style={{ marginLeft: '0.5rem' }}>
      <Text strong style={{ fontSize: '0.875rem' }}>
        {config.data.header}
      </Text>
      <List>
        {config.data.items.map((item: string, index: number) => (
          <li key={index} style={{ fontSize: '0.875rem', color: '#000' }}>
            <Text style={{ fontSize: '0.875rem' }}>{item}</Text>
          </li>
        ))}
      </List>
    </DzBox>
  );
};

const OrderedList = ({ children }: { children: ReactNode }) => {
  return (
    <ol style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>{children}</ol>
  );
};

const UnOrderedList = ({ children }: { children: ReactNode }) => {
  return (
    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>{children}</ul>
  );
};
