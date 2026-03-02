'use client';
import React, { FC } from 'react';
import { CLR_BLUE_LIGHT, DZONE_CLR_BLACK } from '@/lib/constants';
import { Drawer } from '@/uicomponents/drawers';
import { CloseOutlined, LoadingOutlined } from '@/uicomponents/icons';
import { PacingLists } from './pacing-lists';
import { IPacingChartType } from '../../../lib/types';
import { Spin } from '@/uicomponents/spin';

interface PacingChartDrawerProps {
  open: boolean;
  onClose: () => void;
  pacingSchedule: IPacingChartType[];
}

export const PacingChartDrawer: FC<PacingChartDrawerProps> = ({
  open,
  onClose,
  pacingSchedule,
}) => {
  return (
    <Drawer
      title={<span style={{ color: '#fff' }}>Pacing Chart</span>}
      placement='right'
      width={800}
      style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
      onClose={onClose}
      open={open}
      headerStyle={{
        background: DZONE_CLR_BLACK,
      }}
      closeIcon={
        <CloseOutlined
          style={{
            color: '#fff',
          }}
        />
      }>
      <PacingLists pacingData={pacingSchedule} />
    </Drawer>
  );
};
