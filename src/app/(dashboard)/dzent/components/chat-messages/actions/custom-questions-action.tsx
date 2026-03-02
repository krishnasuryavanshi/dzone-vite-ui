import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { FormInstance, FormItem, FormList } from '@/uicomponents/form';
import { Input } from '@/uicomponents/form/input';
import { DeleteOutlined, PlusOutlined } from '@/uicomponents/icons';
import { Button } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';

type CustomQuestionsActionProps = {
  validation: DzRecord;
  form: FormInstance;
  name: string;
};

export const CustomQuestionsAction = ({
  validation,
  name,
  form,
}: CustomQuestionsActionProps) => {
  return (
    <DzBox style={{ minWidth: '15rem' }}>
      <FormList name={name}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Flex
                style={{ marginBlock: '0.5rem', gap: '0.5rem' }}
                align='start'
                key={field.key}>
                <Flex vertical key={field.key} gap={'0.5rem'}>
                  <FormItem
                    {...field}
                    label='Question'
                    name={[field.name, 'question']}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter question',
                      },
                    ]}
                    noStyle>
                    <Input
                      style={{ background: CLR_WHITE }}
                      placeholder='Enter Question'
                    />
                  </FormItem>
                  <Flex gap={'0.5rem'}>
                    <FormItem
                      {...field}
                      label='Accepted Answer'
                      name={[field.name, 'acceptedAnswer']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Please enter accepted answer',
                        },
                      ]}
                      noStyle>
                      <Input
                        style={{ background: CLR_WHITE }}
                        placeholder='Enter Accepted'
                      />
                    </FormItem>
                    <FormItem
                      {...field}
                      label='Rejected Answer'
                      name={[field.name, 'rejectedAnswer']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Please enter rejected answer',
                        },
                      ]}
                      noStyle>
                      <Input
                        style={{ background: CLR_WHITE }}
                        placeholder='Enter Rejected'
                      />
                    </FormItem>
                  </Flex>
                </Flex>
                <Hideable show={fields.length > 1}>
                  <DeleteOutlined
                    style={{ color: '#ff4d4f', fontSize: '1.25rem' }}
                    className='dynamic-delete-button'
                    onClick={() => remove(field.name)}
                  />
                </Hideable>
              </Flex>
            ))}

            <FormItem>
              <Button
                type='dashed'
                size='small'
                disabled={fields?.length >= validation?.maxCount}
                onClick={() => fields?.length < validation?.maxCount && add()}
                style={{
                  width: '60%',
                  fontSize: '0.75rem',
                  border: '1px dashed #000',
                  color: '#000',
                  opacity: fields?.length >= validation?.maxCount ? 0.5 : 1,
                }}
                icon={<PlusOutlined />}>
                Add Question
              </Button>

              {/* <Form.ErrorList errors={errors} /> */}
            </FormItem>
          </>
        )}
      </FormList>
    </DzBox>
  );
};
