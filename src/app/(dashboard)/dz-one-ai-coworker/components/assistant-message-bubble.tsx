'use client';

import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { ChatMessage } from '../lib/types';
import { ThinkingBlock } from './thinking-block';
import { MarkdownRenderer } from './renderers/markdown-renderer';
import { Hideable } from '@/components/shared';
import { useAiAgentStore } from '../store/use-ai-agent-store';

interface AssistantMessageBubbleProps {
  message: ChatMessage;
}

export const AssistantMessageBubble: FC<AssistantMessageBubbleProps> = ({
  message,
}) => {
  // Subscribe directly to store for real-time updates
  const currentStreamingMessageId = useAiAgentStore(
    (state) => state.currentStreamingMessageId,
  );
  const currentProgressSteps = useAiAgentStore(
    (state) => state.currentProgressSteps,
  );
  const isThinking = useAiAgentStore((state) => state.isThinking);

  const isCurrentStreamingMessage = message.id === currentStreamingMessageId;

  // Use live store data for current streaming message, otherwise use message data
  const steps = isCurrentStreamingMessage
    ? currentProgressSteps
    : message.progressSteps;

  const hasProgressSteps = steps && steps.length > 0;
  const hasThinkingContent = !!message.thinkingContent;
  const isActive = isCurrentStreamingMessage ? isThinking : false;

  // Show thinking block only when there's thinking content or progress steps (not before first progress event)
  const showThinkingBlock = !!(hasThinkingContent || hasProgressSteps);

  return (
    <Flex>
      <Flex
        vertical
        gap='0.5rem'
        style={{
          width: '100%',
          maxWidth: '85%',
        }}>
        <Hideable show={showThinkingBlock}>
          <ThinkingBlock
            content={message.thinkingContent}
            steps={steps}
            duration={message.thinkingDuration}
            isActive={isActive}
          />
        </Hideable>
        <Hideable show={!!message.content && !message.isError}>
          <MarkdownRenderer content={message.content} />
        </Hideable>
        <Hideable show={!!message.content && !!message.isError}>
          <Text style={{ color: '#cf1322', fontSize: '1rem' }}>
            {message.content}
          </Text>
        </Hideable>
      </Flex>
    </Flex>
  );
};
