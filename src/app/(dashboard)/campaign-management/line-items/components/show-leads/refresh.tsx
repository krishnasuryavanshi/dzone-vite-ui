import { DzBox } from '@/components/layout/v1';
import { Button } from '@/uicomponents/button';
import React, { FC } from 'react';
import { RefreshIcon } from '@/uicomponents/icons/svgs';
import styles from './refresh.module.css';
import { DZONE_CLR_BLACK } from '@/lib/constants';

interface IRefreshProps {
  onRefresh: () => void;
}

export const Refresh: FC<IRefreshProps> = ({ onRefresh }) => {
  return (
    <Button
      onClick={onRefresh}
      style={{
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
        border: `1px solid ${DZONE_CLR_BLACK}`,
      }}
      className={styles.refreshButton}
    >
      <RefreshIcon />
    </Button>
  );
};
