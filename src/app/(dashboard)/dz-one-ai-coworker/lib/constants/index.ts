// ID Prefixes
export const ID_PREFIX = {
  MESSAGE: 'msg_',
  CONVERSATION: 'conv_',
  TEMP_FILE: 'temp_',
  CONNECTION: 'ai-chat-',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_COUNT: 5,
  PROGRESS_SIMULATED: 50,
  PROGRESS_COMPLETE: 100,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  SCROLL_THRESHOLD: 100,
} as const;

// Time
export const TIME = {
  MS_PER_SECOND: 1000,
  MS_PER_MINUTE: 60000,
  MS_PER_HOUR: 3600000,
  MS_PER_DAY: 86400000,
  TIMER_INTERVAL: 100,
  SESSION_BUFFER_SECONDS: 60,
} as const;

// UI
export const UI = {
  TITLE_TRUNCATE_LENGTH: 50,
  RANDOM_ID_LENGTH: 9,
} as const;

// Default Text
export const DEFAULT_TEXT = {
  NEW_CHAT: 'New Chat',
  NEW_CONVERSATION: 'New Conversation',
  PLACEHOLDER: 'Ask anything...',
} as const;
