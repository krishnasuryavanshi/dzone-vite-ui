import { FormControlItem } from '@/components/form';
import { MapFunction } from '@/components/shared';
import { Col, Row } from '@/uicomponents/layout/grid';
import React, { FC } from 'react';

interface ICreateLineItemFormProps {
  fields: any[];
}

export const CreateLineItemForm: FC<ICreateLineItemFormProps> = ({fields}) => {
  return(
    <Row gutter={[16, 16]}>
      <MapFunction items={fields} renderItem={item => <Col span={6}><FormControlItem field={item}/></Col>} />
    </Row>
  );
}
