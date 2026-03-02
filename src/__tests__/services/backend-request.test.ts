import { signOut } from 'next-auth/react';
import { HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { IApiRequestConfig } from '@/lib/types';
import { backendRequest } from '@/services/back-end-manager';
import { nextBackendRequest } from '@/services/backend-request';
import { showNotification } from '@/services';

// Mock dependencies
jest.mock('../../services/back-end-manager');
jest.mock('../../services/notification');
jest.mock('next-auth/react');

describe('nextBackendRequest', () => {
  // Mock window.location
  const originalLocation = window.location;
  beforeAll(() => {
    window.location = {
      ...originalLocation,
      pathname: '/test-path',
      search: '?query=test',
      href: 'http://localhost',
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a successful request and return data', async () => {
    const mockResponse = { data: { success: true } };
    (backendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const result = await nextBackendRequest({
      resource: 'test',
    });

    expect(result).toEqual({ success: true });
    expect(backendRequest).toHaveBeenCalledWith({
      logRequest: false,
      method: HttpMethod.GET,
      isAuthenticated: false,
      apiHost: ApiHost.BackendService,
      apiVersion: '/api',
      resource: 'test',
    });
  });

  it('should return full response when includeResponseHeaders is true', async () => {
    const mockResponse = {
      data: { success: true },
      headers: { 'content-type': 'application/json' },
    };
    (backendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const result = await nextBackendRequest({
      resource: 'test',
      includeResponseHeaders: true,
    } as IApiRequestConfig);

    expect(result).toEqual(mockResponse);
  });

  it('should show notification and throw error message when error contains message', async () => {
    const error = {
      data: {
        message: 'Test error message',
        messageHeader: 'Error Header',
      },
    };
    (backendRequest as jest.Mock).mockRejectedValue(error);

    await expect(
      nextBackendRequest({
        resource: '/test',
      }),
    ).rejects.toEqual('Test error message');

    expect(showNotification).toHaveBeenCalledWith({
      message: 'Test error message',
      messageHeader: 'Error Header',
      type: 'error',
    });
  });

  it('should throw original error when error does not contain message', async () => {
    const error = new Error('Unknown error');
    (backendRequest as jest.Mock).mockRejectedValue(error);

    await expect(
      nextBackendRequest({
        resource: '/test',
      }),
    ).rejects.toEqual(error);

    expect(showNotification).not.toHaveBeenCalled();
  });
});
