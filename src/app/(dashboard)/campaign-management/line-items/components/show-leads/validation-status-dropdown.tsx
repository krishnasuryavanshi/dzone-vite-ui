import { DzCheckboxDropdown } from '@/components/shared/custom';
import { FC, useMemo } from 'react';
import { ILeadStatus } from '../../../leads/lib/types';
import { useLeadValidationStatusesQuery } from '../../hooks';
import { Button } from '@/uicomponents/button';
import { DownOutlined } from '@/uicomponents/icons';
import { Typography } from 'antd';
import { Space } from '@/uicomponents/layout';
import {
  getDropdownLabelStyle,
  getDropdownBadgeStyle,
  getDropdownButtonStyle,
  dropdownIconStyle,
  dropdownSpaceStyle,
  dropdownLabelSpaceStyle,
} from '../../lib/utils/dropdown-styles';

interface IValidationStatusDropdownProps {
  onValidationStatusChange: (data: string[]) => void;
  selected: string[];
  isFileType: string;
}

export const ValidationStatusDropdown: FC<IValidationStatusDropdownProps> = ({
  onValidationStatusChange,
  selected,
  isFileType,
}) => {
  const { data } = useLeadValidationStatusesQuery();

  const validationStatusOptions = useMemo(
    () =>
      data?.data?.map((item: ILeadStatus) => ({
        value: item.name,
        text: item.value,
      })) ?? [],
    [data],
  );

  const hasSelected = selected && selected.length > 0;

  const labelStyle = getDropdownLabelStyle(hasSelected, true);
  const badgeStyle = getDropdownBadgeStyle(hasSelected);
  const buttonStyle = getDropdownButtonStyle({
    hasSelected,
    minWidth: '11rem',
  });

  const label = (
    <Space size={8} style={dropdownLabelSpaceStyle}>
      <Typography.Text style={labelStyle}>Validation Status</Typography.Text>
      {hasSelected && <span style={badgeStyle}>{selected.length}</span>}
    </Space>
  );

  // Render custom button for dropdown
  const CustomButton = ({ onClick }: { onClick: (e: any) => void }) => (
    <Button style={buttonStyle} onClick={onClick}>
      <Space style={dropdownSpaceStyle}>
        {label}
        <DownOutlined style={dropdownIconStyle} />
      </Space>
    </Button>
  );
  return (
    <DzCheckboxDropdown
      label={label}
      options={validationStatusOptions}
      onApply={onValidationStatusChange}
      onReset={onValidationStatusChange}
      selected={selected}
      renderButton={CustomButton}
      instantFilter={true}
    />
  );
};
