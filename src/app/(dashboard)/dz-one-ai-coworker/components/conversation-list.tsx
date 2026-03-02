'use client';

import { Spin } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { ConversationItem } from './conversation-item';
import { ConversationMetadata } from '../lib/types';
import { Hideable } from '@/components/shared';
import { COLORS } from '../lib/constants/colors';
import { useCallback } from 'react';

interface ConversationListProps {
  conversations: ConversationMetadata[];
  currentConversationId: string | null;
  isLoading: boolean;
  onLoadConversation: (conversation: ConversationMetadata) => void;
  streamingConversationId: string | null;
}

export const ConversationList = ({
  conversations,
  currentConversationId,
  isLoading,
  onLoadConversation,
  streamingConversationId,
}: ConversationListProps) => {
  const handleConversationClick = useCallback(
    (conversation: ConversationMetadata) => {
      onLoadConversation(conversation);
    },
    [onLoadConversation],
  );

  return (
    <Flex
      vertical
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem',
      }}>
      <Hideable show={isLoading}>
        <Flex justify='center' style={{ padding: '2rem' }}>
          <Spin size='small' />
        </Flex>
      </Hideable>

      <Hideable show={!isLoading && conversations.length === 0}>
        <Flex
          vertical
          align='center'
          justify='center'
          gap='0.5rem'
          style={{
            padding: '2rem 1rem',
            color: COLORS.GRAY_MEDIUM,
          }}>
          <Text style={{ color: COLORS.GRAY_MEDIUM, textAlign: 'center' }}>
            No conversation history yet
          </Text>
        </Flex>
      </Hideable>

      <Hideable show={!isLoading && conversations.length > 0}>
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === currentConversationId}
            isStreaming={conversation.id === streamingConversationId}
            onClick={() => handleConversationClick(conversation)}
          />
        ))}
      </Hideable>
    </Flex>
  );
};
