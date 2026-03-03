import { DzRecord } from '@/lib/types';
import { showNotification } from '@/services/index';
import { Form, useForm } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { useRouter } from '@/lib/hooks/use-router';
import { ILineItem } from '../../../lib/types';
import { formatCustomFieldsPayload } from '../../../lib/utils/custom-fields';
import { updateLineItemCustomFields } from '../../../services';
import { CustomField } from './custom-field';
import { CustomFieldInstructions } from './custom-field-instructions';
import { CustomFieldsActions } from './custom-fields-actions';

interface ICustomFieldsContainerProps {
  lineItemDetails?: ILineItem;
  initialValues?: DzRecord;
}

export const CustomFieldsContainer: FC<ICustomFieldsContainerProps> = ({
  initialValues,
  lineItemDetails,
}) => {
  const [form] = useForm();
  const router = useRouter();

  const handleFinish = async (values: DzRecord) => {
    const payload = formatCustomFieldsPayload(values);
    const data = await updateLineItemCustomFields(
      lineItemDetails?.id as string,
      payload,
    );
    if (data?.message) {
      showNotification({
        type: 'success',
        message: data.message,
      });
      router.push('/campaign-management/line-items');
    }
  };

  return (
    <Flex vertical gap='1rem'>
      <Text style={{ color: '#6B7280' }} text14 strong>
        {
          "Feel free to add any extra questions you'd like to include in the Lead template."
        }
      </Text>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={initialValues}>
        <CustomField
          form={form}
          lineItemStatus={lineItemDetails?.status?.value}
        />
        <CustomFieldInstructions />
        <CustomFieldsActions
          loading={false}
          handleCancel={() => router.push('/campaign-management/line-items')}
        />
      </Form>
    </Flex>
  );
};
