'use client';

import { Button } from '@/uicomponents';
import { DeleteOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { ChatWidgetIcon } from '@/uicomponents/icons/svgs';
import { useAiAgentStore } from '../store/use-ai-agent-store';

export const ChatHeader = () => {
  const currentConversationTitle = useAiAgentStore(
    (state) => state.currentConversationTitle,
  );
  const messagesCount = useAiAgentStore((state) => state.messages.length);
  const createNewConversation = useAiAgentStore(
    (state) => state.createNewConversation,
  );

  return (
    <Flex
      align='center'
      justify='space-between'
      style={{
        padding: '0.75rem 1.5rem 0.25rem 1.5rem',
        borderBottom: '1px solid #f0f0f0',
      }}>
      <Flex align='center' gap='0.75rem'>
        <ChatWidgetIcon />
      </Flex>
    </Flex>
  );
};
