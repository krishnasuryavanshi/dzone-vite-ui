
import { FC, useCallback } from 'react';
import { Title } from '@/uicomponents/title';
import { Flex } from '@/uicomponents/layout';
import { Button } from '@/uicomponents/button';
import { DownloadOutlined } from '@/uicomponents/icons';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { useLineItemContextStore } from '../../store/use-line-item-context-store';
import { usePacingSummaryStore } from '../../store';
import { exportPacingSummary } from '../../services';
import { usePacingSummaryQuery, usePacingSummaryDataQuery } from '../../hooks';
import { SummaryCards } from './summary-cards';
import { SummaryGrid } from './summary-grid';
import styles from './summary.module.css';

interface ISummaryContainerProps {
  show: boolean;
  lineItemId: string;
}

export const SummaryContainer: FC<ISummaryContainerProps> = ({
  show,
  lineItemId,
}) => {
  const lineItem = useLineItemContextStore((s) => s.lineItem);
  const { pagination } = usePacingSummaryStore();

  const pacingType = lineItem?.pacingSchedule as string;

  const { data: summaryResult } = usePacingSummaryQuery(
    lineItemId,
    show && !!lineItemId,
  );

  const { data: gridResult } = usePacingSummaryDataQuery(
    lineItemId,
    { page: pagination.current - 1, size: pagination.pageSize },
    show && !!lineItemId,
  );

  const summary = summaryResult?.data ?? null;
  const gridData = gridResult?.data ?? [];
  const showDelivered = summary?.delivered !== null && summary?.delivered !== undefined;

  const handleExport = useCallback(() => {
    exportPacingSummary(lineItemId);
  }, [lineItemId]);

  if (!show) return null;

  return (
    <>
      <Flex vertical gap='1rem' className={styles.summaryContainer}>
        <Flex
          justify='space-between'
          align='center'
          className={styles.headingBar}>
          <Title level={5} className={styles.heading}>
            {pacingType} Pacing Report
          </Title>
          <Button
            style={{
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              border: `1px solid ${DZONE_CLR_BLACK}`,
            }}
            onClick={handleExport}
            icon={<DownloadOutlined />}
            className='dz-btn-action-1'
          />
        </Flex>
        <SummaryCards summary={summary} />
        <SummaryGrid
          gridData={gridData}
          pacingType={pacingType}
          showDelivered={showDelivered}
        />
      </Flex>
    </>
  );
};
