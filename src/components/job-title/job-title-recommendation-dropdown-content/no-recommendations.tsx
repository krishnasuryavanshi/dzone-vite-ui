import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { GotItButton } from './got-it-button';
import { NoRecommendationsIcon } from './no-recommendations-icon';

interface INoRecommendationsProps {
  show: boolean;
  onClose: () => void;
}

export const NoRecommendations: FC<INoRecommendationsProps> = ({
  show,
  onClose,
}) => {
  if (!show) return null;

  return (
    <Flex vertical align='center' justify='center' gap='1rem'>
      <NoRecommendationsIcon />
      <Text strong italic>
        No Suggestions Yet
      </Text>
      <Text style={{ color: '#6A5656', fontSize: '0.875rem' }}>
        Enter a job title to receive tailored suggestions and ensure
        comprehensive targeting.
      </Text>
      <GotItButton onClose={onClose} />
    </Flex>
  );
};
