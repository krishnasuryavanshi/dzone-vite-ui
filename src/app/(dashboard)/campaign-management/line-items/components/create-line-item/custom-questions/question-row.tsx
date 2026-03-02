'use client';
import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { DeleteOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { FC, useState } from 'react';
import { FormControlItemContent } from '../../../../components';
import { sanitizeText } from '@/lib/utils/string/sanitiize-string';

interface IQuestionRowProps {
  field: any;
  restField: Record<string, any>;
  restProps?: Record<string, any>;
}

export const QuestionRow: FC<IQuestionRowProps> = ({
  field,
  restField,
  restProps,
}) => {
  const [colLayout] = useState({
    xs: 24,
    sm: 24,
    md: 24,
    lg: 8,
    xl: 8,
    xxl: 8,
  });

  if (!restProps || !restProps.form) {
    return null;
  }

  const { remove, form, childrenFields = [], lists, transKey } = restProps;
  const renderFormItem = (item: any, index: number) => {
    item.name = [field, item.field];
    const sanitizeStringOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeText(e.target.value);
      const path = [`customQuestions`, restField.srNo - 1, item.field];
      form.setFields([{ name: path, value: sanitizedValue }]);
    };

    return (
      <FormControlItemContent
        item={{ ...item, onBlur: sanitizeStringOnBlur }}
        colLayout={colLayout}
        lists={lists}
        transKey={transKey || 'form.createLineItem'}
      />
    );
  };
  return (
    <Flex style={{ marginBottom: '0.5rem' }}>
      <DzBox style={{ width: '2rem' }}>
        <Text>{restField.srNo}.</Text>
      </DzBox>
      <Row style={{ flex: 1 }} gutter={8}>
        <MapFunction items={childrenFields} renderItem={renderFormItem} />
      </Row>
      <DzBox style={{ width: '2.5rem', paddingLeft: '1rem' }}>
        <DeleteOutlined
          style={{ color: 'red', fontSize: '1.5rem' }}
          onClick={() => remove(field)}
        />
      </DzBox>
    </Flex>
  );
};
