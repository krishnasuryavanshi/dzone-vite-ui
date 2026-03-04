import { useTokenStore } from '@/stores/token-store';
import { StreamChunk, StreamEventType } from '../lib/types';

export type StreamCallback = (chunk: StreamChunk) => void;

// Store active abort controllers for cancellation
const activeStreams = new Map<string, AbortController>();

function parseSSEEvent(text: string): StreamChunk | null {
  const lines = text.split('\n');
  let eventType: StreamEventType | null = null;
  let data: Record<string, unknown> | null = null;

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim() as StreamEventType;
    } else if (line.startsWith('data:')) {
      const jsonStr = line.slice(5).trim();
      if (jsonStr) {
        try {
          data = JSON.parse(jsonStr);
        } catch {
          data = null;
        }
      }
    }
  }

  if (eventType && data) {
    return { _eventType: eventType, ...data } as StreamChunk;
  }
  return null;
}

export const streamChatDirect = async (
  message: string,
  sessionId: string | null,
  fileIds: string[] | undefined,
  onChunk: StreamCallback,
  onComplete: () => void,
  onError: (error: Error) => void,
): Promise<string> => {
  // Validate sessionId upfront
  if (!sessionId) {
    onError(new Error('Session not initialized. Please refresh and try again.'));
    return '';
  }

  const connectionId = `ai-chat-${Date.now()}`;
  const abortController = new AbortController();
  activeStreams.set(connectionId, abortController);

  try {
    // Get API URL dynamically from token store
    const tokenStore = useTokenStore.getState();
    const token = await tokenStore.getToken();
    const apiUrl = await tokenStore.getApiUrl();

    if (!token) {
      throw new Error('No access token available');
    }

    if (!apiUrl) {
      throw new Error('API URL not configured');
    }

    const AI_SERVICE_URL = `${apiUrl}/api/coworker/chat/stream`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }

    const body: { message: string; fileIds?: string[] } = { message };
    if (fileIds && fileIds.length > 0) {
      body.fileIds = fileIds;
    }

    const response = await fetch(AI_SERVICE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        if (event.trim()) {
          const chunk = parseSSEEvent(event);
          if (chunk) {
            onChunk(chunk);
            if (chunk._eventType === 'done') {
              activeStreams.delete(connectionId);
              onComplete();
              return connectionId;
            }
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      const chunk = parseSSEEvent(buffer);
      if (chunk) {
        onChunk(chunk);
      }
    }

    activeStreams.delete(connectionId);
    onComplete();
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      onError(error as Error);
    }
  } finally {
    activeStreams.delete(connectionId);
  }

  return connectionId;
};

export const cancelStream = (connectionId: string): void => {
  const controller = activeStreams.get(connectionId);
  if (controller) {
    controller.abort();
    activeStreams.delete(connectionId);
  }
};
