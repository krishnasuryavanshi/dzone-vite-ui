import React, { FC } from 'react';
import { Checkbox, CheckboxGroup, Input } from '@/uicomponents/form/input';
import { SearchOutlined, LoadingOutlined } from '@/uicomponents/icons';
import { isEqual } from 'lodash';
import { Flex } from '@/uicomponents/layout';
import { Button } from '@/uicomponents/button';
import { DzBox } from '../layout/v1';
import { useDropdownState } from '@/lib/hooks';
import { Spin, Space } from 'antd';

interface IDropdownActionsProps {
  label: React.ReactNode;
  options: { text: string; value: string }[];
  selected: string[];
  onApply: (data: string[]) => void;
  onReset: (data: string[]) => void;
  closeOpenedDropdown: () => void;
  instantFilter?: boolean;
}

export const DropdownActions: FC<IDropdownActionsProps> = ({
  label,
  options,
  selected,
  onApply,
  onReset,
  closeOpenedDropdown,
  instantFilter = false,
}) => {
  const {
    selectedOptions,
    onChange,
    onChangeAll,
    filteredOptions,
    handleSearch,
    handleApply,
    handleReset,
    isLoading,
  } = useDropdownState(selected, options, onApply, onReset, closeOpenedDropdown, instantFilter);

  return (
    <Flex
      style={{
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
        position: 'relative',
      }}
      vertical
      gap={'1rem'}
    >
      {/* Loading overlay that covers entire dropdown */}
      {instantFilter && isLoading && (
        <Flex
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            zIndex: 100,
            borderRadius: 8,
            cursor: 'not-allowed',
          }}
          align='center'
          justify='center'
        >
          <Space direction='vertical' align='center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#235aed' }} spin />} />
          </Space>
        </Flex>
      )}

      <DzBox>
        <Input placeholder='Search' suffix={<SearchOutlined />} onChange={handleSearch} />
      </DzBox>
      <DzBox>
        <Checkbox onChange={onChangeAll} checked={selectedOptions?.length === options?.length}>
          Select All
        </Checkbox>
      </DzBox>
      <DzBox style={{ maxHeight: 250, overflowY: 'auto', width: 350 }}>
        <CheckboxGroup
          className='filter-checkbox-group'
          options={filteredOptions}
          value={selectedOptions as string[]}
          onChange={onChange}
        />
      </DzBox>
    </Flex>
  );
};
