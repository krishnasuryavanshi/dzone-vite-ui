
import { Flex } from '@/uicomponents/layout';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { InputArea } from './input-area';
import { DropZoneOverlay } from './drop-zone-overlay';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { useDragAndDrop } from '../lib/hooks';
import { getAcceptedFileTypes } from '../services';
import { useCallback, useRef } from 'react';

export const ChatContainer = () => {
  const inputDisabled = useAiAgentStore((state) => state.inputDisabled);
  const streamingConversationId = useAiAgentStore(
    (state) => state.streamingConversationId,
  );
  const currentConversationId = useAiAgentStore(
    (state) => state.currentConversationId,
  );
  const isCurrentConversationStreaming =
    streamingConversationId === currentConversationId &&
    streamingConversationId !== null;
  const tenantCode = useAiAgentStore((state) => state.tenantCode);
  const isDraggingOver = useAiAgentStore((state) => state.isDraggingOver);
  const setDraggingOver = useAiAgentStore((state) => state.setDraggingOver);

  // Ref to call the file upload handler from InputArea
  const fileUploadHandlerRef = useRef<((files: File[]) => void) | null>(null);

  const handleDrop = useCallback((files: File[]) => {
    if (fileUploadHandlerRef.current) {
      fileUploadHandlerRef.current(files);
    }
  }, []);

  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: handleDrop,
    acceptedTypes: getAcceptedFileTypes().split(','),
    disabled: inputDisabled || isCurrentConversationStreaming || !tenantCode,
  });

  // Sync dragging state with store for overlay visibility
  if (isDragging !== isDraggingOver) {
    setDraggingOver(isDragging);
  }

  return (
    <Flex
      vertical
      style={{
        flex: 1,
        backgroundColor: '#fff',
        overflow: 'hidden',
        border: '1px solid #e8e8e8',
        borderRadius: '0.75rem',
        margin: '0.5rem 0.5rem 1rem 0.5rem',
      }}
      {...dragHandlers}>
      <ChatHeader />
      <Flex
        vertical
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
        <DropZoneOverlay isVisible={isDragging} />
        <MessageList />
        <InputArea onFileUploadRef={fileUploadHandlerRef} />
      </Flex>
    </Flex>
  );
};
