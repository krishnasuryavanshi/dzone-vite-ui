import { Input, InputPassword } from '@/uicomponents/form/input';
import { FormItem } from '@/uicomponents/form';
import { FC } from 'react';
import './form-control.scss';
import { Translate } from '@/components/i18n';
import { useTranslation } from 'react-i18next';

interface IFormControlProps {
  field: any;
  isDisabled?: boolean;
  fixed?: boolean;
  show?: boolean;
  initialValue?: string | null;
  allowClientEdit?: boolean;
}

export const FormControl: FC<IFormControlProps> = ({
  field,
  isDisabled,
  initialValue,
  show = true,
  allowClientEdit,
}) => {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  field.item.rules.forEach((rule: any) => {
    if (rule.message) {
      rule.message = t(rule.message);
    }
  });

  const InputFied = field.input.type === 'password' ? InputPassword : Input;
  const inputClassName =
    field.input.type === 'password'
      ? 'input-field login-password-field'
      : 'input-field login-input-field';

  return (
    <FormItem
      key={field.item}
      {...field.item}
      {...(initialValue && { initialValue })}
      label={<Translate i18nKey={field.item.label} />}
      disabled={isDisabled}
      className='input-control'>
      <InputFied
        {...field.input}
        className={inputClassName}
        disabled={isDisabled}
        placeholder={t(field.input.placeholder)}
      />
    </FormItem>
  );
};
