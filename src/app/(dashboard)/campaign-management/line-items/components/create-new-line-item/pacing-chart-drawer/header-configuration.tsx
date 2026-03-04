import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  Text,
  Title,
  Tooltip,
} from '@/components/uicomponents';
import { Col, Flex, Row, Space } from '@/uicomponents/layout';
import { Dayjs } from 'dayjs';
import styles from '../pacing-chart-drawer.module.css';
import { Card } from '@/uicomponents/layout/card';
import { CalendarOutlined, DownOutlined, InfoCircleOutlined } from '@/uicomponents/icons';
import { PacingType, LineItemStatus } from '../../../lib/enums';
import { OverflowConfirmation } from '../overflow-confirmation';

interface HeaderConfigurationProps {
  hasBeenLive: boolean;
  dateRange: [Dayjs, Dayjs] | null;
  pacingSchedule: string;
  setPacingSchedule: (value: string) => void;
  pacingScheduleOptions: Array<{ value: string; label: string }>;
  allowOverflow: boolean;
  setallowOverflow: (value: boolean) => void;
  deficitManagement: boolean;
  setdeficitManagement: (value: boolean) => void;
  onDateClick: () => void;
  pacing?: string;
  onPacingChange?: (pacing: string) => void;
  isReadOnly?: boolean;
  originalPacingValue?: string | null; // Add original pacing value for confirmation logic
  lineItemId?: string;
  overflowDisabledPermanently?: boolean;
  onOverflowEnable?: () => void;
}

export const HeaderConfiguration: React.FC<HeaderConfigurationProps> = ({
  hasBeenLive,
  dateRange,
  pacingSchedule,
  setPacingSchedule,
  pacingScheduleOptions,
  allowOverflow,
  setallowOverflow,
  deficitManagement,
  setdeficitManagement,
  onDateClick,
  pacing,
  onPacingChange,
  isReadOnly = false,
  originalPacingValue,
  lineItemId,
  overflowDisabledPermanently = false,
  onOverflowEnable,
}) => {
  const [showOverflowConfirmation, setShowOverflowConfirmation] = useState(false);
  const [localOverflowDisabled, setLocalOverflowDisabled] = useState(overflowDisabledPermanently);

  // Update local state when prop changes
  useEffect(() => {
    setLocalOverflowDisabled(overflowDisabledPermanently);
  }, [overflowDisabledPermanently]);

  // Check if overflow should be disabled due to custom pacing with no schedule
  const isCustomPacingWithNoSchedule =
    pacing === PacingType.CUSTOM_PACING &&
    hasBeenLive &&
    (!pacingSchedule || pacingSchedule === '');

  const canEnableOverflow =
    lineItemId && !localOverflowDisabled && hasBeenLive && !isCustomPacingWithNoSchedule;

  const handleOverflowToggle = (checked: boolean) => {
    if (checked && canEnableOverflow) {
      setShowOverflowConfirmation(true);
    } else if (!checked) {
      // Overflow can only be enabled, not disabled
      return;
    }
  };

  // Watch for pacing changes to handle No Pacing selection
  useEffect(() => {
    if (pacing === PacingType.NO_PACING) {
      // When No Pacing is selected, uncheck Allow Overflow and Deficit Management
      setallowOverflow(false);
      setdeficitManagement(false);
    }
  }, [pacing, setallowOverflow, setdeficitManagement]);

  const handleOverflowConfirm = () => {
    setShowOverflowConfirmation(false);
    setallowOverflow(true);
    setdeficitManagement(false); // Uncheck deficit management when overflow is enabled
    setLocalOverflowDisabled(true); // Immediately update local state
    onOverflowEnable?.();
  };

  const handleOverflowCancel = () => {
    setShowOverflowConfirmation(false);
  };
  return (
    <Flex vertical gap='0.5rem' style={{ marginBottom: '0.5rem' }}>
      {/* Custom Pacing Radio Section - Always Shown */}
      <Flex vertical>
        <Title
          level={5}
          style={{
            color: '#565454',
            fontSize: '1.25rem',
            fontWeight: '700',
          }}
        >
          Set your pacing
        </Title>
        <Space className={styles.gradientBorderWrapper}>
          <Card className={styles.customPacingCard}>
            <RadioGroup
              value={pacing === PacingType.CUSTOM_PACING ? 'custom' : undefined}
              onChange={() => !isReadOnly && onPacingChange?.(PacingType.CUSTOM_PACING)}
              disabled={isReadOnly}
            >
              <Space align='start'>
                <Radio value='custom' />
                <Flex vertical gap='small'>
                  <Text strong>Custom Pacing</Text>
                  <Text type='secondary'>
                    Manual configuration with flexible cap adjustments. Optional deficit management
                    with validation.
                  </Text>
                </Flex>
              </Space>
            </RadioGroup>
          </Card>
        </Space>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Space>
            <Text type='secondary'>Pacing Period:</Text>
            {dateRange ? (
              <Space size={4}>
                <Text
                  strong
                  style={{
                    fontSize: '0.875rem',
                    opacity: localOverflowDisabled ? 0.6 : 1,
                    color: localOverflowDisabled ? '#8c8c8c' : undefined,
                  }}
                >
                  {dateRange[0].format('MMM DD, YYYY')} - {dateRange[1].format('MMM DD, YYYY')}
                </Text>
                <CalendarOutlined
                  style={{
                    fontSize: '0.875rem',
                    cursor: isReadOnly || localOverflowDisabled ? 'default' : 'pointer',
                    color: isReadOnly || localOverflowDisabled ? '#d9d9d9' : '#4D59D8',
                    opacity: localOverflowDisabled ? 0.6 : 1,
                  }}
                  onClick={isReadOnly || localOverflowDisabled ? undefined : onDateClick}
                />
              </Space>
            ) : (
              <Space size={4}>
                <Text
                  style={{
                    fontSize: '0.875rem',
                    cursor: isReadOnly || localOverflowDisabled ? 'default' : 'pointer',
                    color: isReadOnly || localOverflowDisabled ? '#d9d9d9' : undefined,
                    opacity: localOverflowDisabled ? 0.6 : 1,
                  }}
                  onClick={isReadOnly || localOverflowDisabled ? undefined : onDateClick}
                >
                  {isReadOnly
                    ? 'Dates (Read Only)'
                    : localOverflowDisabled
                      ? 'Dates (Overflow Enabled)'
                      : 'Select Dates'}
                </Text>
                <CalendarOutlined
                  style={{
                    fontSize: '0.875rem',
                    cursor: isReadOnly || localOverflowDisabled ? 'default' : 'pointer',
                    color: isReadOnly || localOverflowDisabled ? '#d9d9d9' : '#4D59D8',
                    opacity: localOverflowDisabled ? 0.6 : 1,
                  }}
                  onClick={isReadOnly || localOverflowDisabled ? undefined : onDateClick}
                />
              </Space>
            )}
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} align='middle'>
        <Col span={12}>
          <Space>
            <Text type='secondary'>Choose a Baseline Pacing:</Text>
            <Select
              value={pacingSchedule || undefined}
              onChange={(value) => setPacingSchedule(value || '')}
              style={{
                fontWeight: 700,
                minWidth: '7.125rem',
              }}
              variant='borderless'
              disabled={
                !dateRange ||
                isReadOnly ||
                localOverflowDisabled ||
                pacing === PacingType.NO_PACING ||
                (hasBeenLive &&
                  originalPacingValue === PacingType.CUSTOM_PACING &&
                  pacing === PacingType.CUSTOM_PACING)
              }
              options={pacingScheduleOptions.length > 0 ? pacingScheduleOptions : undefined}
              placeholder=''
              allowClear
              size='small'
              suffixIcon={<DownOutlined style={{ fontWeight: 'bold', fontSize: '10px' }} />}
            />
          </Space>
        </Col>
        <Col span={12}>
          <Flex gap='0.5rem' wrap='wrap' vertical>
            <Tooltip
              title={
                localOverflowDisabled
                  ? 'Overflow is permanently enabled for this line item'
                  : !hasBeenLive
                    ? 'Overflow can only be enabled for line items that have been live'
                    : isCustomPacingWithNoSchedule
                      ? 'Please select a baseline pacing schedule before enabling overflow'
                      : lineItemId
                        ? 'Overflow disables all pacing caps for this line item. Once enabled, suppliers can publish leads without pacing restrictions, and the line item switches to "No Pacing" mode. Reporting frequency remains unchanged. Overflow can only be enabled while editing live line items. This action is logged for audit purposes.'
                        : 'Overflow can only be enabled while editing the line item'
              }
              placement='top'
            >
              <Space
                className={
                  localOverflowDisabled ||
                  (!lineItemId && !allowOverflow) ||
                  !hasBeenLive ||
                  isCustomPacingWithNoSchedule ||
                  pacing === PacingType.NO_PACING
                    ? styles.disabledOverflowCheckbox
                    : ''
                }
                style={
                  localOverflowDisabled ||
                  !hasBeenLive ||
                  isCustomPacingWithNoSchedule ||
                  pacing === PacingType.NO_PACING
                    ? { opacity: 0.6, cursor: 'not-allowed' }
                    : {}
                }
              >
                <Checkbox
                  checked={
                    pacing === PacingType.NO_PACING ? false : localOverflowDisabled || allowOverflow
                  }
                  disabled={
                    !dateRange ||
                    isReadOnly ||
                    localOverflowDisabled ||
                    (!lineItemId && !allowOverflow) ||
                    !hasBeenLive ||
                    isCustomPacingWithNoSchedule ||
                    pacing === PacingType.NO_PACING
                  }
                  onChange={(e) => handleOverflowToggle(e.target.checked)}
                >
                  Allow Lead Overflow
                </Checkbox>
                <InfoCircleOutlined
                  style={{
                    fontSize: '0.875rem',
                  }}
                />
              </Space>
            </Tooltip>
            <Space
              style={
                localOverflowDisabled || pacing === PacingType.NO_PACING
                  ? { opacity: 0.6, cursor: 'not-allowed' }
                  : {}
              }
            >
              <Checkbox
                checked={pacing === PacingType.NO_PACING ? false : deficitManagement}
                disabled={
                  !dateRange ||
                  isReadOnly ||
                  localOverflowDisabled ||
                  pacing === PacingType.NO_PACING
                }
                onChange={(e) => setdeficitManagement(e.target.checked)}
              >
                Enable Deficit Management
              </Checkbox>
            </Space>
          </Flex>
        </Col>
      </Row>
      <OverflowConfirmation
        visible={showOverflowConfirmation}
        onConfirm={handleOverflowConfirm}
        onCancel={handleOverflowCancel}
      />
    </Flex>
  );
};
