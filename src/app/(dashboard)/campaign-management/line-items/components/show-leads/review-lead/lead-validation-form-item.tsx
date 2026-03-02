import { Translate } from '@/components/i18n';
import { DzRecord } from '@/lib/types';
import { FormItem } from '@/uicomponents';
import { FC } from 'react';
import {
  TextInput,
  NumberInput,
  EmailInput,
  UrlInput,
  DateInput,
  DropdownInput,
} from './inputs';
import { validateByDataType } from '../../../lib/utils/custom-fields/validation-utils';
import { formatDate } from '@/lib/utils';

interface ILeadValidationFormItemProps {
  field: DzRecord;
  validateField: (field: DzRecord) => (_: any, value: any) => Promise<void>;
}

export const LeadValidationFormItem: FC<ILeadValidationFormItemProps> = ({
  field,
  validateField,
}) => {
  const renderInput = () => {
    const commonProps = {
      placeholder: field.placeholder,
      className: 'input-field',
    };

    switch (field.type?.toLowerCase()) {
      case 'text':
        return <TextInput {...commonProps} />;

      case 'number':
        return <NumberInput {...commonProps} />;

      case 'email':
        return <EmailInput {...commonProps} />;

      case 'url':
        return <UrlInput {...commonProps} />;

      case 'phone':
      case 'tel':
        return <TextInput {...commonProps} />;

      case 'date':
        return (
          <DateInput {...commonProps} format={field.format || 'YYYY-MM-DD'} />
        );

      case 'dropdown':
        return (
          <DropdownInput
            {...commonProps}
            className='select-field'
            options={field.options}
          />
        );

      default:
        return <TextInput {...commonProps} />;
    }
  };

  return (
    <FormItem
      name={field.name}
      rules={[
        {
          validator: validateField(field),
        },
      ]}
      label={<Translate i18nKey={field.label} />}
      className='form-control-item'>
      {renderInput()}
    </FormItem>
  );
};
