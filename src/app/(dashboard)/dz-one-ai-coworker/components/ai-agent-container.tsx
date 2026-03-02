'use client';

import { Flex } from '@/uicomponents/layout';
import { ConversationSidebar } from './conversation-sidebar';
import { ChatContainer } from './chat-container';

export const AiAgentContainer = () => {
  return (
    <Flex
      style={{
        height: 'calc(100vh - 4rem)',
      }}>
      <ConversationSidebar />
      <ChatContainer />
    </Flex>
  );
};
