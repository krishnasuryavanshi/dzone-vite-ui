import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Input, Radio, RadioGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Dropdown, Button } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import React, { FC, useMemo, useState } from 'react';

interface IDzRadioDropdownProps {
  label: string;
  options: { label: string; value: string }[];
  onStatusChange: (value: string) => Promise<void>;
  disabled?: boolean;
  handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected?: string;
  style?: React.CSSProperties;
}

export const DzRadioDropdown: FC<IDzRadioDropdownProps> = ({
  label,
  options,
  onStatusChange,
  disabled,
  handleSearch,
  selected,
  style,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const handleOpenChange = (isOpened: boolean) => {
    setIsOpen(isOpened);
  };

  const handleChange = (e: RadioChangeEvent) => {
    onStatusChange(e.target.value);
    setIsOpen(false);
  };

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (handleSearch) handleSearch(e);
  };

  return (
    <Dropdown
      open={isOpen}
      trigger={['click']}
      disabled={disabled}
      dropdownRender={(originNode) => (
        <Flex
          style={{
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: 8,
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
          }}
          vertical
          gap={'1rem'}
        >
          <DzBox>
            <Input
              placeholder='Search'
              suffix={<SearchOutlined />}
              onChange={handleSearchInput}
              value={search}
            />
          </DzBox>
          <DzBox style={{ maxHeight: 250, overflowY: 'auto', width: 350 }}>
            <RadioGroup
              value={selected}
              onChange={handleChange}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))
              ) : (
                <div style={{ padding: '1rem', color: '#888' }}>No results found</div>
              )}
            </RadioGroup>
          </DzBox>
        </Flex>
      )}
      onOpenChange={handleOpenChange}
    >
      <Button style={{ ...style }} className='dz-btn-action-1'>
        {label}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
