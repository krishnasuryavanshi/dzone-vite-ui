'use client';
import React, { FC } from 'react';
import { Input, InputPassword } from '@/uicomponents/form/input';
import { Form, FormItem } from '@/uicomponents/form';
import { Skeleton } from '@/uicomponents/layout/skeleton';
import { Button } from '@/uicomponents';

export const FormLoader: FC = () => {
  return (
    <Form style={{ width: '100%' }}>
      <Skeleton loading active>
        <FormItem name='username' label='Username' rules={[{ required: true }]}>
          <Input />
        </FormItem>
        <FormItem name='password' label='Password' rules={[{ required: true }]}>
          <InputPassword />
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </FormItem>
      </Skeleton>
    </Form>
  );
};
