import { Rule } from 'antd/es/form';

export const ftpFormValidationRules = {
  name: [
    { type: 'string' },
    { required: true, message: 'Name is required' },
    {
      pattern: /^[a-zA-Z0-9$_\- ]+$/,
      message: 'Only alphanumeric characters, spaces, and $, -, _ are allowed',
    },
    { max: 255, message: 'Name must not exceed 255 characters' },
    {
      validator: (_: any, value: string) => {
        if (value && (value.startsWith(' ') || value.endsWith(' '))) {
          return Promise.reject('Leading and trailing spaces are not allowed');
        }
        return Promise.resolve();
      },
    },
  ] as Rule[],

  host: [
    { type: 'string' },
    { required: true, message: 'Host is required' },
    { pattern: /^\S.*\S$|^\S$/, message: 'No trailing spaces allowed' },
  ] as Rule[],

  port: [
    { type: 'number' },
    { required: true, message: 'Port is required' },
    {
      min: 1,
      max: 65535,
      type: 'number',
      message: 'Port must be between 1 and 65535',
    },
  ] as Rule[],

  userName: [
    { type: 'string' },
    { required: true, message: 'User Name is required' },
    { pattern: /^\S.*\S$|^\S$/, message: 'No trailing spaces allowed' },
  ] as Rule[],

  password: [{ type: 'string' }, { required: true, message: 'Password is required' }] as Rule[],

  privateKeyPassword: [{ type: 'string' }] as Rule[],

  remotePath: [
    { type: 'string' },
    {
      validator: (_: any, value: string) => {
        if (value && value.trim()) {
          const trimmedValue = value.trim();

          if (!trimmedValue.startsWith('/')) {
            return Promise.reject(
              'Path must start with a forward slash (e.g., /path/to/directory)',
            );
          }

          if (trimmedValue.includes('//')) {
            return Promise.reject('Path cannot contain consecutive slashes');
          }

          if (trimmedValue.includes('../') || trimmedValue.includes('..\\')) {
            return Promise.reject('Path cannot contain directory traversal patterns (../ or ..\\)');
          }

          const invalidCharsRegex = /[`$&;|><*?{}\\]/;
          if (invalidCharsRegex.test(trimmedValue)) {
            return Promise.reject(
              'Path contains invalid characters. Avoid using: ` $ & ; | > < * ? { } \\',
            );
          }

          if (trimmedValue.length > 255) {
            return Promise.reject('Path is too long (maximum 255 characters)');
          }
        }
        return Promise.resolve();
      },
    },
  ] as Rule[],
};
