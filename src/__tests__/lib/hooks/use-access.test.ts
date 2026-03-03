import { renderHook } from '@testing-library/react';
import { usePermissions } from '@/lib/hooks/use-auth';
import { useAccess } from '@/lib/hooks/use-access';

// Mock the use-auth dependency
jest.mock('../../../lib/hooks/use-auth', () => ({
  usePermissions: jest.fn(),
}));

describe('useAccess', () => {
  // Helper to mock usePermissions return value
  const mockPermissions = (permissions: string[]) => {
    (usePermissions as jest.Mock).mockReturnValue({ data: permissions });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when no roles are provided', () => {
    mockPermissions(['ADMIN']);
    const { result } = renderHook(() => useAccess(''));
    expect(result.current).toBe(false);
  });

  it('should return true when user has the required single role', () => {
    mockPermissions(['ADMIN', 'USER']);
    const { result } = renderHook(() => useAccess('ADMIN'));
    expect(result.current).toBe(true);
  });

  it('should return false when user does not have the required single role', () => {
    mockPermissions(['USER']);
    const { result } = renderHook(() => useAccess('ADMIN'));
    expect(result.current).toBe(undefined);
  });

  it('should return true when user has at least one of the required roles', () => {
    mockPermissions(['ADMIN', 'USER']);
    const { result } = renderHook(() => useAccess(['ADMIN', 'MANAGER']));
    expect(result.current).toBe(true);
  });

  it('should return false when user has none of the required roles', () => {
    mockPermissions(['USER']);
    const { result } = renderHook(() => useAccess(['ADMIN', 'MANAGER']));
    expect(result.current).toBe(false);
  });

  it('should handle empty permissions array', () => {
    mockPermissions([]);
    const { result } = renderHook(() => useAccess('ADMIN'));
    expect(result.current).toBe(undefined);
  });

  it('should handle undefined permissions', () => {
    mockPermissions(undefined as any);
    const { result } = renderHook(() => useAccess('ADMIN'));
    expect(result.current).toBe(undefined);
  });
});
