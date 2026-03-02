import { Select } from '@/uicomponents/form/input';
import React from 'react';

interface RenderSelectProps {
  field: any;
  mode?: 'multiple';
  searchable?: boolean;
  options?: any[];
  onPacingChange?: (value: string) => void;
  disabled?: boolean;
}

export const renderSelect = ({
  field,
  mode,
  searchable = false,
  options = [],
  onPacingChange,
  disabled,
}: RenderSelectProps) => {
  const mapOptions = (options: any[]) =>
    options.map((option) => ({
      label: option.label || option,
      value: option.value || option,
    }));

  return (
    <Select
      disabled={disabled || field.isReadOnly}
      className='input-field select'
      placeholder={field.placeholder}
      style={{ width: '100%' }}
      mode={mode}
      showSearch={searchable}
      filterOption={
        searchable
          ? (input, option) =>
              typeof option?.label === 'string' &&
              option.label.toLowerCase().includes(input.toLowerCase())
          : undefined
      }
      options={mapOptions(options)}
      maxTagCount={mode === 'multiple' ? 'responsive' : undefined}
      onChange={onPacingChange}
    />
  );
};
