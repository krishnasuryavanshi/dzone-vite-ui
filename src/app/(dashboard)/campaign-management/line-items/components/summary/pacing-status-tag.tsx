'use client';

import { FC } from 'react';
import { Tag } from '@/uicomponents/tag';
import { CheckOutlined, FallOutlined, RiseOutlined } from '@ant-design/icons';
import { PacingSummaryStatus } from '../../lib/types';
import styles from './summary.module.css';

const DotIcon = () => (
  <span
    style={{
      display: 'inline-block',
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    }}
  />
);

const CircleIcon = () => (
  <span
    style={{
      display: 'inline-block',
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      border: '1.5px solid currentColor',
    }}
  />
);

const statusConfig: Record<
  PacingSummaryStatus,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  [PacingSummaryStatus.InProgress]: {
    color: 'var(--dzone-color-status-in-progress)',
    bg: 'var(--dzone-color-status-in-progress-bg)',
    icon: <DotIcon />,
  },
  [PacingSummaryStatus.Deficit]: {
    color: 'var(--dzone-color-status-deficit)',
    bg: 'var(--dzone-color-status-deficit-bg)',
    icon: <FallOutlined />,
  },
  [PacingSummaryStatus.Overflow]: {
    color: 'var(--dzone-color-status-overflow)',
    bg: 'var(--dzone-color-status-overflow-bg)',
    icon: <RiseOutlined />,
  },
  [PacingSummaryStatus.OnTrack]: {
    color: 'var(--dzone-color-status-on-track)',
    bg: 'var(--dzone-color-status-on-track-bg)',
    icon: <CheckOutlined />,
  },
  [PacingSummaryStatus.Upcoming]: {
    color: 'var(--dzone-color-status-upcoming)',
    bg: 'var(--dzone-color-status-upcoming-bg)',
    icon: <CircleIcon />,
  },
};

interface IPacingStatusTagProps {
  status: PacingSummaryStatus;
}

export const PacingStatusTag: FC<IPacingStatusTagProps> = ({ status }) => {
  const config = statusConfig[status];
  if (!config) return null;

  return (
    <Tag
      className={styles.statusTag}
      style={{ color: config.color, backgroundColor: config.bg }}>
      {config.icon}
      {status}
    </Tag>
  );
};
