import { TIME } from '../constants';

export const getRelativeTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();

  if (diff < TIME.MS_PER_MINUTE) return 'Just now';
  if (diff < TIME.MS_PER_HOUR)
    return `${Math.floor(diff / TIME.MS_PER_MINUTE)} min ago`;
  if (diff < TIME.MS_PER_DAY)
    return `${Math.floor(diff / TIME.MS_PER_HOUR)} hour ago`;
  return `${Math.floor(diff / TIME.MS_PER_DAY)} day ago`;
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / TIME.MS_PER_SECOND);
  return `${seconds}s`;
};

export const isSessionExpiredCheck = (
  sessionLastActivity: number | null,
  sessionExpiresIn: number | null,
): boolean => {
  if (!sessionLastActivity || !sessionExpiresIn) {
    return true;
  }
  const elapsedSeconds =
    (Date.now() - sessionLastActivity) / TIME.MS_PER_SECOND;
  const effectiveExpiry = sessionExpiresIn - TIME.SESSION_BUFFER_SECONDS;
  return elapsedSeconds >= effectiveExpiry;
};
