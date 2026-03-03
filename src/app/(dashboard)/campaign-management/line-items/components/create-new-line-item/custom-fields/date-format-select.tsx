import { FormInstance, FormItem, useWatch } from '@/uicomponents/form';
import { Select } from '@/uicomponents/form/input';
import { FC } from 'react';
import { DATE_FORMAT_OPTIONS } from '../../../lib/constants';

interface IDateFormatSelectProps {
  name: (string | number)[];
  fieldIndex: number;
  form: FormInstance;
  disabled?: boolean;
}

export const DateFormatSelect: FC<IDateFormatSelectProps> = ({
  name,
  fieldIndex,
  form,
  disabled,
}) => {
  const dataType = useWatch(['customFields', `${fieldIndex}`, 'type'], form);

  if (dataType !== 'Date') {
    return null;
  }

  return (
    <FormItem
      name={name}
      label='Date Format'
      rules={[{ required: true, message: 'Date format is required' }]}
      className='input-control form-control-item'>
      <Select
        placeholder='Select Format'
        options={DATE_FORMAT_OPTIONS}
        disabled={disabled}
      />
    </FormItem>
  );
};
