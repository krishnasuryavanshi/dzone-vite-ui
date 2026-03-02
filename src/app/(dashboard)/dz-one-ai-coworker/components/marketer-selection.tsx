'use client';

import { Button, Dropdown, Text, Tooltip } from '@/uicomponents';
import { DownOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useCallback, useMemo } from 'react';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { COLORS } from '../lib/constants/colors';
import { Hideable } from '@/components/shared';

interface MarketerSelectionProps {
  onMarketerChange?: () => void;
}

export const MarketerSelection: FC<MarketerSelectionProps> = ({
  onMarketerChange,
}) => {
  const tenantCode = useAiAgentStore((state) => state.tenantCode);
  const marketerList = useAiAgentStore((state) => state.marketerList);
  const setTenantCode = useAiAgentStore((state) => state.setTenantCode);
  const isTenantUnavailable = useAiAgentStore(
    (state) => state.isTenantUnavailable,
  );

  const currentMarketer = useMemo(
    () => marketerList?.find((marketer) => marketer.value === tenantCode),
    [marketerList, tenantCode],
  );

  const displayLabel = useMemo(
    () =>
      isTenantUnavailable
        ? 'Old Tenant'
        : currentMarketer?.label || 'Select Marketer',
    [isTenantUnavailable, currentMarketer],
  );

  const handleMarketerSelect = useCallback(
    (marketerValue: string) => {
      if (marketerValue !== tenantCode) {
        setTenantCode(marketerValue);
        onMarketerChange?.();
      }
    },
    [tenantCode, setTenantCode, onMarketerChange],
  );

  const menuItems = useMemo(
    () =>
      marketerList?.map((marketer) => ({
        key: marketer.value,
        label: marketer.label,
        onClick: () => handleMarketerSelect(marketer.value),
        style:
          marketer.value === tenantCode && !isTenantUnavailable
            ? { backgroundColor: '#e6f4ff', fontWeight: 700 }
            : { fontWeight: 400 },
      })) || [],
    [marketerList, tenantCode, isTenantUnavailable, handleMarketerSelect],
  );

  const buttonStyle = useMemo(
    () =>
      isTenantUnavailable
        ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.5rem 1rem',
            height: 'auto',
            border: '1px solid #ffccc7',
            backgroundColor: '#fff1f0',
          }
        : {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.5rem 1rem',
            height: 'auto',
            border: '1px solid #d9d9d9',
          },
    [isTenantUnavailable],
  );

  const textColor = isTenantUnavailable ? COLORS.ERROR : undefined;

  return (
    <Hideable show={!!marketerList && marketerList.length > 0}>
      <Dropdown
        menu={{
          items: menuItems,
          style: { maxHeight: '18rem', overflow: 'auto' },
        }}
        trigger={['click']}>
        <Tooltip title={displayLabel}>
          <Button style={buttonStyle}>
            <Text ellipsis strong style={{ color: textColor }}>
              {displayLabel}
            </Text>
            <DownOutlined
              style={{
                fontSize: '0.625rem',
                flexShrink: 0,
                color: textColor,
              }}
            />
          </Button>
        </Tooltip>
      </Dropdown>
    </Hideable>
  );
};
