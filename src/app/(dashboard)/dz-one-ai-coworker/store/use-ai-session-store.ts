import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { initSession as initSessionService } from '../services/session';
import { TIME } from '../lib/constants';

export interface AiSessionState {
  sessionId: string | null;
  isInitializingSession: boolean;
  sessionExpiresIn: number | null;
  sessionLastActivity: number | null;
}

export interface AiSessionActions {
  initSession: (
    tenantCode: string,
    conversationId?: string,
  ) => Promise<boolean>;
  setSessionId: (sessionId: string | null) => void;
  isSessionExpired: () => boolean;
  updateSessionActivity: () => void;
  clearSession: () => void;
}

export type AiSessionStore = AiSessionState & AiSessionActions;

const initialSessionState: AiSessionState = {
  sessionId: null,
  isInitializingSession: false,
  sessionExpiresIn: null,
  sessionLastActivity: null,
};

export const useAiSessionStore = create<AiSessionStore>()(
  immer((set, get) => ({
    ...initialSessionState,

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
        return true;
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

    clearSession: () => {
      set((state) => {
        state.sessionId = null;
        state.sessionExpiresIn = null;
        state.sessionLastActivity = null;
      });
    },
  })),
);
