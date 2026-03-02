import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { ConversationHistoryContainer } from './conversation-history';
import { SystemMessageContainer } from './system-message';
import { UserMessageContainer } from './user-message';
import { WaitingBubble } from './waiting-bubble';

export const ChatMessagesContainer = () => {
  return (
    <DzBox>
      <Flex
        vertical
        className='chat-messages-container'
        gap='0.5rem'
        style={{ minHeight: 0 }}>
        <ConversationHistoryContainer />
        <SystemMessageContainer />
        <UserMessageContainer />
        <WaitingBubble />
      </Flex>
    </DzBox>
  );
};
