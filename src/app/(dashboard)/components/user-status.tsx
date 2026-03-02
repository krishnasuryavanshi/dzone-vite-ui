import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { UserStatuses } from '../lib/constants';

interface IUserStatusProps {
  name: string;
  value: string;
  noIcon?: boolean;
}

export const UserStatus: FC<IUserStatusProps> = ({ name, value, noIcon }) => {
  const metadata = UserStatuses[name as keyof typeof UserStatuses];
  if (!metadata) {
    return null;
  }
  const style = {
    backgroundColor: metadata.backgroundColor,
    color: metadata.color,
    padding: '0.3rem',
    borderRadius: '4px',
    display: 'inline-block',
  };
  return (
    <Flex gap='0.5rem' style={style}>
      <Text style={{ color: metadata.color }}>{value}</Text>
    </Flex>
  );
};
