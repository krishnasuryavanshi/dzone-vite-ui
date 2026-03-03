
import { Input } from '@/uicomponents/form/input';
import { TextArea } from '@/uicomponents/form/input/textarea';
import { Select } from '@/uicomponents/form/input/select';
import styles from './create-integration-modal.module.css';
import { FormItem } from '@/uicomponents/form';
import { ZAPIER_TYPE_OPTIONS } from '../lib/constants/zapier-types';

interface ZapierFormContentProps {
  mode?: 'create' | 'retry';
}

export const ZapierFormContent: React.FC<ZapierFormContentProps> = ({
  mode = 'create',
}) => {
  return (
    <>
      <FormItem
        name='name'
        label='Name'
        className='input-control form-control-item'
        rules={[
          { type: 'string' },
          { required: true, message: 'Name is required' },
          {
            pattern: /^[a-zA-Z0-9$_\- ]+$/,
            message:
              'Only alphanumeric characters, spaces, and $, -, _ are allowed',
          },
          {
            max: 255,
            message: 'Name must not exceed 255 characters',
          },
          {
            validator: (_, value) => {
              if (value && (value.startsWith(' ') || value.endsWith(' '))) {
                return Promise.reject(
                  'Leading and trailing spaces are not allowed',
                );
              }
              return Promise.resolve();
            },
          },
        ]}>
        <Input
          placeholder='Enter Integration Name'
          className={`input-field ${styles.inputControl}`}
          disabled={mode === 'retry'}
          maxLength={255}
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        />
      </FormItem>

      <FormItem
        name='label'
        label='Type'
        className='input-control form-control-item'
        rules={[{ required: true, message: 'Type is required' }]}>
        <Select
          placeholder='Select Type'
          className={`input-field ${styles.inputControl}`}
          style={{
            width: '100%',
          }}>
          {ZAPIER_TYPE_OPTIONS.map((option) => (
            <Select.Option key={option.value} value={option.label}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </FormItem>

      <FormItem
        name='url'
        label='Zapier URL'
        className='input-control form-control-item'
        rules={[
          { type: 'string' },
          { required: true, message: 'Zapier URL is required' },
          // {
          //   type: 'url',
          //   message: 'Please enter a valid URL',
          // },
          {
            pattern: /^\S.*\S$|^\S$/,
            message: 'No trailing spaces allowed',
          },
          // {
          //   validator: (_, value) => {
          //     if (value && !value.includes('zapier.com')) {
          //       return Promise.reject(
          //         'Please enter a valid Zapier webhook URL',
          //       );
          //     }
          //     return Promise.resolve();
          //   },
          // },
        ]}>
        <Input
          placeholder='Enter Zapier URL'
          className={`input-field ${styles.inputControl}`}
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        />
      </FormItem>

      <FormItem
        name='headers'
        label='Header'
        className='input-control form-control-item'
        rules={[
          {
            validator: (_, value) => {
              if (value) {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (e) {
                  return Promise.reject('Please enter valid JSON');
                }
              }
              return Promise.resolve();
            },
          },
        ]}>
        <TextArea
          placeholder='{"Header": "value"} json file'
          className={`input-field ${styles.inputControl}`}
          rows={4}
          style={{
            resize: 'none',
          }}
        />
      </FormItem>
    </>
  );
};
