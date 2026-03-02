'use client';
import { Form, FormItem } from '@/uicomponents/form';
import { FC } from 'react';
import { renderField } from '../../components';
import { useCampaignForm } from '../lib/hooks';
import { ICampaign } from '../lib/types';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Flex } from '@/uicomponents/layout';
import { LoaderButton } from '@/components/shared';
import { Button } from '@/uicomponents/button';
import { Text } from '@/uicomponents/text';
import { Translate } from '@/components/i18n';

interface IContainerProps {
  campaignData: ICampaign | null;
  campaignUUId?: string;
  tenantCode?: string[] | null;
  userId?: string;
  isDzoneUser?: boolean;
}

export const FormContainer: FC<IContainerProps> = (props) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    hasChanges,
    groupedFields,
    lists,
    marketerCode,
    processFieldRules,
  } = useCampaignForm(props);
  return (
    <Form form={form} onFinish={handleSubmit} layout='vertical'>
      <Row
        gutter={16}
        justify='start'
        style={{ paddingLeft: '0.5rem', marginBottom: '2rem' }}>
        <Text
          style={{
            color: '#464343',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          <Translate i18nKey='pages.campaigns.label.requiredInfo' />
        </Text>
      </Row>
      {Object.keys(groupedFields).map((group) => (
        <Row key={group} gutter={16}>
          {groupedFields[group]
            .sort(
              (a: { order: number }, b: { order: number }) => a.order - b.order,
            )
            .map((field: any, index: React.Key | null | undefined) => {
              if (field.hidden) {
                return (
                  <FormItem key={index} name={field.field} hidden>
                    {renderField(field, lists, form, marketerCode)}
                  </FormItem>
                );
              }
              return (
                <Col key={index} span={field.span || 10}>
                  <FormItem
                    className='input-control form-control-item'
                    label={field.fieldType === 'checkbox' ? '' : field.label}
                    name={field.field}
                    rules={processFieldRules(field)}>
                    {renderField(field, lists, form, marketerCode, {
                      ioFiles: form.getFieldValue('ioFileId'),
                    })}
                  </FormItem>
                </Col>
              );
            })}
        </Row>
      ))}
      <Flex justify='end' style={{ marginBottom: '3rem', marginRight: '2rem' }}>
        {isSubmitting ? (
          <LoaderButton style={{ width: '9.25rem' }} />
        ) : (
          <Button
            htmlType='submit'
            type='primary'
            disabled={!hasChanges}
            style={{ boxShadow: 'none' }}>
            {props?.campaignUUId ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        )}
      </Flex>
    </Form>
  );
};
