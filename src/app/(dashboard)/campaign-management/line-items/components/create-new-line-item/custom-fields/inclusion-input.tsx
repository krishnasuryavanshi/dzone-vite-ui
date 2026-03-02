'use client';
import { FormInstance, FormItem, useWatch } from '@/uicomponents/form';
import { Tooltip } from '@/uicomponents';
import { FC } from 'react';
import { ChipsDatePicker } from './chips-date-picker';
import { ChipsInput } from './chips-input';
import { InfoCircleOutlined } from '@/uicomponents/icons';
import { DATE_FORMAT_MAP } from '../../../lib/constants';

interface IInclusionInputProps {
  name: (string | number)[];
  fieldIndex: number;
  form: FormInstance;
}

export const InclusionInput: FC<IInclusionInputProps> = ({
  name,
  fieldIndex,
  form,
}) => {
  const type = useWatch(['customFields', `${fieldIndex}`, 'type'], form);
  const format = useWatch(['customFields', `${fieldIndex}`, 'format'], form);

  const getDateFormat = () => {
    return DATE_FORMAT_MAP[format] || 'YYYY-MM-DD';
  };

  const labelWithTooltip = (
    <span>
      Inclusion{' '}
      <Tooltip
        overlayStyle={{ maxWidth: '20rem' }}
        title={
          <>
            Only these values will be accepted during Validation.
            <br />
            Type a value and press Enter to add it. Add multiple values by
            separating them with commas.
          </>
        }>
        <InfoCircleOutlined
          style={{ color: '#8c8c8c', fontSize: '0.875rem' }}
        />
      </Tooltip>
    </span>
  );

  if (type === 'Date') {
    return (
      <FormItem
        name={name}
        label={labelWithTooltip}
        className='input-control form-control-item'>
        <ChipsDatePicker
          placeholder='Select Date'
          format={getDateFormat()}
          fieldName={name}
          form={form}
        />
      </FormItem>
    );
  }

  return (
    <FormItem
      name={name}
      label={labelWithTooltip}
      className='input-control form-control-item'>
      <ChipsInput
        placeholder='Add More'
        type={type}
        format={format}
        fieldName={name}
        form={form}
      />
    </FormItem>
  );
};
