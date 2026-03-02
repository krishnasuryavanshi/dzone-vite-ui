# SSE Service Documentation

A reusable Server-Sent Events (SSE) service for handling real-time streaming connections with automatic reconnection, token management, and connection lifecycle handling.

## Overview

The SSE service (`/src/services/sse-service.ts`) provides:

- Generic typed SSE connections
- Automatic token management via token store
- Auto-reconnection on connection failure (10s delay)
- Connection lifecycle management (connect, disconnect, cleanup)
- Custom data parsing support

## How It Works

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Component      │────▶│   SSE Service    │────▶│  Backend SSE    │
│  (Consumer)     │     │                  │     │  Endpoint       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌──────────────────┐
        │               │   Token Store    │
        │               │  (Auth Token)    │
        │               └──────────────────┘
        │
        ▼
┌─────────────────┐
│  Zustand Store  │
│  (State Update) │
└─────────────────┘
```

### Connection Flow

1. **Connect**: Call `connectSSE()` with connection ID, endpoint, and callbacks
2. **Token Fetch**: Service gets auth token from token store (fetches once, caches)
3. **Stream**: Axios makes streaming request with `adapter: 'fetch'`
4. **Parse**: SSE messages are parsed and passed to `onMessage` callback
5. **Reconnect**: On error, auto-reconnects after 10 seconds (unless intentionally disconnected)
6. **Disconnect**: Call `disconnectSSE()` to close connection and prevent reconnection

## API Reference

### connectSSE<T>

Establishes an SSE connection.

```typescript
function connectSSE<T>(
  connectionId: string,
  endpoint: string,
  config: SSEConnectionConfig<T>,
): void;
```

**Parameters:**

- `connectionId`: Unique identifier for the connection (used for disconnect/tracking)
- `endpoint`: Full URL to the SSE endpoint
- `config`: Configuration object with callbacks

**Config Options:**

```typescript
interface SSEConnectionConfig<T> {
  onMessage: (data: T) => void; // Called for each parsed message
  onError?: (error: Error) => void; // Called on connection error
  parseData?: (raw: unknown) => T | null; // Custom parser (optional)
}
```

### disconnectSSE

Closes a specific SSE connection.

```typescript
function disconnectSSE(connectionId: string): void;
```

### disconnectAllSSE

Closes all active SSE connections (useful for cleanup on logout/unmount).

```typescript
function disconnectAllSSE(): void;
```

### isSSEConnected

Checks if a connection is currently active.

```typescript
function isSSEConnected(connectionId: string): boolean;
```

## Usage Examples

### Example 1: Job Monitoring (Current Implementation)

```typescript
// jobs-container.tsx
import {
  connectSSE,
  disconnectSSE,
  disconnectAllSSE,
} from '@/services/sse-service';
import { ApiHost } from '@/lib/constants';

interface IJobSSEUpdate {
  jobId: string;
  status: string;
  // ... other fields
}

// Connect to job stream
const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${ApiHost.JobMonitoringService}/sse/jobs/${jobId}/stream`;

connectSSE<IJobSSEUpdate>(jobId, endpoint, {
  onMessage: (data) => {
    // Update store with new data
    updateJobWithSteps(data);

    // Disconnect when job completes
    if (TERMINAL_STATUSES.includes(data.status)) {
      disconnectSSE(data.jobId);
    }
  },
  onError: (error) => {
    console.error('SSE error:', error);
  },
});

// Cleanup on unmount
useEffect(() => {
  return () => {
    disconnectAllSSE();
  };
}, []);
```

### Example 2: Chatbot Response Streaming (Future Use)

```typescript
// chatbot-container.tsx
import { connectSSE, disconnectSSE } from '@/services/sse-service';
import { ApiHost } from '@/lib/constants';
import { useChatStore } from '../store/use-chat-store';

interface IChatSSEMessage {
  messageId: string;
  content: string;
  isComplete: boolean;
  // ... other fields
}

const ChatbotContainer = () => {
  const { appendMessage, setMessageComplete } = useChatStore();
  const connectionIdRef = useRef<string | null>(null);

  const startStreaming = (conversationId: string, userMessage: string) => {
    // Generate unique connection ID
    const connectionId = `chat-${conversationId}-${Date.now()}`;
    connectionIdRef.current = connectionId;

    // Build endpoint
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/${ApiHost.ChatService}/sse/conversations/${conversationId}/stream`;

    // Connect to SSE
    connectSSE<IChatSSEMessage>(connectionId, endpoint, {
      onMessage: (data) => {
        // Append streaming content to message
        appendMessage(data.messageId, data.content);

        // Mark complete when done
        if (data.isComplete) {
          setMessageComplete(data.messageId);
          disconnectSSE(connectionId);
        }
      },
      onError: (error) => {
        console.error('Chat stream error:', error);
        // Show error in UI
      },
    });
  };

  const stopStreaming = () => {
    if (connectionIdRef.current) {
      disconnectSSE(connectionIdRef.current);
      connectionIdRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopStreaming();
  }, []);

  return (
    // ... chat UI
  );
};
```

### Example 3: Custom Data Parsing

If your SSE endpoint returns data in a different format, use `parseData`:

```typescript
interface RawSSEData {
  payload: {
    nested: {
      actualData: MyDataType;
    };
  };
}

connectSSE<MyDataType>('my-connection', endpoint, {
  onMessage: (data) => {
    // data is already MyDataType
    handleData(data);
  },
  parseData: (raw) => {
    // Custom extraction logic
    const typed = raw as RawSSEData;
    return typed?.payload?.nested?.actualData || null;
  },
});
```

## SSE Message Format

The service expects standard SSE format:

```
data: {"jobId": "123", "status": "IN_PROGRESS", ...}

data: {"jobId": "123", "status": "SUCCESS", ...}

```

Messages are delimited by double newlines (`\n\n`). The service automatically:

1. Buffers incoming data
2. Splits on `\n\n`
3. Extracts JSON from `data:` lines
4. Unwraps nested `data` property if present (e.g., `{data: {...}}` → `{...}`)

## Token Management

### Two Token Systems

The application uses two separate token management systems:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TOKEN ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │   NextAuth Session   │          │     Token Store      │                │
│  │   (Server-side)      │          │   (Client-side)      │                │
│  ├──────────────────────┤          ├──────────────────────┤                │
│  │ • HTTP-only cookie   │          │ • Zustand in-memory  │                │
│  │ • Encrypted token    │  ─────▶  │ • Decrypted token    │                │
│  │ • Managed by NextAuth│  fetch   │ • For SSE streams    │                │
│  │ • Auto-refresh       │          │ • Manual clear       │                │
│  └──────────────────────┘          └──────────────────────┘                │
│           │                                   │                             │
│           ▼                                   ▼                             │
│    Backend API calls                   SSE Connections                      │
│    (via nextBackendRequest)            (via sse-service)                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Token Flow by Scenario

#### 1. Login

```
User enters credentials
        │
        ▼
┌─────────────────────┐
│  NextAuth signIn()  │
│  POST /api/auth/... │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Backend validates   │
│ Returns JWT token   │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ NextAuth encrypts   │
│ token & stores in   │
│ HTTP-only cookie    │
└─────────────────────┘
        │
        ▼
Token Store: EMPTY (not fetched yet)
SSE: Will fetch on first connection
```

#### 2. First SSE Connection (After Login)

```
SSE service needs token
        │
        ▼
┌─────────────────────┐
│ Token Store checks  │
│ accessToken: null   │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Calls /api/auth/    │
│ token (Next.js API) │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Server reads session│
│ cookie, decrypts    │
│ token, returns it   │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Token Store caches  │
│ accessToken: "xyz"  │
└─────────────────────┘
        │
        ▼
All subsequent SSE connections
use cached token (no API call)
```

#### 3. Page Refresh

```
Browser reloads page
        │
        ▼
┌─────────────────────┐
│ Zustand store reset │
│ accessToken: null   │
│ (in-memory cleared) │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ NextAuth session    │
│ cookie still valid  │
│ (HTTP-only, persists)│
└─────────────────────┘
        │
        ▼
Next SSE connection will
fetch token again (one API call)
```

**Key Point**: Token store is in-memory only. Page refresh clears it, but NextAuth session persists in cookie. Token is re-fetched on next SSE connection.

#### 4. Logout

```
User clicks logout
        │
        ▼
┌─────────────────────┐
│ logout() function   │
│ in auth.ts          │
└─────────────────────┘
        │
        ├──▶ nextBackendRequest({ resource: Logout })
        │    (Invalidates token on backend)
        │
        ├──▶ signOut({ redirect: false })
        │    (Clears NextAuth session cookie)
        │
        ├──▶ usePermissionsStore.clearPermissions()
        │    (Clears cached permissions)
        │
        └──▶ useTokenStore.clearToken()
             (Clears cached SSE token)
        │
        ▼
Both token systems cleared
Redirect to /login
```

#### 5. 401 Unauthorized Response

```
API returns 401
        │
        ▼
┌─────────────────────────────┐
│ nextBackendRequest catches  │
│ error.status === 401        │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ await signOut({ redirect:   │
│ false })                    │
│ (Clears NextAuth session)   │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│ Redirect to /login with     │
│ return URL preserved        │
│ window.location.href =      │
│ `/login?to=${currentPath}`  │
└─────────────────────────────┘

Note: Token store is NOT explicitly cleared
(Page redirect clears in-memory store anyway)
```

**Location**: `/src/services/backend-request.ts:29-34`

```typescript
if (error.status === 401 || error.status === 403) {
  await signOut({ redirect: false });
  const to = `${window.location.pathname}${window.location.search}`;
  window.location.href = `/login?to=${to}`;
}
```

#### 6. 403 Forbidden Response

Same behavior as 401 - user is signed out and redirected to login.

This handles cases where:

- Token is valid but user lacks permission
- Token has been revoked on backend
- Role/permission changes require re-authentication

### Token Store API

```typescript
import { useTokenStore } from 'src/stores/token-store';

// Get token (fetches if not cached)
const token = await useTokenStore.getState().getToken();

// Force fetch new token
const token = await useTokenStore.getState().fetchToken();

// Clear cached token (call on logout)
useTokenStore.getState().clearToken();

// Check current state
const { accessToken, isLoading, error } = useTokenStore.getState();
```

### Summary Table

| Scenario          | NextAuth Session           | Token Store         | Action                       |
| ----------------- | -------------------------- | ------------------- | ---------------------------- |
| **Login**         | Created (cookie)           | Empty               | Token fetched on first SSE   |
| **Page Refresh**  | Persists (cookie)          | Cleared (memory)    | Token re-fetched on next SSE |
| **Logout**        | Cleared                    | Cleared             | Both explicitly cleared      |
| **401 Response**  | Cleared                    | Cleared (redirect)  | Sign out + redirect to login |
| **403 Response**  | Cleared                    | Cleared (redirect)  | Sign out + redirect to login |
| **Token Expired** | Auto-refreshed by NextAuth | Stale until cleared | Re-fetch on next SSE         |

## Error Handling & Reconnection

- On connection error, the service waits 10 seconds then auto-reconnects
- Intentional disconnects (via `disconnectSSE`) prevent reconnection
- Cancelled requests (user navigates away) are silently ignored

## Best Practices

1. **Use unique connection IDs**: Include entity ID + timestamp for uniqueness
2. **Clean up on unmount**: Always call `disconnectSSE` or `disconnectAllSSE` in cleanup
3. **Handle terminal states**: Disconnect when stream is complete to free resources
4. **Type your data**: Use TypeScript generics for type-safe message handling
5. **Track connections**: Use refs to track active connection IDs for manual disconnect

## Files

- `/src/services/sse-service.ts` - Main SSE service
- `/src/services/streaming-axios.ts` - Axios instance for streaming (no interceptors)
- `/src/stores/token-store/use-token-store.ts` - Token caching store
