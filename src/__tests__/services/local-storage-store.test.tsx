import { StorageKey } from '@/lib/enums';
import { Store as localStorageService } from '../../services/local-storage-store';

const KEY = StorageKey.TestKey;
const TENANT_KEY = `dzone-${KEY}`;

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.removeItem(TENANT_KEY);
  });

  it('should set an item in localStorage', () => {
    localStorageService.set(KEY, 'John Doe');
    expect(localStorage.getItem(TENANT_KEY)).toBe(JSON.stringify('John Doe'));
  });

  it('should get an item from localStorage', () => {
    localStorage.setItem(TENANT_KEY, JSON.stringify('Jane Doe'));

    const name = localStorageService.get(KEY);
    expect(name).toBe('Jane Doe');
  });

  it('should remove an item from localStorage', () => {
    localStorage.setItem(TENANT_KEY, 'John Doe');

    localStorageService.remove(KEY);

    expect(localStorage.getItem(TENANT_KEY)).toBeNull();
  });
});
