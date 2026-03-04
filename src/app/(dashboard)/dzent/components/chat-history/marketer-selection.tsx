import { Button, Dropdown, Text, Tooltip } from '@/uicomponents';
import { DZENT_BG_SELECTED, DZENT_BTN_DARK } from '@/lib/constants/color-constants';
import { DownOutlined } from '@/uicomponents/icons';
import { FC } from 'react';
import { useDzentStore } from '../../store';

interface IMarketerSelectionProps {
  onMarketerChange?: () => void;
}

export const MarketerSelection: FC<IMarketerSelectionProps> = ({ onMarketerChange }) => {
  const { tenantCode, marketerList, setTenantCode } = useDzentStore();

  // Only render if there's more than one marketer
  if (!marketerList || marketerList.length <= 1) {
    return null;
  }

  // Find the current selected marketer
  const currentMarketer = marketerList.find((marketer) => marketer.value === tenantCode);

  // Handle marketer selection
  const handleMarketerSelect = (marketerValue: string) => {
    // Only trigger action if marketer is changed
    if (marketerValue !== tenantCode) {
      setTenantCode(marketerValue);
      // Call the onMarketerChange callback to initialize new chat
      onMarketerChange?.();
    }
  };

  // Transform marketerList into dropdown menu items
  const menuItems = marketerList.map((marketer) => ({
    key: marketer.value,
    label: marketer.label,
    onClick: () => handleMarketerSelect(marketer.value),
    style:
      marketer.value === tenantCode ? { backgroundColor: DZENT_BG_SELECTED, fontWeight: 600 } : {},
  }));

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <Tooltip title={currentMarketer?.label || 'Select Marketer'}>
        <Button
          size='small'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0 0.5rem',
            maxWidth: '10rem',
            border: `1px solid ${DZENT_BTN_DARK}`,
          }}
        >
          <Text
            ellipsis
            style={{
              flex: 1,
            }}
          >
            {currentMarketer?.label || 'Select Marketer'}
          </Text>
          <DownOutlined style={{ fontSize: '0.75rem', flexShrink: 0 }} />
        </Button>
      </Tooltip>
    </Dropdown>
  );
};
