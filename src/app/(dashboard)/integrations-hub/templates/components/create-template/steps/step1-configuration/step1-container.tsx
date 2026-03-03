
import { Form, useForm } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { debounce, pick } from 'lodash';
import { FC } from 'react';
import { useTemplateStore } from '../../../../stores';
import { DeliveryDetailSection } from './delivery-detail-section';
import { SourceDetailSection } from './source-detail-section';
import { Step1Footer } from './step1-footer';
import { TemplateDetailSection } from './template-detail-section';

interface Step1ContainerProps {
  templateId?: string;
}

export const Step1Container: FC<Step1ContainerProps> = ({ templateId }) => {
  const [form] = useForm();
  const { updateTemplateData, updateErrorStatus } = useTemplateStore();

  const processFormValues = (values: any) => {
    const processedValues = { ...values };

    // Handle deliveryObject transformation based on delivery type
    if (values.deliveryType === 'FlatFile') {
      processedValues.deliveryObject = undefined;
      processedValues.integrationId = undefined;
    }

    // Remove form-only fields
    const { selectedDeliveryObjectId, ...cleanedValues } = processedValues;
    return cleanedValues;
  };

  const submitForm = async () => {
    try {
      const values = await form.validateFields();
      const processedValues = processFormValues(values);
      updateStateInContext(processedValues, false);
    } catch (error) {
      const values = form.getFieldsValue();
      const processedValues = processFormValues(values);
      updateStateInContext(processedValues, true);
    }
  };

  const updateStateInContext = (values: any, infoError: boolean) => {
    const pickedValues = pick(values, [
      'name',
      'description',
      'lineItemId',
      'deliveryType',
      'integrationId',
      'integrationName',
      'deliveryObject',
    ]);

    updateTemplateData(pickedValues);
    updateErrorStatus({ infoError });
  };

  const debouncedSubmitForm = debounce(submitForm, 500);

  return (
    <Flex vertical style={{ padding: '1rem', paddingTop: '0' }}>
      <Form form={form} layout='vertical' onValuesChange={debouncedSubmitForm}>
        <SourceDetailSection templateId={templateId} />
        <TemplateDetailSection templateId={templateId} />
        <DeliveryDetailSection form={form} templateId={templateId} />
      </Form>
      <Step1Footer form={form} />
    </Flex>
  );
};
