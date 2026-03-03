import { DzBox, DzTheme } from '@/components/layout/v1';
import { Form, FormItem, useForm } from '@/uicomponents/form';
import { InputPassword } from '@/uicomponents/form/input';
import { SetPasswordIcon } from '@/uicomponents/icons/svgs';
import { Button } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { Title } from '@/uicomponents/title';
import React, { FC, useState } from 'react';
import { ValidationMessages } from './validation-messages';
import { setPassword } from '../services';
import { showNotification } from '@/services/notification';
import { useRouter } from '@/lib/hooks/use-router';

type SetPasswordPropsType = {
  token: string;
};

export const SetPassword: FC<SetPasswordPropsType> = ({ token }) => {
  const router = useRouter();
  const [customValidation, setCustomValidation] = useState({
    CHAR_LENGTH: {
      regex: /(?=.{8,})/,
      message: 'Must be at least 8 characters long',
      isPassed: false,
    },
    CHAR_CASE: {
      regex: /(?=.*[a-z])(?=.*[A-Z])/,
      message: 'Must contain an uppercase and a lowercase ',
      isPassed: false,
    },
    CHAR_NUM: {
      regex: /(?=.*[0-9])/,
      message: 'Must contain a number',
      isPassed: false,
    },
    CHAR_SPE: {
      regex: /(?=.*[!@#$%^&*])/,
      message: 'Must contain a special character',
      isPassed: false,
    },
  });

  const [form] = useForm();

  const onFinish = async (values: { password: string }) => {
    const { password } = values;
    try {
      const data = await setPassword(password, token);
      showNotification({
        type: 'success',
        message: data?.message,
      });
      router.push('/login');
    } catch (error) {}
  };

  return (
    <DzTheme theme='blueV2'>
      <Flex justify='center' align='center' style={{ height: '100%' }}>
        <Flex
          vertical
          gap={'1.75rem'}
          align='center'
          justify='center'
          style={{ width: '25rem' }}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Set Up Your Password
          </Title>

          <DzBox>
            <Flex
              align='center'
              justify='center'
              style={{
                height: '6.25rem',
                width: '6.25rem',
                borderRadius: '50%',
                background: '#D7DCEA',
              }}>
              <SetPasswordIcon />
            </Flex>
          </DzBox>

          <Form
            layout='vertical'
            style={{ width: '100%' }}
            size='large'
            form={form}
            onFinish={onFinish}
            variant='outlined'>
            <DzBox style={{ width: '100%' }}>
              <Flex vertical gap={'2rem'}>
                <Flex vertical gap={'0.5rem'}>
                  <FormItem
                    name='password'
                    label='Enter Password'
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value) {
                            return Promise.reject(
                              new Error('Please enter your password!'),
                            );
                          }

                          const validations = { ...customValidation };
                          Object.keys(customValidation).forEach((key) => {
                            if (
                              customValidation[
                                key as keyof typeof customValidation
                              ].regex.test(value)
                            ) {
                              validations[
                                key as keyof typeof customValidation
                              ].isPassed = true;
                            } else {
                              validations[
                                key as keyof typeof customValidation
                              ].isPassed = false;
                            }
                          });
                          setCustomValidation(validations);
                          const isInvalid = Object.keys(validations).some(
                            (key) =>
                              !validations[key as keyof typeof validations]
                                .isPassed,
                          );
                          if (isInvalid) {
                            return Promise.reject(
                              new Error(
                                'Password does not meet the requirements!',
                              ),
                            );
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}>
                    <InputPassword style={{ background: '#fff' }} />
                  </FormItem>
                  <ValidationMessages customValidation={customValidation} />
                </Flex>

                <FormItem
                  name='confirm'
                  label='Confirm Password'
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            'The new password that you entered do not match!',
                          ),
                        );
                      },
                    }),
                  ]}>
                  <InputPassword style={{ background: '#fff' }} />
                </FormItem>
                <FormItem style={{ alignSelf: 'end' }}>
                  <Button type='primary' htmlType='submit'>
                    Set Password & Continue
                  </Button>
                </FormItem>
              </Flex>
            </DzBox>
          </Form>
        </Flex>
      </Flex>
    </DzTheme>
  );
};
