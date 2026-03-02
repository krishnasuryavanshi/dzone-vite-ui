import { DzRecord } from '@/lib/types';
import {
  MessageRole,
  FileUploadStatus,
  StreamEventType,
  ChartType,
} from '../enums';

// Re-export enums for convenience
export {
  MessageRole,
  FileUploadStatus,
  StreamEventType,
  ChartType,
} from '../enums';

export interface FileAttachment {
  id: string; // UUID from upload API
  name: string;
  size: number;
  type: string;
  status: FileUploadStatus;
  progress?: number; // 0-100
  error?: string;
  previewUrl?: string; // Blob URL for image previews
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
  thinkingContent?: string;
  thinkingDuration?: number;
  progressSteps?: string[];
  progressDuration?: number;
  attachments?: FileAttachment[];
}

export interface ChartData {
  type: ChartType;
  title?: string;
  data: DzRecord[];
  config?: {
    xKey?: string;
    yKeys?: string[];
    colors?: string[];
  };
}

export interface StreamChunk {
  _eventType: StreamEventType;
  // conversation_created & title_update
  conversationId?: string;
  // title_update only
  title?: string;
  // progress
  stage?: string;
  message?: string;
  // message & done
  content?: string;
  // error
  error?: string;
  message_id?: string;
}

// Conversation types
export interface ConversationMetadata {
  id: string;
  title: string;
  tenantCode: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketerOption {
  label: string;
  value: string;
}

// Chat History Types (from conversation.ts)
export interface ChatHistoryAttachment {
  id: string;
  name: string;
}

export interface ChatHistoryMessage {
  id: string;
  role: 'user' | 'assistant'; // String literals for API compatibility
  content: string;
  timestamp: string;
  attachments?: ChatHistoryAttachment[];
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
  hasMore: boolean;
  nextPage: number;
}

// Session Types (from session.ts)
export interface SessionInitResponse {
  success: boolean;
  sessionId: string | null;
  conversationId: string | null;
  hasAccess: boolean;
  expiresIn: number;
  history: ChatHistoryMessage[];
  error: string | null;
}

// File Upload Types (from file-upload.ts)
export interface FileUploadResult {
  id: string;
  name: string;
  size: string;
  type: string;
  fileKey: string;
}

// Conversation filter type
export type ConversationFilterType = 'current' | 'all';

// Background stream buffer for when user switches away from a streaming conversation
export interface BackgroundStreamBuffer {
  conversationId: string;
  messages: ChatMessage[];
  currentStreamingMessageId: string;
  isThinking: boolean;
  thinkingStartTime: number | null;
  currentThinkingContent: string;
  isProcessing: boolean;
  processingStartTime: number | null;
  currentProgressSteps: string[];
}

// Store State Types
export interface AiAgentState {
  messages: ChatMessage[];
  streamingConversationId: string | null;
  backgroundStreamBuffer: BackgroundStreamBuffer | null;
  isThinking: boolean;
  thinkingStartTime: number | null;
  currentStreamingMessageId: string | null;
  currentThinkingContent: string;
  // Progress tracking
  isProcessing: boolean;
  processingStartTime: number | null;
  currentProgressSteps: string[];
  inputDisabled: boolean;
  // Conversation history
  conversationHistory: ConversationMetadata[];
  currentConversationId: string | null;
  currentConversationTitle: string;
  isLoadingHistory: boolean;
  isLoadingConversation: boolean;
  conversationFilter: ConversationFilterType;
  // Marketer selection
  tenantCode: string | null;
  marketerList: MarketerOption[] | null;
  isTenantUnavailable: boolean; // True when loaded conversation's tenant is not in marketer list
  // Session
  sessionId: string | null;
  isInitializingSession: boolean;
  sessionExpiresIn: number | null;
  sessionLastActivity: number | null;
  // Chat history pagination
  chatHistoryPage: number;
  chatHistoryTotalPages: number;
  chatHistoryTotal: number;
  hasMoreMessages: boolean;
  isLoadingMoreMessages: boolean;
  // File attachments
  attachments: FileAttachment[];
  isUploading: boolean;
  uploadProgress: number;
  // Drag and drop
  isDraggingOver: boolean;
}

export interface AiAgentActions {
  addUserMessage: (content: string, attachments?: FileAttachment[]) => void;
  startAssistantMessage: () => string;
  setAssistantMessageContent: (content: string) => void;
  setAssistantMessageError: (error: string) => void;
  appendThinkingContent: (content: string) => void;
  finishAssistantMessage: () => void;
  setThinking: (isThinking: boolean) => void;
  addProgressStep: (message: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  clearThinkingContent: () => void;
  saveToBackgroundBuffer: () => void;
  restoreFromBackgroundBuffer: (conversationId: string) => boolean;
  reset: () => void;
  // Conversation history actions
  fetchConversationHistory: () => Promise<void>;
  loadConversation: (conversation: ConversationMetadata) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  createNewConversation: () => void;
  setCurrentConversationTitle: (title: string) => void;
  addNewConversation: (conversationId: string, title?: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  // Conversation filter actions
  setConversationFilter: (filter: ConversationFilterType) => void;
  // Marketer selection actions
  setTenantCode: (tenantCode: string | null) => void;
  setMarketerList: (marketerList: MarketerOption[] | null) => void;
  setTenantUnavailable: (unavailable: boolean) => void;
  // Session actions
  initSession: (
    tenantCode: string,
    conversationId?: string,
  ) => Promise<boolean>;
  setSessionId: (sessionId: string | null) => void;
  isSessionExpired: () => boolean;
  updateSessionActivity: () => void;
  // File attachment actions
  addAttachment: (attachment: FileAttachment) => void;
  updateAttachmentProgress: (id: string, progress: number) => void;
  updateAttachmentStatus: (
    id: string,
    status: FileUploadStatus,
    error?: string,
  ) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  setUploading: (isUploading: boolean) => void;
  setDraggingOver: (isDragging: boolean) => void;
}

export type AiAgentStore = AiAgentState & AiAgentActions;
