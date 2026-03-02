import { Hideable, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { useDzentStore } from '../../../store';
import { SystemMessage } from './system-message';
import { UserMessage } from './user-message';

export const ConversationHistoryContainer = () => {
  const { conversation } = useDzentStore();
  const renderMessage = (convItem: DzRecord) => {
    const { type, message, feedback, feedbackGiven } = convItem;
    switch (type) {
      case 'system':
        return (
          <SystemMessage
            message={message}
            feedback={feedback}
            feedbackGiven={feedbackGiven}
          />
        );
      case 'user':
        return <UserMessage message={message} />;
      default:
        return null;
    }
  };
  return (
    <Hideable show={!!conversation?.length}>
      <Flex vertical className='conversation-history-container' gap='0.5rem'>
        <MapFunction items={conversation} renderItem={renderMessage} />
      </Flex>
    </Hideable>
  );
};
