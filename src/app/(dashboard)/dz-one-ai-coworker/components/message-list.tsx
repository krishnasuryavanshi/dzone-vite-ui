
import { Spin } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useEffect, useRef, useCallback } from 'react';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { MessageItem } from './message-item';
import { StreamingIndicator } from './streaming-indicator';
import { EmptyState } from './empty-state';

export const MessageList = () => {
  const messages = useAiAgentStore((state) => state.messages);
  const streamingConversationId = useAiAgentStore(
    (state) => state.streamingConversationId,
  );
  const currentConversationId = useAiAgentStore(
    (state) => state.currentConversationId,
  );
  const isCurrentConversationStreaming =
    streamingConversationId === currentConversationId &&
    streamingConversationId !== null;
  const isLoadingConversation = useAiAgentStore(
    (state) => state.isLoadingConversation,
  );
  const hasMoreMessages = useAiAgentStore((state) => state.hasMoreMessages);
  const isLoadingMoreMessages = useAiAgentStore(
    (state) => state.isLoadingMoreMessages,
  );
  const loadMoreMessages = useAiAgentStore((state) => state.loadMoreMessages);

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  // Scroll to bottom for new messages
  useEffect(() => {
    if (scrollRef.current && !isLoadingMoreMessages) {
      // Only auto-scroll on initial load or when new message is added at the end
      if (isInitialLoadRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
        isInitialLoadRef.current = false;
      } else if (isCurrentConversationStreaming) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [messages, isCurrentConversationStreaming, isLoadingMoreMessages]);

  // Preserve scroll position when loading older messages
  useEffect(() => {
    if (containerRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop = scrollDiff;
      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  // Reset initial load flag when conversation changes
  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [isLoadingConversation]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMoreMessages || isLoadingMoreMessages) {
      return;
    }

    const { scrollTop } = containerRef.current;

    // Load more when scrolled near the top (within 100px)
    if (scrollTop < 100) {
      prevScrollHeightRef.current = containerRef.current.scrollHeight;
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMoreMessages, loadMoreMessages]);

  if (isLoadingConversation) {
    return (
      <Flex
        vertical
        align='center'
        justify='center'
        gap='0.5rem'
        style={{ flex: 1, padding: '2rem' }}>
        <Spin />
        <Text type='secondary'>Loading conversation...</Text>
      </Flex>
    );
  }

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        marginInline: '6rem',
      }}>
      <Flex vertical gap='1rem'>
        {isLoadingMoreMessages && (
          <Flex justify='center' style={{ padding: '0.5rem' }}>
            <Spin size='small' />
          </Flex>
        )}
        {hasMoreMessages && !isLoadingMoreMessages && (
          <Flex justify='center' style={{ padding: '0.5rem' }}>
            <Text type='secondary' style={{ fontSize: '0.75rem' }}>
              Scroll up to load more
            </Text>
          </Flex>
        )}
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isCurrentConversationStreaming && <StreamingIndicator />}
        <div ref={scrollRef} />
      </Flex>
    </div>
  );
};
