'use client';
import { FormInstance, FormItem } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input';
import { FC } from 'react';
import { DATA_TYPE_OPTIONS } from '../../../lib/constants';

interface IDataTypeSelectProps {
  name: (string | number)[];
  fieldIndex: number;
  form: FormInstance;
  disabled?: boolean;
}

export const DataTypeSelect: FC<IDataTypeSelectProps> = ({
  name,
  fieldIndex,
  form,
  disabled,
}) => {
  const handleTypeChange = () => {
    // Clear inclusion/exclusion when type changes
    form.setFieldValue(['customFields', fieldIndex, 'inclusion'], undefined);
    form.setFieldValue(['customFields', fieldIndex, 'exclusion'], undefined);
    form.setFieldValue(['customFields', fieldIndex, 'format'], undefined);
  };

  return (
    <FormItem
      name={name}
      label='Data Type'
      rules={[{ required: true, message: 'Data type is required' }]}
      className='input-control form-control-item'>
      <Select
        placeholder='Select Data Type'
        options={DATA_TYPE_OPTIONS}
        onChange={handleTypeChange}
        disabled={disabled}
      />
    </FormItem>
  );
};
