
import { Input, TextArea } from '@/uicomponents/form/input';
import styles from './create-integration-modal.module.css';
import { FormItem } from '@/uicomponents/form';

interface WebFormContentProps {
  mode?: 'create' | 'retry';
}

export const WebFormContent: React.FC<WebFormContentProps> = ({
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
        name='url'
        label='Web Form URL'
        className='input-control form-control-item'
        rules={[
          { type: 'string' },
          { required: true, message: 'Web Form URL is required' },
          {
            type: 'url',
            message: 'Please enter a valid URL',
          },
          {
            pattern: /^\S.*\S$|^\S$/,
            message: 'No trailing spaces allowed',
          },
        ]}>
        <Input
          placeholder='URL'
          className={`input-field ${styles.inputControl}`}
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        />
      </FormItem>
      {/* SCRIPT CODE FIELD - WEBFORM INTEGRATION */}
      {/* TODO: Review and update script code validation rules as per requirements */}
      {/* Script code field allows users to enter JavaScript/HTML embed codes */}
      {/* <FormItem
        name='script'
        label='Script Code'
        className='input-control form-control-item'
        rules={[
          { type: 'string' },
          { required: true, message: 'Script Code is required' },
          {
            // Validation: No trailing spaces allowed
            pattern: /^\S.*\S$|^\S$/,
            message: 'No trailing spaces allowed',
          },
          // TODO: Add additional validation for script code format if needed
          // TODO: Consider adding max length validation for script code
          // TODO: Consider validating script tags or specific code patterns
        ]}>
        <TextArea
          placeholder='Enter Script Code'
          className={`input-field ${styles.inputControl}`}
          rows={4} // Default 4 rows for script code visibility
          style={{
            resize: 'vertical', // Allow vertical resizing for longer scripts
            maxWidth: '100%',
          }}
        />
      </FormItem> */}
      {/* END SCRIPT CODE FIELD */}
    </>
  );
};
