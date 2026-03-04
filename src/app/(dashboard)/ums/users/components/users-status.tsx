import { DzBox } from '@/components/layout/v1';
import { FC } from 'react';

interface IUsersStatusProps {
  status: string;
}

const StatuConfig: Record<string, any> = {
  Active: {
    color: '#1A9F0B',
    backgroundColor: '#E4FFEF',
  },
  Invited: {
    color: '#BDB608',
    backgroundColor: '#FEFED8',
  },
  Deactivated: {
    color: '#F70814',
    backgroundColor: '#DBB3B5',
  },
};

export const UsersStatus: FC<IUsersStatusProps> = ({ status }) => {
  if (!status) {
    return null;
  }

  return (
    <DzBox
      style={{
        padding: '0.25rem',
        borderRadius: '4px',
        display: 'inline-block',
        filter: 'drop-shadow(0px 0px 4px rgba(35, 90, 237, 0.16))',
        ...StatuConfig[status],
      }}
    >
      {status}
    </DzBox>
  );
};
