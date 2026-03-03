import React, { useState } from 'react';
import { IPacingChartType } from '../../lib/types';
import { Button } from '@/uicomponents/button';
import { PacingChartDrawer } from '../create-new-line-item/pacing-chart-drawer';
import { PacingPeriod } from '../../services';
import { CLR_BLUE_PRIMARY } from '@/lib/constants';

interface ShowPacingChartPreviewProps {
  value?: PacingPeriod[];
  label?: string;
  lineItemData?: {
    targetLeadGoal?: number;
    lineItemTargetStartDate?: string;
    targetDeliveryStartDate?: string;
    lineItemTargetEndDate?: string;
    pacingSchedule?: string;
    pacing?: string;
    allowOverflow?: boolean;
    deficitManagement?: boolean;
  };
}

export const ShowPacingChartPreview: React.FC<ShowPacingChartPreviewProps> = ({
  value = [],
  label,
  lineItemData,
}) => {
  const [open, setOpen] = useState(false);

  if (!Array.isArray(value) || value.length === 0) return null;

  return (
    <>
      <Button
        type='link'
        style={{ padding: 0, color: CLR_BLUE_PRIMARY }}
        onClick={() => setOpen(true)}>
        View
      </Button>
      <PacingChartDrawer
        open={open}
        onClose={() => setOpen(false)}
        customPacingData={value}
        targetLeadGoal={lineItemData?.targetLeadGoal}
        lineItemTargetStartDate={lineItemData?.lineItemTargetStartDate}
        targetDeliveryStartDate={lineItemData?.targetDeliveryStartDate}
        lineItemTargetEndDate={lineItemData?.lineItemTargetEndDate}
        pacingSchedule={lineItemData?.pacingSchedule}
        pacing={lineItemData?.pacing}
        allowOverflow={lineItemData?.allowOverflow}
        deficitManagement={lineItemData?.deficitManagement}
        overflowDisabledPermanently={lineItemData?.allowOverflow}
        isPreviewMode={true}
      />
    </>
  );
};
