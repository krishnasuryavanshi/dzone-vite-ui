import { FormItem } from '@/uicomponents/form';
import { Checkbox } from '@/uicomponents/form/input';
import { FC } from 'react';

interface IFieldRequiredCheckboxProps {
  name: (string | number)[];
}

export const FieldRequiredCheckbox: FC<IFieldRequiredCheckboxProps> = ({ name }) => {
  return (
    <FormItem name={name} valuePropName='checked' className='input-control form-control-item'>
      <Checkbox>Required</Checkbox>
    </FormItem>
  );
};
