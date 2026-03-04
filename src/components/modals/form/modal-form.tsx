import { ModalProps } from '@/lib/types/uicomponents';
import { Modal } from '@/uicomponents';
import { Form } from '@/uicomponents/form';
import React, { FC, PropsWithChildren, ReactNode } from 'react';
import { FormFooter } from './form-footer';

import './modal-form.scss';
import { FormHeader } from './form-header';
import { FormSubHeader } from './form-sub-header';
import { DzBox } from '@/components/layout/v1';

interface IModalFormProps extends ModalProps, PropsWithChildren {
  handleCancel: () => void;
  handleSubmit?: (values: any) => void;
  formProps: any;
  extra?: ReactNode;
}

export const ModalForm: FC<IModalFormProps> = ({
  extra,
  formProps,
  handleCancel,
  handleSubmit,
  children,
  ...modalProps
}) => {
  return (
    <Modal
      className='dz-modal-form'
      width={modalProps.width || '70%'}
      open={modalProps.open}
      onCancel={handleCancel}
      footer={modalProps.footer || null}
      closable={modalProps.closable || false}
      {...modalProps}
    >
      <FormHeader heading={formProps.heading}></FormHeader>
      <DzBox className='extra-content'>{extra ? extra : null}</DzBox>
      <Form
        {...formProps.meta}
        form={formProps.form}
        onFinish={formProps.onFinish}
        className='dz-form'
      >
        <FormSubHeader subHeading={formProps.subHeading}></FormSubHeader>
        <DzBox className='dz-modal-form-body'>{children}</DzBox>
        <FormFooter onCancel={handleCancel} onSubmit={handleSubmit}></FormFooter>
      </Form>
    </Modal>
  );
};
