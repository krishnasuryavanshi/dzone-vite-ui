import { Text } from '@/uicomponents';
import { FC } from 'react';

interface IJobTitleUnselectAllProps {
  onUnselectAll: () => void;
}

export const JobTitleUnselectAll: FC<IJobTitleUnselectAllProps> = ({ onUnselectAll }) => {
  return (
    <Text
      style={{
        fontSize: '0.75rem',
        color: '#235AED',
        cursor: 'pointer',
      }}
    >
      Unselect All
    </Text>
  );
};
