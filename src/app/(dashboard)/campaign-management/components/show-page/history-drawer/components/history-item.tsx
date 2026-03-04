import { FC } from 'react';
import { Divider } from '@/uicomponents';
import { DiffRenderer } from './diff-renderer';
import { Card } from '@/uicomponents/layout/card';

interface HistoryItemProps {
  entry: any;
  fileMap: Record<string, any>;
  validationSettingMap: Record<string, string>;
}

export const HistoryItem: FC<HistoryItemProps> = ({ entry, fileMap, validationSettingMap }) => {
  return (
    <Card style={{ border: 'none' }}>
      <DiffRenderer
        diff={entry.diff}
        updatedBy={entry.updatedByName}
        timestamp={entry.timestamp}
        fileMap={fileMap}
        validationSettingMap={validationSettingMap}
      />
      <Divider style={{ margin: '1rem 0' }} />
    </Card>
  );
};
