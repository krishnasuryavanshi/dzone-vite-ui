'use client';
import { FormInstance, FormList } from '@/uicomponents/form';
import { FC } from 'react';
import { canEditCustomFieldDefinition } from '../../../lib/utils/custom-fields';
import { AddCustomFieldButton } from './add-custom-field-button';
import { CustomFieldRow } from './custom-field-row';

interface ICustomFieldProps {
  form: FormInstance;
  lineItemStatus?: string;
}

const MAX_CUSTOM_FIELDS = 10;

export const CustomField: FC<ICustomFieldProps> = ({
  form,
  lineItemStatus,
}) => {
  const isDefinitionLocked = !canEditCustomFieldDefinition(lineItemStatus);

  const handleAddField = (add: (defaultValue?: any) => void) => {
    add({ type: 'Text' });
  };

  return (
    <FormList name='customFields'>
      {(fields, { add, remove }) => (
        <>
          <AddCustomFieldButton
            add={() => handleAddField(add)}
            disabled={fields.length >= MAX_CUSTOM_FIELDS}
          />

          {fields.map(({ key, name }, index) => (
            <CustomFieldRow
              key={key}
              field={name}
              index={index}
              remove={remove}
              form={form}
              isDefinitionLocked={isDefinitionLocked}
            />
          ))}
        </>
      )}
    </FormList>
  );
};
