import { Input, InputPassword, InputNumber } from '@/uicomponents/form/input';
import { FormItem } from '@/uicomponents/form';
import { Space } from '@/uicomponents/layout';
import { useEffect, useImperativeHandle } from 'react';
import styles from './create-integration-modal.module.css';
import autofillStyles from './ftp-form-autofill-override.module.css';
import { ftpFormValidationRules } from '../lib/validations';
import { FTP_FORM_CONSTANTS, FTP_INPUT_STYLES } from '../lib/constants';
import { useFtpFileUpload } from '../hooks';
import { FtpFileUploadSection } from './ftp-file-upload-section';

interface FtpFormContentProps {
  mode?: 'create' | 'retry';
  form?: any;
  open?: boolean;
  ref?: React.Ref<FtpFormContentRef>;
}

export interface FtpFormContentRef {
  resetFiles: () => void;
}

export const FtpFormContent = ({ mode = 'create', form, open, ref }: FtpFormContentProps) => {
  const { fileList, isUploading, uploadProps, handleRemoveFile, resetFileState } = useFtpFileUpload(
    form,
    open || false,
  );

  // Expose resetFiles method to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      resetFiles: resetFileState,
    }),
    [resetFileState],
  );

  // Clear autofilled values when modal opens (only for browser autofill prevention)
  useEffect(() => {
    if (open && form) {
      // Multiple attempts with different delays to clear autofilled values
      const timers = [
        setTimeout(() => {
          form.setFieldsValue({
            userName: '',
            password: '',
            privateKeyPassword: '',
          });
        }, 50),
        setTimeout(() => {
          form.setFieldsValue({
            userName: '',
            password: '',
            privateKeyPassword: '',
          });
        }, 200),
        setTimeout(() => {
          const currentValues = form.getFieldsValue();
          // Force clear if any values are detected
          if (
            currentValues.userName ||
            currentValues.password ||
            currentValues.privateKeyPassword
          ) {
            form.setFieldsValue({
              userName: '',
              password: '',
              privateKeyPassword: '',
            });
          }
        }, 500),
      ];

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [open, form]);

  return (
    <div className={autofillStyles.autofillOverride}>
      {/* Hidden dummy fields to confuse browser autofill */}
      <Space
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <Input type='text' name='fake_username' autoComplete='username' tabIndex={-1} />
        <Input type='password' name='fake_password' autoComplete='current-password' tabIndex={-1} />
      </Space>

      <FormItem
        name='name'
        label='Name'
        className='input-control form-control-item'
        rules={ftpFormValidationRules.name}
      >
        <Input
          placeholder='Enter Integration Name'
          className={`input-field ${styles.inputControl}`}
          disabled={mode === 'retry'}
          autoComplete='off'
          maxLength={FTP_FORM_CONSTANTS.MAX_NAME_LENGTH}
          style={FTP_INPUT_STYLES}
        />
      </FormItem>

      <FormItem
        name='host'
        label='Host'
        className='input-control form-control-item'
        rules={ftpFormValidationRules.host}
      >
        <Input
          placeholder='Enter your FTP or SFTP server address'
          className={`input-field ${styles.inputControl}`}
          style={FTP_INPUT_STYLES}
          autoComplete='off'
        />
      </FormItem>

      <FormItem
        name='port'
        label='Port'
        className='input-control form-control-item'
        initialValue={FTP_FORM_CONSTANTS.DEFAULT_PORT}
        rules={ftpFormValidationRules.port}
      >
        <InputNumber
          placeholder='Enter Port (e.g., 21 for FTP, 22 for SFTP)'
          className={`input-field ${styles.inputControl}`}
          style={{ width: '100%' }}
          min={1}
          max={65535}
        />
      </FormItem>

      <FormItem
        name='userName'
        label='FTP User Name'
        className='input-control form-control-item'
        rules={ftpFormValidationRules.userName}
      >
        <Input
          placeholder='Enter FTP User Name'
          className={`input-field ${styles.inputControl}`}
          style={FTP_INPUT_STYLES}
          autoComplete='new-password'
          inputMode='text'
          // Prevent browser autofill
          data-lpignore='true'
          data-form-type='other'
          data-1p-ignore='true'
          name='ftp_user_name_field'
          id='ftp_user_name_field'
          spellCheck={false}
        />
      </FormItem>

      <FormItem
        name='password'
        label='FTP Password'
        className='input-control form-control-item'
        rules={ftpFormValidationRules.password}
      >
        <InputPassword
          placeholder='Enter FTP Password'
          className={`input-field ${styles.inputControl}`}
          style={FTP_INPUT_STYLES}
          autoComplete='new-password'
          // Prevent browser autofill
          data-lpignore='true'
          data-form-type='other'
          data-1p-ignore='true'
          data-bwignore='true'
          name='ftp_password_field'
          id='ftp_password_field'
          spellCheck={false}
        />
      </FormItem>

      <FormItem
        name='privateKeyFileId'
        label='Private Key File'
        className='input-control form-control-item'
        tooltip='Upload a private key file for key-based authentication (.pem, .ppk, .key)'
        rules={[]}
      >
        <FtpFileUploadSection
          fileList={fileList}
          isUploading={isUploading}
          uploadProps={uploadProps}
          onRemoveFile={handleRemoveFile}
        />
      </FormItem>

      <FormItem
        name='privateKeyPassword'
        label='Private Key File Password'
        className='input-control form-control-item'
        tooltip='Optional password for encrypted private key files'
        rules={ftpFormValidationRules.privateKeyPassword}
      >
        <InputPassword
          placeholder='Enter Private File Password'
          className={`input-field ${styles.inputControl}`}
          style={FTP_INPUT_STYLES}
          autoComplete='new-password'
          // Prevent browser autofill
          data-lpignore='true'
          data-form-type='other'
          data-1p-ignore='true'
          data-bwignore='true'
          name='private_key_password_field'
          id='private_key_password_field'
          spellCheck={false}
        />
      </FormItem>

      <FormItem
        name='remotePath'
        label='Remote Directory Path'
        className='input-control form-control-item'
        tooltip='Optional: Specify the remote directory path where files will be uploaded (e.g., /uploads/files)'
        rules={ftpFormValidationRules.remotePath}
      >
        <Input
          placeholder='e.g., /uploads/files (optional)'
          className={`input-field ${styles.inputControl}`}
          style={FTP_INPUT_STYLES}
          autoComplete='off'
        />
      </FormItem>
    </div>
  );
};
