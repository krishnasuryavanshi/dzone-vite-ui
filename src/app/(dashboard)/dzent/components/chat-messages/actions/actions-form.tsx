import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { Button } from '@/uicomponents/button';
import { Form, FormInstance } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import React from 'react';
import { ChatWidgetActionButton } from '../../chat-widget/chat-widget-action-button';

type ActionsFormProps = {
  children?: React.ReactNode;
  form: FormInstance;
  hasFormActions?: boolean;
  hasCancelAction?: boolean;
  onCancel?: () => void;
  onSubmit: () => void;
  onSkip: () => void;
};

export const ActionsForm = ({
  children,
  form,
  hasFormActions = false,
  hasCancelAction = false,
  onCancel,
  onSubmit,
  onSkip,
}: ActionsFormProps) => {
  return (
    <Form className='chat-actions-form' form={form} layout='vertical'>
      <Flex vertical>
        <DzBox>{children}</DzBox>
        <Hideable show={hasFormActions}>
          <Flex justify='flex-end' gap={'0.5rem'}>
            <Hideable show={hasCancelAction}>
              <Button
                type='text'
                danger
                onClick={onCancel}
                size='small'
                style={{ fontSize: '0.875rem' }}
              >
                Cancel
              </Button>
            </Hideable>

            <ChatWidgetActionButton
              focused
              label='Done'
              onClick={onSubmit}
              className='action-form-submit'
            />
          </Flex>
        </Hideable>
      </Flex>
    </Form>
  );
};
