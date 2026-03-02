import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  ChatMessage,
  FileAttachment,
  MessageRole,
  FileUploadStatus,
} from '../lib/types';
import { generateMessageId } from '../lib/utils/id-utils';

export interface AiChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  isThinking: boolean;
  thinkingStartTime: number | null;
  currentStreamingMessageId: string | null;
  currentThinkingContent: string;
  // Progress tracking
  isProcessing: boolean;
  processingStartTime: number | null;
  currentProgressSteps: string[];
  inputDisabled: boolean;
}

export interface AiChatActions {
  addUserMessage: (content: string, attachments?: FileAttachment[]) => string;
  startAssistantMessage: () => string;
  setAssistantMessageContent: (content: string) => void;
  setAssistantMessageError: (error: string) => void;
  appendThinkingContent: (content: string) => void;
  finishAssistantMessage: () => void;
  setThinking: (isThinking: boolean) => void;
  addProgressStep: (message: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  clearThinkingContent: () => void;
  setInputDisabled: (disabled: boolean) => void;
  setMessages: (messages: ChatMessage[]) => void;
  prependMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  resetChatState: () => void;
}

export type AiChatStore = AiChatState & AiChatActions;

const initialChatState: AiChatState = {
  messages: [],
  isStreaming: false,
  isThinking: false,
  thinkingStartTime: null,
  currentStreamingMessageId: null,
  currentThinkingContent: '',
  isProcessing: false,
  processingStartTime: null,
  currentProgressSteps: [],
  inputDisabled: false,
};

export const useAiChatStore = create<AiChatStore>()(
  immer((set, get) => ({
    ...initialChatState,

    addUserMessage: (content: string, attachments?: FileAttachment[]) => {
      const messageId = generateMessageId();
      const message: ChatMessage = {
        id: messageId,
        role: MessageRole.USER,
        content,
        timestamp: new Date(),
        attachments: attachments?.filter(
          (a) => a.status === FileUploadStatus.SUCCESS,
        ),
      };

      set((state) => {
        state.messages.push(message);
        state.inputDisabled = true;
      });

      return messageId;
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
        state.isStreaming = true;
        state.currentStreamingMessageId = id;
      });
      return id;
    },

    setAssistantMessageContent: (content: string) => {
      set((state) => {
        const messageIndex = state.messages.findIndex(
          (m) => m.id === state.currentStreamingMessageId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].content = content;
        }
      });
    },

    setAssistantMessageError: (error: string) => {
      set((state) => {
        const messageIndex = state.messages.findIndex(
          (m) => m.id === state.currentStreamingMessageId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].content = error;
          state.messages[messageIndex].isError = true;
        }
      });
    },

    appendThinkingContent: (content: string) => {
      set((state) => {
        state.currentThinkingContent += content;
        const messageIndex = state.messages.findIndex(
          (m) => m.id === state.currentStreamingMessageId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].thinkingContent =
            state.currentThinkingContent;
        }
      });
    },

    finishAssistantMessage: () => {
      const {
        thinkingStartTime,
        currentStreamingMessageId,
        processingStartTime,
        currentProgressSteps,
      } = get();
      const thinkingDuration = thinkingStartTime
        ? Date.now() - thinkingStartTime
        : undefined;
      const progressDuration = processingStartTime
        ? Date.now() - processingStartTime
        : undefined;

      set((state) => {
        const messageIndex = state.messages.findIndex(
          (m) => m.id === currentStreamingMessageId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].isStreaming = false;
          if (thinkingDuration) {
            state.messages[messageIndex].thinkingDuration = thinkingDuration;
          }
          if (progressDuration) {
            state.messages[messageIndex].progressDuration = progressDuration;
            state.messages[messageIndex].progressSteps = [
              ...currentProgressSteps,
            ];
          }
        }
        state.isStreaming = false;
        state.isThinking = false;
        state.thinkingStartTime = null;
        state.currentStreamingMessageId = null;
        state.currentThinkingContent = '';
        state.isProcessing = false;
        state.processingStartTime = null;
        state.currentProgressSteps = [];
        state.inputDisabled = false;
      });
    },

    setThinking: (isThinking: boolean) => {
      const {
        thinkingStartTime,
        currentStreamingMessageId,
        isThinking: currentlyThinking,
      } = get();

      set((state) => {
        if (isThinking) {
          if (!currentlyThinking) {
            state.isThinking = true;
            state.thinkingStartTime = Date.now();
          }
        } else {
          state.isThinking = false;
          if (thinkingStartTime) {
            const thinkingDuration = Date.now() - thinkingStartTime;
            const messageIndex = state.messages.findIndex(
              (m) => m.id === currentStreamingMessageId,
            );
            if (messageIndex !== -1) {
              state.messages[messageIndex].thinkingDuration = thinkingDuration;
            }
            state.thinkingStartTime = null;
          }
        }
      });
    },

    addProgressStep: (message: string) => {
      set((state) => {
        if (!state.isProcessing) {
          state.isProcessing = true;
          state.processingStartTime = Date.now();
        }
        state.currentProgressSteps.push(message);
        const messageIndex = state.messages.findIndex(
          (m) => m.id === state.currentStreamingMessageId,
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].progressSteps = [
            ...state.currentProgressSteps,
          ];
        }
      });
    },

    setProcessing: (isProcessing: boolean) => {
      const {
        processingStartTime,
        currentStreamingMessageId,
        currentProgressSteps,
      } = get();

      set((state) => {
        if (!isProcessing && processingStartTime) {
          const progressDuration = Date.now() - processingStartTime;
          const messageIndex = state.messages.findIndex(
            (m) => m.id === currentStreamingMessageId,
          );
          if (messageIndex !== -1) {
            state.messages[messageIndex].progressDuration = progressDuration;
            state.messages[messageIndex].progressSteps = [
              ...currentProgressSteps,
            ];
          }
          state.processingStartTime = null;
        }
        state.isProcessing = isProcessing;
      });
    },

    clearThinkingContent: () => {
      set((state) => {
        state.currentThinkingContent = '';
      });
    },

    setInputDisabled: (disabled: boolean) => {
      set((state) => {
        state.inputDisabled = disabled;
      });
    },

    setMessages: (messages: ChatMessage[]) => {
      set((state) => {
        state.messages = messages;
      });
    },

    prependMessages: (messages: ChatMessage[]) => {
      set((state) => {
        state.messages = [...messages, ...state.messages];
      });
    },

    clearMessages: () => {
      set((state) => {
        state.messages = [];
      });
    },

    resetChatState: () => {
      set(initialChatState);
    },
  })),
);
