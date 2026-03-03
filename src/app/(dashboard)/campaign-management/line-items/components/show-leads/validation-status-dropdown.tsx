import { DzCheckboxDropdown } from '@/components/shared/custom';
import { FC, useEffect, useState } from 'react';
import { ILeadStatus } from '../../../leads/lib/types';
import { fetchLeadValidationStatusList } from '../../../leads/services';
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
  const [validationStatusOptions, setValidationStatusOptions] = useState([]);

  useEffect(() => {
    fetchStatusData();
  }, []);

  const fetchStatusData = async () => {
    const data = await fetchLeadValidationStatusList();
    if (data) {
      setValidationStatusOptions(
        data.data.map((item: ILeadStatus) => ({
          value: item.name,
          text: item.value,
        })),
      );
    }
  };

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
