'use client';
import { FormItem } from '@/uicomponents/form';
import { TextArea } from '@/uicomponents/form/input';
import { FC } from 'react';

export const CustomFieldInstructions: FC = () => {
  return (
    <FormItem
      name='customFieldInstructions'
      label='Custom Field Instructions if any'
      className='input-control form-control-item'>
      <TextArea
        placeholder='Enter Custom Field Instructions'
        className='input-field'
        rows={2}
      />
    </FormItem>
  );
};
