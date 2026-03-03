
import { Input, InputPassword, Select } from '@/uicomponents/form/input';
import { IntegrationLabel } from '@/lib/enums';
import styles from './create-integration-modal.module.css';
import { FormItem } from '@/uicomponents/form';
import { IntegrationTypes } from '../lib/enums';

interface HubSpotFormContentProps {
  mode?: 'create' | 'retry';
  integrationType?: string;
}

const labelOptions = [
  { label: IntegrationLabel.PRODUCTION, value: IntegrationLabel.PRODUCTION },
  { label: IntegrationLabel.SANDBOX, value: IntegrationLabel.SANDBOX },
  { label: IntegrationLabel.CUSTOM_NAME, value: IntegrationLabel.CUSTOM_NAME },
];

export const HubSpotFormContent: React.FC<HubSpotFormContentProps> = ({
  mode = 'create',
  integrationType = IntegrationTypes.HubSpot,
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
        />
      </FormItem>

      <FormItem
        name='label'
        label='Environment Label'
        className='input-control form-control-item'
        rules={[{ required: true, message: 'Environment is required' }]}>
        <Select
          placeholder='Select the Integration Label'
          options={labelOptions}
          className={`select ${styles.inputControl}`}
          disabled={mode === 'retry'}
        />
      </FormItem>

      <FormItem
        name='apiKey'
        label={`${integrationType} Token`}
        className='input-control form-control-item'
        rules={[
          { required: true, message: 'API Key is required' },
          {
            pattern: /^\S.*\S$|^\S$/,
            message: 'No trailing spaces allowed',
          },
        ]}>
        <InputPassword
          placeholder='Enter your Token'
          className={`input-field ${styles.inputControl}`}
        />
      </FormItem>
    </>
  );
};
