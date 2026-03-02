import { Translate } from '@/components/i18n';
import { Select } from '@/uicomponents/form/input';
import { Space } from '@/uicomponents/layout';
import React, { FC, useState } from 'react';
import { SelectDrawer } from '../select-drawer';
import { useDropdownState } from '@/lib/hooks';
import './dz-select-dropdown.scss';
import { DropdownActions } from '@/components/util';

interface IDzSelectDropdownProps {
  label: React.ReactNode;
  options: { text: string; value: string }[];
  selected: string[];
  onApply: (data: string[]) => void;
  onReset: (data: string[]) => void;
  isFileType: string;
  instantFilter?: boolean;
}

export const DzSelectDropdown: FC<IDzSelectDropdownProps> = ({
  label,
  options,
  selected,
  onApply,
  onReset,
  isFileType,
  instantFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeOpenedDropdown = () => {
    setIsOpen(false);
  };
  const { selectedOptions } = useDropdownState(
    selected,
    options,
    onApply,
    onReset,
    closeOpenedDropdown,
    instantFilter,
  );

  const [visible, setVisible] = useState(false);
  const [omittedValues, setOmittedValues] = useState<Record<string, any>[]>([]);

  const showDrawer = (e: any, values: Record<string, any>[]) => {
    setOmittedValues(values);
    setVisible(true);
  };

  const closeDrawer = (e: any) => {
    e.preventDefault();
    setVisible(false);
  };

  const handleOpenChange = (isOpened: boolean) => {
    setIsOpen(isOpened);
  };

  const handleChange = (newSelectedValues: string[]) => {
    onApply(newSelectedValues);
  };

  return (
    <>
      <Space direction='vertical' style={{ width: '100%' }}>
        <span style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
          <Translate i18nKey='Lead Status' />
        </span>

        <Select
          className='select-lead-status'
          popupClassName='select-lead-status-dropdown'
          style={{ width: '100%', height: '3rem' }}
          mode='multiple'
          onDropdownVisibleChange={(isOpen) => handleOpenChange(isOpen)}
          open={isOpen}
          value={selectedOptions}
          placeholder='Lead Status'
          maxTagCount={'responsive'}
          onChange={handleChange}
          maxTagPlaceholder={(omittedValues: Record<string, any>[]) => (
            <span
              onMouseEnter={(e) => showDrawer(e, omittedValues)}
              style={{ display: 'inline-block', cursor: 'pointer' }}>
              {`+ ${omittedValues.length} more`}
            </span>
          )}
          showSearch={false}
          dropdownRender={(originNode) => (
            <DropdownActions
              label={label}
              options={options}
              selected={selected}
              onApply={onApply}
              onReset={onReset}
              closeOpenedDropdown={closeOpenedDropdown}
              instantFilter={instantFilter}
            />
          )}
        />
      </Space>
      {label === 'Lead Status' && (
        <SelectDrawer
          label='Lead Status'
          visible={visible}
          omittedValues={omittedValues}
          onClose={closeDrawer}
        />
      )}
    </>
  );
};
