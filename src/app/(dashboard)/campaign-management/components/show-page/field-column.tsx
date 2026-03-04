import { FC, useState } from 'react';
import { Col, Typography, Space } from 'antd';
import { TextView } from '@/components/shared/text';
import {
  ShowCustomQuestions,
  ShowPacingChartPreview,
} from '../../line-items/components/show-line-item';
import { Link } from '@/uicomponents/link';
import { Flex } from '@/uicomponents/layout';
import { fileDownload } from '../../line-items/services';

const { Text } = Typography;

interface IFile {
  id: string;
  filename?: string;
  fileName?: string; // For backward compatibility
  fileSize?: string;
}
interface FieldColumnProps {
  data: {
    label: string;
    value: any;
    span?: number;
    field?: string;
    viewComponent?: FC<{ label: string; value: any }>;
  };
  handleDownload?: () => void;
}

const isRenderable = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const isLongText = (value: any): boolean => typeof value === 'string' && value.length > 100;

const renderValue = (value: any, label: string): React.ReactNode | null => {
  if (isLongText(value)) {
    return <TextView value={value} label={label} />;
  }

  if (Array.isArray(value)) {
    const combined = value.filter((v) => typeof v !== 'object').join(', ');

    return <TextView value={combined} label={label} />;
  }

  return typeof value === 'object' ? null : value;
};

const downloadFile = async (fileId: string) => {
  await fileDownload(fileId);
};

export const FieldColumn: FC<FieldColumnProps> = ({ data, handleDownload }) => {
  if (!isRenderable(data?.value)) return null;

  const { label, value, field } = data;

  const renderAssetFile = (file: IFile) => {
    const normalizedFilename = file?.filename ?? file?.fileName; // Normalize filename property
    return (
      <Flex
        key={file?.id}
        vertical={field === 'deliveryTemplateId' || field === 'ioFileId'}
        gap='0.5rem'
        style={{ width: '100%' }}
      >
        <Text style={{ wordBreak: 'break-word' }}>
          {normalizedFilename} {file?.fileSize && `(${file?.fileSize})`}
        </Text>
        <Link onClick={() => downloadFile(file?.id)} style={{ display: 'inline-block' }}>
          Download
        </Link>
      </Flex>
    );
  };

  return (
    <Col span={field === 'assetFileIds' ? 12 : data?.span || 6}>
      <Space direction='vertical' size={4} style={{ width: '100%' }}>
        <Text type='secondary' style={{ fontSize: '0.875rem' }}>
          {label}
        </Text>

        {field === 'customPacingData' ? (
          <ShowPacingChartPreview label={field} value={value} />
        ) : field === 'customQuestions' ? (
          <ShowCustomQuestions label={field} value={value} />
        ) : field === 'assetFileIds' && Array.isArray(value) ? (
          value.map((file: IFile) => renderAssetFile(file))
        ) : field === 'deliveryTemplate' ? (
          renderAssetFile(value as IFile)
        ) : field === 'ioFileId' ? (
          renderAssetFile(value as IFile)
        ) : (
          renderValue(data.value, data.label)
        )}

        {handleDownload && (
          <Link onClick={handleDownload} style={{ display: 'inline-block' }}>
            Download
          </Link>
        )}
      </Space>
    </Col>
  );
};
