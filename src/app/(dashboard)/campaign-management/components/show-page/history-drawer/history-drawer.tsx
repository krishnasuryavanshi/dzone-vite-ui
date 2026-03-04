import { DrawerCloseButton } from '@/app/(dashboard)/components';
import { Drawer } from '@/uicomponents/drawers';
import { Text, Spin } from '@/uicomponents';
import { LoadingOutlined } from '@/uicomponents/icons';
import { CLR_BLUE_LIGHT } from '@/lib/constants';
import { FC, useRef } from 'react';
import { useHistoryData } from './hooks/use-history-data';
import { HistoryItem } from './components/history-item';
import { Flex } from '@/uicomponents/layout';

interface IHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lineItemId: string;
  marketerCode?: string;
  formConfig: any;
}

export const HistoryDrawer: FC<IHistoryDrawerProps> = ({
  isOpen,
  onClose,
  lineItemId,
  marketerCode,
  formConfig,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { historyData, loading, hasMore, handleScroll, fileMap, validationSettingMap } =
    useHistoryData(isOpen, lineItemId, marketerCode, formConfig);

  return (
    <Drawer
      title='History Changes'
      onClose={onClose}
      open={isOpen}
      closable
      maskClosable={false}
      placement='right'
      closeIcon={<DrawerCloseButton />}
      destroyOnClose
      width='46rem'
      style={{ overflow: 'hidden' }}
    >
      <div
        ref={containerRef}
        style={{ height: '80vh', overflowY: 'auto', paddingRight: 16 }}
        onScroll={handleScroll}
      >
        {loading && historyData.length === 0 ? (
          <Spin
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            indicator={<LoadingOutlined style={{ fontSize: 24, color: CLR_BLUE_LIGHT }} spin />}
          />
        ) : historyData.length === 0 ? (
          <Flex justify='center' align='center' style={{ height: '100%' }}>
            <Text type='secondary'>No Data Available</Text>
          </Flex>
        ) : (
          historyData.map((entry, index) => (
            <HistoryItem
              key={index}
              entry={entry}
              fileMap={fileMap}
              validationSettingMap={validationSettingMap}
            />
          ))
        )}
        {loading && historyData.length > 0 && (
          <Flex justify='center' style={{ marginTop: 16 }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24, color: CLR_BLUE_LIGHT }} spin />}
            />
          </Flex>
        )}
      </div>
    </Drawer>
  );
};
