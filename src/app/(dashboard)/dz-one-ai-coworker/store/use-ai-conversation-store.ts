import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ConversationMetadata, MarketerOption } from '../lib/types';
import { DEFAULT_TEXT } from '../lib/constants';
import { fetchConversationList } from '../services/conversation';

export interface AiConversationState {
  conversationHistory: ConversationMetadata[];
  currentConversationId: string | null;
  currentConversationTitle: string;
  isLoadingHistory: boolean;
  isLoadingConversation: boolean;
  // Marketer selection
  tenantCode: string | null;
  marketerList: MarketerOption[] | null;
  isTenantUnavailable: boolean;
  // Chat history pagination
  chatHistoryPage: number;
  chatHistoryTotalPages: number;
  chatHistoryTotal: number;
  hasMoreMessages: boolean;
  isLoadingMoreMessages: boolean;
}

export interface AiConversationActions {
  fetchConversationHistory: () => Promise<void>;
  setCurrentConversation: (id: string | null, title: string) => void;
  setCurrentConversationTitle: (title: string) => void;
  addNewConversation: (conversationId: string, title?: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  updateConversationMessageCount: (conversationId: string) => void;
  removeConversation: (conversationId: string) => void;
  setLoadingConversation: (loading: boolean) => void;
  // Marketer actions
  setTenantCode: (tenantCode: string | null) => void;
  setMarketerList: (marketerList: MarketerOption[] | null) => void;
  setTenantUnavailable: (unavailable: boolean) => void;
  // Pagination actions
  setPagination: (
    page: number,
    totalPages: number,
    total: number,
    hasMore: boolean,
  ) => void;
  setLoadingMoreMessages: (loading: boolean) => void;
  resetPagination: () => void;
}

export type AiConversationStore = AiConversationState & AiConversationActions;

const initialConversationState: AiConversationState = {
  conversationHistory: [],
  currentConversationId: null,
  currentConversationTitle: DEFAULT_TEXT.NEW_CHAT,
  isLoadingHistory: false,
  isLoadingConversation: false,
  tenantCode: null,
  marketerList: null,
  isTenantUnavailable: false,
  chatHistoryPage: 0,
  chatHistoryTotalPages: 0,
  chatHistoryTotal: 0,
  hasMoreMessages: false,
  isLoadingMoreMessages: false,
};

export const useAiConversationStore = create<AiConversationStore>()(
  immer((set, get) => ({
    ...initialConversationState,

    fetchConversationHistory: async () => {
      set((state) => {
        state.isLoadingHistory = true;
      });

      const conversations = await fetchConversationList();

      set((state) => {
        state.conversationHistory = conversations;
        state.isLoadingHistory = false;
      });
    },

    setCurrentConversation: (id: string | null, title: string) => {
      set((state) => {
        state.currentConversationId = id;
        state.currentConversationTitle = title;
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
        const newConversation: ConversationMetadata = {
          id: conversationId,
          title: conversationTitle,
          tenantCode: tenantCode || '',
          messageCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.conversationHistory.unshift(newConversation);
        state.currentConversationId = conversationId;
        state.currentConversationTitle = conversationTitle;
      });
    },

    updateConversationTitle: (conversationId: string, title: string) => {
      set((state) => {
        const index = state.conversationHistory.findIndex(
          (c) => c.id === conversationId,
        );
        if (index !== -1) {
          state.conversationHistory[index].title = title;
          state.conversationHistory[index].updatedAt = new Date().toISOString();
        }
        if (state.currentConversationId === conversationId) {
          state.currentConversationTitle = title;
        }
      });
    },

    updateConversationMessageCount: (conversationId: string) => {
      set((state) => {
        const index = state.conversationHistory.findIndex(
          (c) => c.id === conversationId,
        );
        if (index !== -1) {
          state.conversationHistory[index].messageCount += 1;
          state.conversationHistory[index].updatedAt = new Date().toISOString();
          // Move to top if not already
          if (index > 0) {
            const [conversation] = state.conversationHistory.splice(index, 1);
            state.conversationHistory.unshift(conversation);
          }
        }
      });
    },

    removeConversation: (conversationId: string) => {
      set((state) => {
        state.conversationHistory = state.conversationHistory.filter(
          (c) => c.id !== conversationId,
        );
      });
    },

    setLoadingConversation: (loading: boolean) => {
      set((state) => {
        state.isLoadingConversation = loading;
      });
    },

    setTenantCode: (tenantCode: string | null) => {
      set((state) => {
        state.tenantCode = tenantCode;
        state.isTenantUnavailable = false;
      });
    },

    setMarketerList: (marketerList: MarketerOption[] | null) => {
      set((state) => {
        state.marketerList = marketerList;
      });
    },

    setTenantUnavailable: (unavailable: boolean) => {
      set((state) => {
        state.isTenantUnavailable = unavailable;
      });
    },

    setPagination: (
      page: number,
      totalPages: number,
      total: number,
      hasMore: boolean,
    ) => {
      set((state) => {
        state.chatHistoryPage = page;
        state.chatHistoryTotalPages = totalPages;
        state.chatHistoryTotal = total;
        state.hasMoreMessages = hasMore;
      });
    },

    setLoadingMoreMessages: (loading: boolean) => {
      set((state) => {
        state.isLoadingMoreMessages = loading;
      });
    },

    resetPagination: () => {
      set((state) => {
        state.chatHistoryPage = 0;
        state.chatHistoryTotalPages = 0;
        state.chatHistoryTotal = 0;
        state.hasMoreMessages = false;
        state.isLoadingMoreMessages = false;
      });
    },
  })),
);
