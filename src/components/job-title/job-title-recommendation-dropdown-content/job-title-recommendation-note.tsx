import { Text } from '@/uicomponents';
import { FC } from 'react';

export const JobTitleRecommendationNote: FC = () => {
  return (
    <Text style={{ fontSize: '0.875rem', color: '#6A5656' }}>
      <Text strong style={{ color: 'inherit', fontSize: 'inherit' }}>
        Note:
      </Text>{' '}
      Please consider selecting the similar job titles suggested below to ensure that no valuable
      leads are rejected during validation process.
    </Text>
  );
};
