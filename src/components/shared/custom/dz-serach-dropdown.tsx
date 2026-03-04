import { DzBox } from '@/components/layout/v1';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Input } from '@/uicomponents/form/input';
import { SearchOutlined } from '@ant-design/icons';
import React, { FC, useEffect, useState } from 'react';

interface IDzSerachDropdownProps {
  placeholder?: string;
  handleSearch?: (value: string) => void;
  show?: boolean;
  value?: string;
  className?: string;
  isGlobalSearchPadding?: boolean;
  isGlobalSearchDisabled?: boolean;
}

export const DzSerachDropdown: FC<IDzSerachDropdownProps> = ({
  placeholder,
  handleSearch,
  value,
  show,
  className,
  isGlobalSearchPadding,
  isGlobalSearchDisabled,
}) => {
  if (!show) {
    return null;
  }

  const inputStyle: React.CSSProperties = {
    fill: '#FFF',
    boxShadow: '0px 0px 6px 0px rgba(35, 90, 237, 0.32) inset',
    border: 'none',
    height: '2.5rem',
  };
  return (
    <DzBox
      className='dz-serach-dropdown'
      style={{
        padding: isGlobalSearchPadding ? '0rem' : '0rem 0.75rem 0.5rem 0.75rem',
      }}
    >
      <Input
        className={className}
        disabled={isGlobalSearchDisabled}
        style={inputStyle}
        placeholder={placeholder}
        suffix={<SearchOutlined style={{ color: `${DZONE_CLR_BLACK}` }} />}
        value={value}
        onChange={(e) => {
          handleSearch && handleSearch((e.target as HTMLInputElement).value);
        }}
      />
    </DzBox>
  );
};
