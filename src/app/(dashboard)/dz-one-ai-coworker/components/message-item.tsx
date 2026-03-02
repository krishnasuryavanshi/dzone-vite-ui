'use client';

import { memo } from 'react';
import { ChatMessage } from '../lib/types';
import { UserMessageBubble } from './user-message-bubble';
import { AssistantMessageBubble } from './assistant-message-bubble';

interface MessageItemProps {
  message: ChatMessage;
}

const MessageItemComponent = ({ message }: MessageItemProps) => {
  if (message.role === 'user') {
    return <UserMessageBubble message={message} />;
  }

  return <AssistantMessageBubble message={message} />;
};

export const MessageItem = memo(
  MessageItemComponent,
  (prevProps, nextProps) => {
    // Only re-render if message content or streaming state changes
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.isStreaming === nextProps.message.isStreaming &&
      prevProps.message.thinkingContent === nextProps.message.thinkingContent &&
      prevProps.message.progressSteps?.length ===
        nextProps.message.progressSteps?.length
    );
  },
);
