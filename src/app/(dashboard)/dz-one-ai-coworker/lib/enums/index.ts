export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum FileUploadStatus {
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum StreamEventType {
  CONVERSATION_CREATED = 'conversation_created',
  TITLE_UPDATE = 'title_update',
  PROGRESS = 'progress',
  MESSAGE = 'message',
  DONE = 'done',
  ERROR = 'error',
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
}

export enum FileIconType {
  IMAGE = 'image',
  PDF = 'pdf',
  DOC = 'doc',
  XLS = 'xls',
  CSV = 'csv',
  TXT = 'txt',
  FILE = 'file',
}
