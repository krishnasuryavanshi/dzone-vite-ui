import { FormLayout } from '@/uicomponents/form';

export const loginConfig = {
  meta: {
    name: 'login',
    className: 'login',
    layout: 'vertical' as FormLayout,
  },
  fields: {
    email: {
      item: {
        name: 'email',
        label: 'form.login.email.label',
        rules: [{ required: true, type: 'email', message: 'form.login.email.required' }],
      },
      input: {
        type: 'text',
        placeholder: 'form.login.email.placeholder',
      },
    },
    password: {
      item: {
        name: 'password',
        label: 'form.login.password.label',
        rules: [
          { required: true, message: 'form.login.password.required' },
          { min: 8, message: 'form.login.password.invalid' },
        ],
      },
      input: {
        type: 'password',
        placeholder: 'form.login.password.placeholder',
      },
    },
  },
};
