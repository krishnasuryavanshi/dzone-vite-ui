'use client';

import { ThunderboltOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { COLORS } from '../lib/constants/colors';
import styles from './thinking-header.module.css';

interface ThinkingHeaderProps {
  isActive: boolean;
  headerText: string;
  seconds: number;
  onToggle: () => void;
}

export const ThinkingHeader = ({
  isActive,
  headerText,
  seconds,
  onToggle,
}: ThinkingHeaderProps) => {
  return (
    <Flex
      align='center'
      gap='0.5rem'
      onClick={onToggle}
      style={{
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
      }}>
      {/* SVG gradient definition */}
      <svg width='0' height='0' style={{ position: 'absolute' }}>
        <defs>
          <linearGradient
            id='thunderboltGradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'>
            <stop offset='0%' stopColor='#ffb8ec' />
            <stop offset='50%' stopColor='#f3d6ff' />
            <stop offset='100%' stopColor='#7d88ff' />
          </linearGradient>
        </defs>
      </svg>
      <span className={isActive ? styles.gradientIcon : undefined}>
        <ThunderboltOutlined
          style={isActive ? undefined : { color: COLORS.GRAY_DARK }}
        />
      </span>
      <span className={isActive ? styles.textGlow : styles.textNormal}>
        {headerText}
      </span>
      <span className={styles.textNormal}>{seconds}s</span>
    </Flex>
  );
};
