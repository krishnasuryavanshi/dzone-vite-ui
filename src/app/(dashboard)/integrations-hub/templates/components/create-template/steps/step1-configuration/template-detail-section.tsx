
import {
  REQUIRED_FIELD,
  TEMPLATE_DESCRIPTION_TRAILING_SPACES,
  TEMPLATE_NAME_LENGTH,
  TEMPLATE_NAME_TRAILING_SPACES,
} from '@/app/(dashboard)/campaign-management/lib/constants';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { FormItem } from '@/uicomponents/form';
import { Input } from '@/uicomponents/form/input';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';

interface TemplateDetailSectionProps {
  templateId?: string;
}

export const TemplateDetailSection: FC<TemplateDetailSectionProps> = ({
  templateId,
}) => {
  const isEditTemplateAllowed = usePermissionCheck(
    DeliveryTemplateActionsEnum.Edit,
  );

  return (
    <DzBox dzOneBox style={{ marginBottom: '0.5rem' }}>
      <Text
        style={{
          fontSize: '16px',
          fontWeight: '600',
        }}>
        Template Detail
      </Text>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FormItem
            className='input-control form-control-item'
            name='name'
            label={<Translate i18nKey='pages.templates.label.templateName' />}
            rules={[
              { type: 'string' },
              { required: true, message: REQUIRED_FIELD },
              {
                pattern: /^\S.*\S$|^\S$/,
                message: TEMPLATE_NAME_TRAILING_SPACES,
              },
              {
                min: 3,
                message: TEMPLATE_NAME_LENGTH,
              },
            ]}>
            <Input
              className='input-field'
              placeholder='Enter Template Name'
              disabled={Boolean(templateId && !isEditTemplateAllowed)}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            className='input-control form-control-item'
            name='description'
            label={
              <Translate i18nKey='pages.templates.label.templateDescription' />
            }
            rules={[
              { type: 'string' },
              {
                pattern: /^\S.*\S$|^\S$/,
                message: TEMPLATE_DESCRIPTION_TRAILING_SPACES,
              },
            ]}>
            <Input
              className='input-field'
              placeholder='Enter Template Description'
              disabled={Boolean(templateId && !isEditTemplateAllowed)}
            />
          </FormItem>
        </Col>
      </Row>
    </DzBox>
  );
};
