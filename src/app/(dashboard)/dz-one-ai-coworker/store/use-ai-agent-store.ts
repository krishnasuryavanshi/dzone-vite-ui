import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  AiAgentStore,
  BackgroundStreamBuffer,
  ChatMessage,
  ConversationMetadata,
  ConversationFilterType,
  FileAttachment,
  MessageRole,
  FileUploadStatus,
  MarketerOption,
} from '../lib/types';
import { DEFAULT_TEXT, UI, PAGINATION, TIME } from '../lib/constants';
import {
  generateMessageId,
  generateConversationId,
} from '../lib/utils/id-utils';
import {
  mapChatHistoryToMessages,
  truncateTitle,
} from '../lib/utils/message-utils';
import {
  fetchConversationList,
  fetchChatHistory,
} from '../services/conversation';
import { initSession as initSessionService } from '../services/session';

const initialState = {
  messages: [] as ChatMessage[],
  streamingConversationId: null as string | null,
  backgroundStreamBuffer: null as BackgroundStreamBuffer | null,
  isThinking: false,
  thinkingStartTime: null as number | null,
  currentStreamingMessageId: null as string | null,
  currentThinkingContent: '',
  // Progress tracking
  isProcessing: false,
  processingStartTime: null as number | null,
  currentProgressSteps: [] as string[],
  inputDisabled: false,
  // Conversation history
  conversationHistory: [] as ConversationMetadata[],
  currentConversationId: null as string | null,
  currentConversationTitle: DEFAULT_TEXT.NEW_CHAT,
  isLoadingHistory: false,
  isLoadingConversation: false,
  conversationFilter: 'current' as ConversationFilterType,
  // Marketer selection
  tenantCode: null as string | null,
  marketerList: null as MarketerOption[] | null,
  isTenantUnavailable: false,
  // Session
  sessionId: null as string | null,
  isInitializingSession: false,
  sessionExpiresIn: null as number | null,
  sessionLastActivity: null as number | null,
  // Chat history pagination (0-based)
  chatHistoryPage: 0,
  chatHistoryTotalPages: 0,
  chatHistoryTotal: 0,
  hasMoreMessages: false,
  isLoadingMoreMessages: false,
  // File attachments
  attachments: [] as FileAttachment[],
  isUploading: false,
  uploadProgress: 0,
  // Drag and drop
  isDraggingOver: false,
};

// Helper: find the correct messages array for the active stream
const getStreamingTarget = (state: AiAgentStore) => {
  const isForeground =
    state.streamingConversationId === state.currentConversationId;
  if (isForeground) {
    const idx = state.messages.findIndex(
      (m) => m.id === state.currentStreamingMessageId,
    );
    return { messages: state.messages, index: idx, isForeground: true };
  }
  if (
    state.backgroundStreamBuffer?.conversationId ===
    state.streamingConversationId
  ) {
    const msgId = state.backgroundStreamBuffer.currentStreamingMessageId;
    const idx = state.backgroundStreamBuffer.messages.findIndex(
      (m) => m.id === msgId,
    );
    return {
      messages: state.backgroundStreamBuffer.messages,
      index: idx,
      isForeground: false,
    };
  }
  return { messages: null, index: -1, isForeground: false };
};

export const useAiAgentStore = create<AiAgentStore>()(
  immer((set, get) => ({
    ...initialState,

    addUserMessage: (content: string, attachments?: FileAttachment[]) => {
      const message: ChatMessage = {
        id: generateMessageId(),
        role: MessageRole.USER,
        content,
        timestamp: new Date(),
        attachments: attachments?.filter(
          (a) => a.status === FileUploadStatus.SUCCESS,
        ),
      };

      set((state) => {
        // Auto-generate conversation ID if this is the first message
        if (!state.currentConversationId) {
          state.currentConversationId = generateConversationId();
          state.currentConversationTitle = truncateTitle(
            content,
            UI.TITLE_TRUNCATE_LENGTH,
          );
        }
        state.messages.push(message);
        state.inputDisabled = true;
        // Clear attachments after sending
        state.attachments = [];
        state.uploadProgress = 0;

        // Update message count and move conversation to top
        const convIndex = state.conversationHistory.findIndex(
          (c) => c.id === state.currentConversationId,
        );
        if (convIndex !== -1) {
          state.conversationHistory[convIndex].messageCount += 1;
          state.conversationHistory[convIndex].updatedAt =
            new Date().toISOString();
          // Move conversation to top if not already
          if (convIndex > 0) {
            const [conversation] = state.conversationHistory.splice(
              convIndex,
              1,
            );
            state.conversationHistory.unshift(conversation);
          }
        }
      });
    },

    startAssistantMessage: () => {
      const id = generateMessageId();
      const message: ChatMessage = {
        id,
        role: MessageRole.ASSISTANT,
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      set((state) => {
        state.messages.push(message);
        state.streamingConversationId = state.currentConversationId;
        state.currentStreamingMessageId = id;
      });
      return id;
    },

    setAssistantMessageContent: (content: string) => {
      set((state) => {
        const target = getStreamingTarget(state);
        if (target.messages && target.index !== -1) {
          target.messages[target.index].content = content;
        }
      });
    },

    setAssistantMessageError: (error: string) => {
      set((state) => {
        const target = getStreamingTarget(state);
        if (target.messages && target.index !== -1) {
          target.messages[target.index].content = error;
          target.messages[target.index].isError = true;
        }
      });
    },

    appendThinkingContent: (content: string) => {
      set((state) => {
        const target = getStreamingTarget(state);
        if (target.isForeground) {
          state.currentThinkingContent += content;
          if (target.index !== -1) {
            state.messages[target.index].thinkingContent =
              state.currentThinkingContent;
          }
        } else if (state.backgroundStreamBuffer && target.index !== -1) {
          state.backgroundStreamBuffer.currentThinkingContent += content;
          target.messages![target.index].thinkingContent =
            state.backgroundStreamBuffer.currentThinkingContent;
        }
      });
    },

    finishAssistantMessage: () => {
      const {
        thinkingStartTime,
        streamingConversationId,
        currentConversationId,
        backgroundStreamBuffer,
      } = get();
      const isForeground = streamingConversationId === currentConversationId;
      const thinkingTime = isForeground
        ? thinkingStartTime
        : (backgroundStreamBuffer?.thinkingStartTime ?? null);
      const thinkingDuration = thinkingTime
        ? Date.now() - thinkingTime
        : undefined;

      set((state) => {
        const target = getStreamingTarget(state);
        if (target.messages && target.index !== -1) {
          target.messages[target.index].isStreaming = false;
          if (thinkingDuration) {
            target.messages[target.index].thinkingDuration = thinkingDuration;
          }
        }

        // Update message count using streamingConversationId (not current)
        const convIndex = state.conversationHistory.findIndex(
          (c) => c.id === streamingConversationId,
        );
        if (convIndex !== -1) {
          state.conversationHistory[convIndex].messageCount += 1;
          state.conversationHistory[convIndex].updatedAt =
            new Date().toISOString();
        }

        // Clear streaming identity
        state.streamingConversationId = null;
        state.currentStreamingMessageId = null;

        if (target.isForeground) {
          // Reset all foreground streaming UI state
          state.isThinking = false;
          state.thinkingStartTime = null;
          state.currentThinkingContent = '';
          state.isProcessing = false;
          state.processingStartTime = null;
          state.currentProgressSteps = [];
          state.inputDisabled = false;
        }
        // For background: don't touch inputDisabled — it's correct for current conversation
        // Buffer stays until user switches back (restoreFromBackgroundBuffer clears it)
      });
    },

    setThinking: (thinking: boolean) => {
      const {
        thinkingStartTime,
        isThinking: currentlyThinking,
        backgroundStreamBuffer,
        streamingConversationId,
        currentConversationId,
      } = get();

      const isForeground = streamingConversationId === currentConversationId;

      set((state) => {
        const target = getStreamingTarget(state);
        if (thinking) {
          if (isForeground) {
            if (!currentlyThinking) {
              state.isThinking = true;
              state.thinkingStartTime = Date.now();
            }
          } else if (state.backgroundStreamBuffer) {
            if (!state.backgroundStreamBuffer.isThinking) {
              state.backgroundStreamBuffer.isThinking = true;
              state.backgroundStreamBuffer.thinkingStartTime = Date.now();
            }
          }
        } else {
          if (isForeground) {
            state.isThinking = false;
            if (thinkingStartTime && target.index !== -1) {
              const duration = Date.now() - thinkingStartTime;
              target.messages![target.index].thinkingDuration = duration;
              state.thinkingStartTime = null;
            }
          } else if (state.backgroundStreamBuffer) {
            const bufferStart = state.backgroundStreamBuffer.thinkingStartTime;
            state.backgroundStreamBuffer.isThinking = false;
            if (bufferStart && target.messages && target.index !== -1) {
              const duration = Date.now() - bufferStart;
              target.messages[target.index].thinkingDuration = duration;
              state.backgroundStreamBuffer.thinkingStartTime = null;
            }
          }
        }
      });
    },

    addProgressStep: (message: string) => {
      set((state) => {
        const target = getStreamingTarget(state);
        if (target.isForeground) {
          if (!state.isProcessing) {
            state.isProcessing = true;
            state.processingStartTime = Date.now();
          }
          state.currentProgressSteps.push(message);
          if (target.index !== -1) {
            state.messages[target.index].progressSteps = [
              ...state.currentProgressSteps,
            ];
          }
        } else if (state.backgroundStreamBuffer) {
          if (!state.backgroundStreamBuffer.isProcessing) {
            state.backgroundStreamBuffer.isProcessing = true;
            state.backgroundStreamBuffer.processingStartTime = Date.now();
          }
          state.backgroundStreamBuffer.currentProgressSteps.push(message);
          if (target.messages && target.index !== -1) {
            target.messages[target.index].progressSteps = [
              ...state.backgroundStreamBuffer.currentProgressSteps,
            ];
          }
        }
      });
    },

    setProcessing: (processing: boolean) => {
      const {
        processingStartTime,
        currentProgressSteps,
        streamingConversationId,
        currentConversationId,
        backgroundStreamBuffer,
      } = get();

      const isForeground = streamingConversationId === currentConversationId;

      set((state) => {
        const target = getStreamingTarget(state);
        if (isForeground) {
          if (!processing && processingStartTime) {
            const progressDuration = Date.now() - processingStartTime;
            if (target.index !== -1) {
              target.messages![target.index].progressDuration =
                progressDuration;
              target.messages![target.index].progressSteps = [
                ...currentProgressSteps,
              ];
            }
            state.processingStartTime = null;
          }
          state.isProcessing = processing;
        } else if (state.backgroundStreamBuffer) {
          const bufferStart = state.backgroundStreamBuffer.processingStartTime;
          if (!processing && bufferStart) {
            const progressDuration = Date.now() - bufferStart;
            if (target.messages && target.index !== -1) {
              target.messages[target.index].progressDuration = progressDuration;
              target.messages[target.index].progressSteps = [
                ...state.backgroundStreamBuffer.currentProgressSteps,
              ];
            }
            state.backgroundStreamBuffer.processingStartTime = null;
          }
          state.backgroundStreamBuffer.isProcessing = processing;
        }
      });
    },

    clearThinkingContent: () => {
      set((state) => {
        state.currentThinkingContent = '';
      });
    },

    saveToBackgroundBuffer: () => {
      const {
        streamingConversationId,
        currentConversationId,
        messages,
        currentStreamingMessageId,
        isThinking,
        thinkingStartTime,
        currentThinkingContent,
        isProcessing,
        processingStartTime,
        currentProgressSteps,
      } = get();

      // Only save if the current conversation is the one streaming
      if (
        !streamingConversationId ||
        streamingConversationId !== currentConversationId
      ) {
        return;
      }

      set((state) => {
        state.backgroundStreamBuffer = {
          conversationId: streamingConversationId,
          messages: messages.map((m) => ({ ...m })),
          currentStreamingMessageId: currentStreamingMessageId || '',
          isThinking,
          thinkingStartTime,
          currentThinkingContent,
          isProcessing,
          processingStartTime,
          currentProgressSteps: [...currentProgressSteps],
        };
      });
    },

    restoreFromBackgroundBuffer: (conversationId: string): boolean => {
      const { backgroundStreamBuffer, streamingConversationId } = get();

      if (
        !backgroundStreamBuffer ||
        backgroundStreamBuffer.conversationId !== conversationId
      ) {
        return false;
      }

      set((state) => {
        const buffer = state.backgroundStreamBuffer!;
        state.messages = buffer.messages;
        state.currentStreamingMessageId = buffer.currentStreamingMessageId;
        state.isThinking = buffer.isThinking;
        state.thinkingStartTime = buffer.thinkingStartTime;
        state.currentThinkingContent = buffer.currentThinkingContent;
        state.isProcessing = buffer.isProcessing;
        state.processingStartTime = buffer.processingStartTime;
        state.currentProgressSteps = buffer.currentProgressSteps;
        state.isLoadingConversation = false;

        // If stream is still active for this conversation, keep input disabled
        if (streamingConversationId === conversationId) {
          state.inputDisabled = true;
        } else {
          // Stream finished while we were away
          state.inputDisabled = state.isTenantUnavailable;
          state.backgroundStreamBuffer = null;
        }
      });

      return true;
    },

    reset: () => {
      const {
        conversationHistory,
        marketerList,
        tenantCode,
        sessionId,
        sessionExpiresIn,
        sessionLastActivity,
      } = get();
      set({
        ...initialState,
        conversationHistory, // Preserve history on reset
        marketerList, // Preserve marketer list on reset
        tenantCode, // Preserve selected marketer on reset
        sessionId, // Preserve session on reset
        sessionExpiresIn, // Preserve session expiration on reset
        sessionLastActivity, // Preserve session activity on reset
      });
    },

    // Conversation history actions
    fetchConversationHistory: async () => {
      const { conversationFilter, tenantCode } = get();

      set((state) => {
        state.isLoadingHistory = true;
      });

      const conversations = await fetchConversationList(
        conversationFilter,
        tenantCode || undefined,
      );

      set((state) => {
        state.conversationHistory = conversations;
        state.isLoadingHistory = false;
      });
    },

    setConversationFilter: (filter: ConversationFilterType) => {
      set((state) => {
        state.conversationFilter = filter;
      });
    },

    loadConversation: async (conversation: ConversationMetadata) => {
      const {
        marketerList,
        isLoadingConversation,
        streamingConversationId,
        currentConversationId,
        saveToBackgroundBuffer,
        restoreFromBackgroundBuffer,
      } = get();

      // Race condition guard
      if (isLoadingConversation) return;

      // If the current conversation is streaming, save its state to buffer
      if (
        streamingConversationId &&
        streamingConversationId === currentConversationId
      ) {
        saveToBackgroundBuffer();
      }

      // Check if conversation's tenant is available in marketer list
      const isTenantAvailable = marketerList?.some(
        (m) => m.value === conversation.tenantCode,
      );

      set((state) => {
        state.inputDisabled = true;
        state.isLoadingConversation = true;
        // Immediately select the conversation
        state.currentConversationId = conversation.id;
        state.currentConversationTitle = conversation.title;
        // Reset pagination state (0-based)
        state.chatHistoryPage = 0;
        state.hasMoreMessages = false;
        state.messages = [];
        // Clear foreground streaming UI state (don't clear streamingConversationId)
        state.isThinking = false;
        state.thinkingStartTime = null;
        state.currentThinkingContent = '';
        state.isProcessing = false;
        state.processingStartTime = null;
        state.currentProgressSteps = [];
        // Clear session when changing conversation
        state.sessionId = null;
        state.sessionExpiresIn = null;
        state.sessionLastActivity = null;
        // Set tenant from conversation
        state.tenantCode = conversation.tenantCode;
        // Set tenant unavailable flag if tenant not in marketer list
        state.isTenantUnavailable = !isTenantAvailable;
        // Clear attachments when switching conversation
        state.attachments = [];
        state.uploadProgress = 0;
        state.isUploading = false;
      });

      // Check if target conversation has a background buffer — if so, restore it
      if (restoreFromBackgroundBuffer(conversation.id)) {
        return;
      }

      const response = await fetchChatHistory(
        conversation.id,
        0,
        PAGINATION.DEFAULT_PAGE_SIZE,
      );

      if (response) {
        const totalPages = Math.ceil(response.total / response.pageSize);
        const messages = mapChatHistoryToMessages(response.messages);

        set((state) => {
          state.messages = messages;
          state.chatHistoryPage = response.page;
          state.chatHistoryTotalPages = totalPages;
          state.chatHistoryTotal = response.total;
          state.hasMoreMessages = response.page < totalPages - 1;
          // Keep input disabled if tenant is unavailable
          state.inputDisabled = state.isTenantUnavailable;
          state.isLoadingConversation = false;
        });
      } else {
        // Conversation not found (possibly server restarted)
        // Remove only this conversation from history, keep everything else
        set((state) => {
          state.inputDisabled = false;
          state.isLoadingConversation = false;
          state.isTenantUnavailable = false;
          // Remove the stale conversation from sidebar
          state.conversationHistory = state.conversationHistory.filter(
            (c) => c.id !== conversation.id,
          );
        });
      }
    },

    loadMoreMessages: async () => {
      const {
        currentConversationId,
        chatHistoryPage,
        hasMoreMessages,
        isLoadingMoreMessages,
      } = get();

      if (!currentConversationId || !hasMoreMessages || isLoadingMoreMessages) {
        return;
      }

      set((state) => {
        state.isLoadingMoreMessages = true;
      });

      const nextPage = chatHistoryPage + 1;
      const response = await fetchChatHistory(
        currentConversationId,
        nextPage,
        PAGINATION.DEFAULT_PAGE_SIZE,
      );

      if (response) {
        const totalPages = Math.ceil(response.total / response.pageSize);
        const newMessages = mapChatHistoryToMessages(response.messages);

        set((state) => {
          // Prepend older messages to the beginning
          state.messages = [...newMessages, ...state.messages];
          state.chatHistoryPage = response.page;
          state.chatHistoryTotalPages = totalPages;
          state.hasMoreMessages = response.page < totalPages - 1;
          state.isLoadingMoreMessages = false;
        });
      } else {
        set((state) => {
          state.isLoadingMoreMessages = false;
        });
      }
    },

    createNewConversation: () => {
      const {
        streamingConversationId,
        currentConversationId,
        saveToBackgroundBuffer,
      } = get();

      // If the current conversation is streaming, save its state to buffer
      if (
        streamingConversationId &&
        streamingConversationId === currentConversationId
      ) {
        saveToBackgroundBuffer();
      }

      set((state) => {
        state.messages = [];
        state.currentConversationId = null;
        state.currentConversationTitle = DEFAULT_TEXT.NEW_CHAT;
        // Don't reset streamingConversationId — let background stream finish
        state.isThinking = false;
        state.currentThinkingContent = '';
        state.isProcessing = false;
        state.processingStartTime = null;
        state.currentProgressSteps = [];
        state.inputDisabled = false;
        state.sessionId = null; // Clear session for new conversation
        state.sessionExpiresIn = null;
        state.sessionLastActivity = null;
        state.isTenantUnavailable = false; // Reset tenant unavailable flag
        // Reset pagination state
        state.chatHistoryPage = 1;
        state.chatHistoryTotalPages = 1;
        state.chatHistoryTotal = 0;
        state.hasMoreMessages = false;
        state.isLoadingMoreMessages = false;
        // Clear attachments for new conversation
        state.attachments = [];
        state.uploadProgress = 0;
        state.isUploading = false;
      });
    },

    setCurrentConversationTitle: (title: string) => {
      set((state) => {
        state.currentConversationTitle = title;
      });
    },

    addNewConversation: (conversationId: string, title?: string) => {
      const { tenantCode } = get();
      const conversationTitle = title || DEFAULT_TEXT.NEW_CONVERSATION;

      set((state) => {
        // Add new conversation at the top
        const newConversation: ConversationMetadata = {
          id: conversationId,
          title: conversationTitle,
          tenantCode: tenantCode || '',
          messageCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.conversationHistory.unshift(newConversation);

        // If we're replacing the conversation ID mid-stream, keep streamingConversationId in sync
        if (
          state.streamingConversationId &&
          state.streamingConversationId === state.currentConversationId
        ) {
          state.streamingConversationId = conversationId;
        }
        // Also update background buffer if it references the old ID
        if (
          state.backgroundStreamBuffer &&
          state.backgroundStreamBuffer.conversationId ===
            state.currentConversationId
        ) {
          state.backgroundStreamBuffer.conversationId = conversationId;
        }

        // Select the conversation
        state.currentConversationId = conversationId;
        state.currentConversationTitle = conversationTitle;
      });
    },

    updateConversationTitle: (conversationId: string, title: string) => {
      const { conversationHistory } = get();
      const existingIndex = conversationHistory.findIndex(
        (c) => c.id === conversationId,
      );

      set((state) => {
        if (existingIndex !== -1) {
          // Update existing conversation title
          state.conversationHistory[existingIndex].title = title;
          state.conversationHistory[existingIndex].updatedAt =
            new Date().toISOString();
        }
        // Update current conversation title if it's the active one
        if (state.currentConversationId === conversationId) {
          state.currentConversationTitle = title;
        }
      });
    },

    // Marketer selection actions
    setTenantCode: (tenantCode: string | null) => {
      const { conversationFilter } = get();

      set((state) => {
        state.tenantCode = tenantCode;
        state.sessionId = null; // Clear session when tenant changes
        state.sessionExpiresIn = null;
        state.sessionLastActivity = null;
        state.isTenantUnavailable = false; // Reset tenant unavailable flag
      });

      // Refetch conversation history when filter is 'current' and tenant changes
      if (conversationFilter === 'current' && tenantCode) {
        get().fetchConversationHistory();
      }
    },

    setMarketerList: (marketerList: MarketerOption[] | null) => {
      set((state) => {
        state.marketerList = marketerList;
      });
    },

    setTenantUnavailable: (unavailable: boolean) => {
      set((state) => {
        state.isTenantUnavailable = unavailable;
        if (unavailable) {
          state.inputDisabled = true;
        }
      });
    },

    // Session actions
    initSession: async (
      tenantCode: string,
      conversationId?: string,
    ): Promise<boolean> => {
      set((state) => {
        state.isInitializingSession = true;
      });

      const response = await initSessionService(tenantCode, conversationId);

      set((state) => {
        state.isInitializingSession = false;
        if (response?.success && response.sessionId) {
          state.sessionId = response.sessionId;
          state.sessionExpiresIn = response.expiresIn || null;
          state.sessionLastActivity = Date.now();
        }
      });

      return !!(response?.success && response.sessionId);
    },

    setSessionId: (sessionId: string | null) => {
      set((state) => {
        state.sessionId = sessionId;
      });
    },

    isSessionExpired: () => {
      const { sessionId, sessionExpiresIn, sessionLastActivity } = get();
      if (!sessionId || !sessionExpiresIn || !sessionLastActivity) {
        return true; // No valid session
      }
      const elapsedSeconds =
        (Date.now() - sessionLastActivity) / TIME.MS_PER_SECOND;
      const effectiveExpiry = sessionExpiresIn - TIME.SESSION_BUFFER_SECONDS;
      return elapsedSeconds >= effectiveExpiry;
    },

    updateSessionActivity: () => {
      set((state) => {
        state.sessionLastActivity = Date.now();
      });
    },

    // File attachment actions
    addAttachment: (attachment: FileAttachment) => {
      set((state) => {
        state.attachments.push(attachment);
      });
    },

    updateAttachmentProgress: (id: string, progress: number) => {
      set((state) => {
        const index = state.attachments.findIndex((a) => a.id === id);
        if (index !== -1) {
          state.attachments[index].progress = progress;
        }
        // Calculate overall progress
        const total = state.attachments.reduce(
          (acc, a) => acc + (a.progress || 0),
          0,
        );
        state.uploadProgress = Math.round(total / state.attachments.length);
      });
    },

    updateAttachmentStatus: (
      id: string,
      status: FileUploadStatus,
      error?: string,
    ) => {
      set((state) => {
        const index = state.attachments.findIndex((a) => a.id === id);
        if (index !== -1) {
          state.attachments[index].status = status;
          if (error) {
            state.attachments[index].error = error;
          }
          if (status === FileUploadStatus.SUCCESS) {
            state.attachments[index].progress = 100;
          }
        }
      });
    },

    removeAttachment: (id: string) => {
      set((state) => {
        state.attachments = state.attachments.filter((a) => a.id !== id);
        // Recalculate overall progress
        if (state.attachments.length > 0) {
          const total = state.attachments.reduce(
            (acc, a) => acc + (a.progress || 0),
            0,
          );
          state.uploadProgress = Math.round(total / state.attachments.length);
        } else {
          state.uploadProgress = 0;
        }
      });
    },

    clearAttachments: () => {
      set((state) => {
        state.attachments = [];
        state.uploadProgress = 0;
        state.isUploading = false;
      });
    },

    setUploading: (isUploading: boolean) => {
      set((state) => {
        state.isUploading = isUploading;
      });
    },

    setDraggingOver: (isDragging: boolean) => {
      set((state) => {
        state.isDraggingOver = isDragging;
      });
    },
  })),
);
