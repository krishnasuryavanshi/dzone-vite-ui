import { DzBox } from '@/components/layout/v1';
import { FormInstance } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { DataTypeSelect } from './data-type-select';
import { DateFormatSelect } from './date-format-select';
import { DeleteFieldButton } from './delete-field-button';
import { FieldNameInput } from './field-name-input';
import { FieldRequiredCheckbox } from './field-required-checkbox';
import { InclusionInput } from './inclusion-input';
import { SuppressionInput } from './suppression-input';

interface ICustomFieldRowProps {
  field: number;
  index: number;
  remove: (index: number) => void;
  form: FormInstance;
  isDefinitionLocked?: boolean;
}

export const CustomFieldRow: FC<ICustomFieldRowProps> = ({
  field,
  index,
  remove,
  form,
  isDefinitionLocked,
}) => {
  const srNo = index + 1;

  const fieldObject = form.getFieldValue(['customFields', field]);

  return (
    <Flex style={{ marginBottom: '0.5rem' }}>
      <DzBox style={{ width: '2rem', paddingTop: '1rem' }}>
        <Text>{srNo}.</Text>
      </DzBox>
      <Row style={{ flex: 1 }} gutter={8}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <FieldNameInput
            name={[field, 'label']}
            form={form}
            fieldIndex={field}
            disabled={isDefinitionLocked && fieldObject?.name}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <DataTypeSelect
            name={[field, 'type']}
            fieldIndex={field}
            form={form}
            disabled={isDefinitionLocked && fieldObject?.name}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <DateFormatSelect
            name={[field, 'format']}
            fieldIndex={field}
            form={form}
            disabled={isDefinitionLocked && fieldObject?.name}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <FieldRequiredCheckbox name={[field, 'required']} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <InclusionInput name={[field, 'inclusion']} fieldIndex={field} form={form} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <SuppressionInput name={[field, 'exclusion']} fieldIndex={field} form={form} />
        </Col>
      </Row>
      <DzBox style={{ width: '2.5rem', paddingLeft: '1rem', paddingTop: '2rem' }}>
        <DeleteFieldButton
          onClick={() => remove(index)}
          disabled={isDefinitionLocked && fieldObject?.name}
        />
      </DzBox>
    </Flex>
  );
};
