
import { FC, useCallback, useContext, useEffect } from 'react';
import { Title } from '@/uicomponents/title';
import { Flex } from '@/uicomponents/layout';
import { Button } from '@/uicomponents/button';
import { DownloadOutlined } from '@/uicomponents/icons';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { LineItemContext } from '../../contexts/line-item';
import { usePacingSummaryStore } from '../../store';
import { exportPacingSummary } from '../../services';
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
  const { lineItem } = useContext(LineItemContext);
  const { summary, gridData, showDelivered, fetchSummary, fetchData, reset } =
    usePacingSummaryStore();

  const pacingType = lineItem?.pacingSchedule as string;

  useEffect(() => {
    if (show && lineItemId) {
      fetchSummary(lineItemId);
      fetchData(lineItemId);
    }
    return () => {
      reset();
    };
  }, [show, lineItemId]);

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
