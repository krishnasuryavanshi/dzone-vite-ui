import { useFormControl } from '@/lib/hooks';
import { FormItem } from '@/uicomponents/form/item';
import React, { FC } from 'react';
import { Translate } from '../i18n/translate';
import { FormControlCustomHelp } from './form-control-custom-help';
import './form-control-item.scss';
import { SelectDrawer } from '../shared';
import { InfoCircleOutlined } from '@/uicomponents/icons';

interface IFormControlItemProps {
  field: any;
  isDisabled?: boolean;
  initialValue?: string | null;
  styleForCheckBox?: React.CSSProperties;
}

export const FormControlItem: FC<IFormControlItemProps> = ({
  field,
  isDisabled,
  initialValue,
  styleForCheckBox,
}) => {
  const fieldControl = useFormControl(field);
  if (!fieldControl) {
    return null;
  }
  return (
    <>
      <FormItem
        key={field.item}
        {...field.item}
        {...(initialValue && { initialValue })}
        {...{
          label: !field.item.showLabelInControl && field.item.label && (
            <Translate i18nKey={field.item.label} />
          ),
        }}
        extra={
          <FormControlCustomHelp customHelpText={field.item.customHelpText} />
        }
        colon={false}
        disabled={isDisabled}
        className={`input-control form-control-item ${styleForCheckBox}`}>
        {fieldControl}
      </FormItem>
      <SelectDrawer
        label={field.item.label}
        {...fieldControl?.props?.customDrawerProps}
      />
    </>
  );
};
