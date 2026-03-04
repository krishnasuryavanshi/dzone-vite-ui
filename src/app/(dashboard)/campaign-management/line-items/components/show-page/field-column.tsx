import { FC, useState } from 'react';
import { Col, Typography, Space, Drawer, Button, Tooltip } from 'antd';
import { ShowCustomQuestions, ShowPacingChartPreview } from '../show-line-item';
import { Link } from '@/uicomponents/link';
import { OverflowStatusBadge } from './overflow-status-badge';
import { Flex } from '@/uicomponents/layout';
import { fileDownload } from '../../services';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { StatusMetaLineItems } from '../../lib/utils';

const { Text } = Typography;

interface IFile {
  id: string;
  filename: string;
  fileSize?: string;
}
interface FieldColumnProps {
  data: {
    label: string;
    value: any;
    span?: number;
    field?: string;
    viewComponent?: FC<{ label: string; value: any }>;
    tooltip?: string;
  };
  handleDownload?: () => void;
  itemDetails?: any;
}

const isRenderable = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

const isLongText = (value: any): boolean => typeof value === 'string' && value.length > 50;

const SimpleExpandableText = ({ text, label }: { text: string; label: string }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const maxChars = 50;

  const displayText = text.length > maxChars ? `${text.substring(0, maxChars)}...` : text;

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Text style={{ wordBreak: 'break-word', overflow: 'hidden' }}>{displayText}</Text>
      {text.length > maxChars && (
        <>
          <Link onClick={showDrawer} style={{ marginLeft: '4px', fontSize: '0.85rem' }}>
            more
          </Link>

          <Drawer
            title={label}
            placement='right'
            onClose={closeDrawer}
            open={isDrawerOpen}
            width={500}
            closeIcon={null}
          >
            <Button
              icon={<CloseOutlined />}
              onClick={closeDrawer}
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                zIndex: 1,
              }}
            />
            <div
              style={{
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 120px)',
                padding: '16px 0',
                wordBreak: 'break-word',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              {text}
            </div>
          </Drawer>
        </>
      )}
    </>
  );
};

const renderValue = (value: any, label: string, field?: string): React.ReactNode | null => {
  let textStyle: React.CSSProperties = {
    wordBreak: 'break-word',
  };

  if (field === 'status') {
    const statusMeta = StatusMetaLineItems({ value });
    if (statusMeta) {
      textStyle = {
        ...textStyle,
        color: statusMeta.color,
        backgroundColor: statusMeta.backgroundColor,
        padding: '2px 8px',
        borderRadius: '4px',
        display: 'inline-block',
      };
    }
  }

  if (isLongText(value)) {
    return <SimpleExpandableText text={value} label={label} />;
  }

  if (Array.isArray(value)) {
    const combined = value.filter((v) => typeof v !== 'object').join(', ');
    if (isLongText(combined)) {
      return <SimpleExpandableText text={combined} label={label} />;
    }
    return <Text style={textStyle}>{combined}</Text>;
  }

  return typeof value === 'object' ? null : <Text style={textStyle}>{value}</Text>;
};

const downloadFile = async (fileId: string) => {
  await fileDownload(fileId);
};

export const FieldColumn: FC<FieldColumnProps> = ({ data, handleDownload, itemDetails }) => {
  if (!isRenderable(data?.value)) return null;

  const { label, value, field, tooltip } = data;
  const renderAssetFile = (file: IFile) => {
    return (
      <Flex
        key={file?.id}
        vertical={field === 'deliveryTemplateId'}
        gap='0.5rem'
        style={{ width: '100%' }}
      >
        <Text style={{ wordBreak: 'break-word' }}>
          {file?.filename} {file?.fileSize && `(${file?.fileSize})`}
        </Text>
        <Link onClick={() => downloadFile(file?.id)} style={{ display: 'inline-block' }}>
          Download
        </Link>
      </Flex>
    );
  };

  return (
    <Col
      span={
        field === 'assetFileIds' ? 12 : field === 'additionalInstructions' ? 24 : data?.span || 4
      }
      style={{ overflow: 'hidden' }}
    >
      <Space
        direction='vertical'
        size={4}
        style={{ width: '100%', overflow: 'hidden', wordBreak: 'break-word' }}
      >
        <Space size={4} style={{ alignItems: 'center' }}>
          <Text type='secondary' style={{ fontSize: '0.875rem' }}>
            {label}
          </Text>
          {tooltip && (
            <Tooltip
              title={tooltip}
              overlayStyle={{
                whiteSpace: 'normal',
                maxWidth: '18.75rem',
              }}
              overlayInnerStyle={{
                fontSize: '0.75rem',
                padding: '0.5rem',
                wordBreak: 'break-word',
              }}
            >
              <InfoCircleOutlined
                style={{
                  fontSize: '0.875rem',
                  color: '#8c8c8c',
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          )}
        </Space>

        {field === 'customPacingData' ? (
          <ShowPacingChartPreview
            label={field}
            value={value}
            lineItemData={{
              targetLeadGoal: itemDetails?.targetLeadGoal,
              targetDeliveryStartDate: itemDetails?.targetDeliveryStartDate,
              lineItemTargetStartDate: itemDetails?.lineItemTargetStartDate,
              lineItemTargetEndDate: itemDetails?.lineItemTargetEndDate,
              pacingSchedule: itemDetails?.pacingSchedule,
              pacing: itemDetails?.pacing,
              allowOverflow: itemDetails?.allowOverflow,
              deficitManagement: itemDetails?.deficitManagement,
            }}
          />
        ) : field === 'customQuestions' ? (
          <ShowCustomQuestions label={field} value={value} />
        ) : field === 'allowOverflow' ? (
          <OverflowStatusBadge value={value} />
        ) : field === 'assetFileIds' && Array.isArray(value) ? (
          value.map((file: IFile) => renderAssetFile(file))
        ) : field === 'deliveryTemplateId' ? (
          renderAssetFile(value as IFile)
        ) : (
          renderValue(data.value, data.label, field)
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
