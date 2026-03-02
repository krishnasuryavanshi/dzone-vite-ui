'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAiAgentStore } from '../../store/use-ai-agent-store';
import {
  streamChatDirect,
  cancelStream,
  uploadChatFiles,
} from '../../services';
import { FileAttachment, StreamChunk, FileUploadStatus } from '../../lib/types';

export const useInputArea = (
  onFileUploadRef?: React.MutableRefObject<((files: File[]) => void) | null>,
) => {
  const [value, setValue] = useState('');
  const connectionIdRef = useRef<string | null>(null);
  const titleTypingRef = useRef<NodeJS.Timeout | null>(null);
  const previewUrlsRef = useRef<Map<string, string>>(new Map());

  // Store state selectors
  const inputDisabled = useAiAgentStore((state) => state.inputDisabled);
  const isTenantUnavailable = useAiAgentStore(
    (state) => state.isTenantUnavailable,
  );
  const sessionId = useAiAgentStore((state) => state.sessionId);
  const tenantCode = useAiAgentStore((state) => state.tenantCode);
  const currentConversationId = useAiAgentStore(
    (state) => state.currentConversationId,
  );
  const streamingConversationId = useAiAgentStore(
    (state) => state.streamingConversationId,
  );
  const isCurrentConversationStreaming =
    streamingConversationId === currentConversationId &&
    streamingConversationId !== null;
  const isAnyStreamActive = streamingConversationId !== null;
  const attachments = useAiAgentStore((state) => state.attachments);
  const isUploading = useAiAgentStore((state) => state.isUploading);
  const uploadProgress = useAiAgentStore((state) => state.uploadProgress);

  // Store actions
  const initSession = useAiAgentStore((state) => state.initSession);
  const isSessionExpired = useAiAgentStore((state) => state.isSessionExpired);
  const updateSessionActivity = useAiAgentStore(
    (state) => state.updateSessionActivity,
  );
  const addUserMessage = useAiAgentStore((state) => state.addUserMessage);
  const startAssistantMessage = useAiAgentStore(
    (state) => state.startAssistantMessage,
  );
  const setAssistantMessageContent = useAiAgentStore(
    (state) => state.setAssistantMessageContent,
  );
  const setAssistantMessageError = useAiAgentStore(
    (state) => state.setAssistantMessageError,
  );
  const finishAssistantMessage = useAiAgentStore(
    (state) => state.finishAssistantMessage,
  );
  const addProgressStep = useAiAgentStore((state) => state.addProgressStep);
  const setThinking = useAiAgentStore((state) => state.setThinking);
  const addNewConversation = useAiAgentStore(
    (state) => state.addNewConversation,
  );
  const updateConversationTitle = useAiAgentStore(
    (state) => state.updateConversationTitle,
  );

  // File attachment actions
  const addAttachment = useAiAgentStore((state) => state.addAttachment);
  const updateAttachmentProgress = useAiAgentStore(
    (state) => state.updateAttachmentProgress,
  );
  const updateAttachmentStatus = useAiAgentStore(
    (state) => state.updateAttachmentStatus,
  );
  const removeAttachment = useAiAgentStore((state) => state.removeAttachment);
  const clearAttachments = useAiAgentStore((state) => state.clearAttachments);
  const setUploading = useAiAgentStore((state) => state.setUploading);

  // Helper to check if file is an image
  const isImageFile = useCallback((file: File): boolean => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.type.toLowerCase());
  }, []);

  // Handle file upload
  const handleFilesUpload = useCallback(
    async (files: File[]) => {
      if (!tenantCode || inputDisabled || isCurrentConversationStreaming)
        return;

      setUploading(true);

      await uploadChatFiles(
        files,
        tenantCode,
        attachments.length,
        // onFileStart
        (file, tempId) => {
          let previewUrl: string | undefined;
          if (isImageFile(file)) {
            previewUrl = URL.createObjectURL(file);
            previewUrlsRef.current.set(tempId, previewUrl);
          }

          const tempAttachment: FileAttachment = {
            id: tempId,
            name: file.name,
            size: file.size,
            type: file.type,
            status: FileUploadStatus.UPLOADING,
            progress: 0,
            previewUrl,
          };
          addAttachment(tempAttachment);
        },
        // onFileProgress
        (tempId, progress) => {
          updateAttachmentProgress(tempId, progress);
        },
        // onFileComplete
        (tempId, attachment) => {
          const previewUrl = previewUrlsRef.current.get(tempId);
          if (previewUrl) {
            attachment.previewUrl = previewUrl;
            previewUrlsRef.current.delete(tempId);
            previewUrlsRef.current.set(attachment.id, previewUrl);
          }
          removeAttachment(tempId);
          addAttachment(attachment);
        },
        // onFileError
        (tempId, error) => {
          updateAttachmentStatus(tempId, FileUploadStatus.ERROR, error);
        },
      );

      setUploading(false);
    },
    [
      tenantCode,
      inputDisabled,
      isCurrentConversationStreaming,
      attachments.length,
      isImageFile,
      setUploading,
      addAttachment,
      updateAttachmentProgress,
      updateAttachmentStatus,
      removeAttachment,
    ],
  );

  // Expose handleFilesUpload to parent via ref for drag & drop
  useEffect(() => {
    if (onFileUploadRef) {
      onFileUploadRef.current = handleFilesUpload;
    }
    return () => {
      if (onFileUploadRef) {
        onFileUploadRef.current = null;
      }
    };
  }, [onFileUploadRef, handleFilesUpload]);

  // Cleanup blob URLs when attachments are cleared
  useEffect(() => {
    if (attachments.length === 0 && previewUrlsRef.current.size > 0) {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      previewUrlsRef.current.clear();
    }
  }, [attachments.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionIdRef.current) {
        cancelStream(connectionIdRef.current);
      }
      if (titleTypingRef.current) {
        clearTimeout(titleTypingRef.current);
      }
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      previewUrlsRef.current.clear();
    };
  }, []);

  // Typing effect for title update
  const typeTitle = useCallback(
    (conversationId: string, fullTitle: string) => {
      if (titleTypingRef.current) {
        clearTimeout(titleTypingRef.current);
      }

      let currentIndex = 0;
      const typeNextChar = () => {
        if (currentIndex <= fullTitle.length) {
          const partialTitle = fullTitle.slice(0, currentIndex);
          updateConversationTitle(conversationId, partialTitle || ' ');
          currentIndex++;
          titleTypingRef.current = setTimeout(typeNextChar, 30);
        } else {
          titleTypingRef.current = null;
        }
      };

      typeNextChar();
    },
    [updateConversationTitle],
  );

  const handleStop = useCallback(() => {
    if (connectionIdRef.current) {
      cancelStream(connectionIdRef.current);
      connectionIdRef.current = null;
      finishAssistantMessage();
    }
  }, [finishAssistantMessage]);

  const handleSend = useCallback(async () => {
    // Block only if THIS conversation is streaming
    if (!value.trim() || isCurrentConversationStreaming || !tenantCode) return;

    // Cancel background stream if another conversation is streaming
    if (isAnyStreamActive && !isCurrentConversationStreaming) {
      if (connectionIdRef.current) {
        cancelStream(connectionIdRef.current);
        connectionIdRef.current = null;
      }
      finishAssistantMessage();
    }

    const message = value.trim();
    const currentAttachments = [...attachments];
    const successfulAttachments = currentAttachments.filter(
      (a) => a.status === FileUploadStatus.SUCCESS,
    );
    const fileIds = successfulAttachments.map((a) => a.id);

    setValue('');
    addUserMessage(message, currentAttachments);
    startAssistantMessage();

    // Initialize session if not exists or expired
    let currentSessionId = sessionId;
    if (!currentSessionId || isSessionExpired()) {
      const sessionInitSuccess = await initSession(
        tenantCode,
        currentConversationId || undefined,
      );

      if (!sessionInitSuccess) {
        setAssistantMessageError(
          'Failed to initialize session. Please try again.',
        );
        finishAssistantMessage();
        return;
      }

      currentSessionId = useAiAgentStore.getState().sessionId;
    }

    if (!currentSessionId) {
      setAssistantMessageError('Session not available. Please try again.');
      finishAssistantMessage();
      return;
    }

    updateSessionActivity();

    const connectionId = await streamChatDirect(
      message,
      currentSessionId,
      fileIds.length > 0 ? fileIds : undefined,
      (chunk: StreamChunk) => {
        switch (chunk._eventType) {
          case 'conversation_created':
            if (chunk.conversationId) {
              addNewConversation(chunk.conversationId, chunk.title);
            }
            break;
          case 'title_update':
            if (chunk.conversationId && chunk.title) {
              typeTitle(chunk.conversationId, chunk.title);
            }
            break;
          case 'progress':
            if (chunk.message) {
              setThinking(true);
              addProgressStep(chunk.message);
            }
            break;
          case 'message':
            if (chunk.content) {
              setThinking(false);
              setAssistantMessageContent(chunk.content);
            }
            break;
          case 'done':
            setThinking(false);
            break;
          case 'error':
            setThinking(false);
            if (chunk.error) {
              setAssistantMessageError(chunk.error);
            }
            break;
        }
      },
      () => {
        connectionIdRef.current = null;
        finishAssistantMessage();
      },
      (error: Error) => {
        connectionIdRef.current = null;
        setAssistantMessageError(
          error.message || 'An error occurred. Please try again.',
        );
        finishAssistantMessage();
      },
    );
    connectionIdRef.current = connectionId;
  }, [
    value,
    isCurrentConversationStreaming,
    isAnyStreamActive,
    sessionId,
    tenantCode,
    currentConversationId,
    attachments,
    initSession,
    isSessionExpired,
    updateSessionActivity,
    addUserMessage,
    startAssistantMessage,
    setAssistantMessageContent,
    setAssistantMessageError,
    finishAssistantMessage,
    addProgressStep,
    setThinking,
    addNewConversation,
    typeTitle,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isCurrentConversationStreaming) {
        e.preventDefault();
        handleSend();
      }
    },
    [isCurrentConversationStreaming, handleSend],
  );

  const handleRemoveAttachment = useCallback(
    (id: string) => {
      const previewUrl = previewUrlsRef.current.get(id);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrlsRef.current.delete(id);
      }
      removeAttachment(id);
    },
    [removeAttachment],
  );

  const handleCancelUpload = useCallback(() => {
    previewUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    previewUrlsRef.current.clear();
    clearAttachments();
    setUploading(false);
  }, [clearAttachments, setUploading]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    [],
  );

  const uploadingCount = attachments.filter(
    (a) => a.status === FileUploadStatus.UPLOADING,
  ).length;
  const canSend =
    !!value.trim() && !isCurrentConversationStreaming && !isUploading;

  return {
    // State
    value,
    attachments,
    isStreaming: isCurrentConversationStreaming,
    isUploading,
    uploadProgress,
    inputDisabled,
    isTenantUnavailable,
    tenantCode,
    uploadingCount,
    canSend,
    // Handlers
    handleSend,
    handleStop,
    handleKeyDown,
    handleChange,
    handleFilesUpload,
    handleRemoveAttachment,
    handleCancelUpload,
  };
};
