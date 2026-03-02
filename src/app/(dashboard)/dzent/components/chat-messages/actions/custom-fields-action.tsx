'use client';
import { CustomField } from '@/app/(dashboard)/campaign-management/line-items/components/create-new-line-item/custom-fields/custom-field';
import { CustomFieldInstructions } from '@/app/(dashboard)/campaign-management/line-items/components/create-new-line-item/custom-fields/custom-field-instructions';
import { FormInstance } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface ICustomFieldsActionProps {
  name: string;
  form: FormInstance;
}

export const CustomFieldsAction: FC<ICustomFieldsActionProps> = ({ form }) => {
  return (
    <Flex vertical gap='1rem'>
      <CustomField form={form} />
      <CustomFieldInstructions />
    </Flex>
  );
};
