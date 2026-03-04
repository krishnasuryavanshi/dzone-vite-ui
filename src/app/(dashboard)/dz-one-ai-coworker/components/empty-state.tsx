import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { DzoneAiAgentIcon } from '@/uicomponents/icons/svgs';

export const EmptyState = () => {
  return (
    <Flex vertical align='center' justify='center' gap='1.5rem' style={{ flex: 1 }}>
      <DzoneAiAgentIcon />
      <Text style={{ color: '#262626', fontSize: '1rem', fontWeight: 500 }}>
        An AI assistant for your campaigns.
      </Text>
    </Flex>
  );
};
