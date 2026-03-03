import { FileUpload } from '@/components/shared/file-upload';
import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  TextArea,
} from '@/uicomponents/form/input';
import { GroupedSelect } from '@/uicomponents/grouped-select';
import { t } from 'i18next';
import { useState } from 'react';
import { FieldType } from '../enums';

export function useFormControl(field: any) {
  const [visible, setVisible] = useState(false);
  const [omittedValues, setOmittedValues] = useState<Record<string, any>[]>([]);

  const showDrawer = (e: any, values: Record<string, any>[]) => {
    setOmittedValues(values);
    setVisible(true);
  };

  const closeDrawer = (e: any) => {
    e.preventDefault();
    setVisible(false);
  };

  if (field.input.type === FieldType.CustomComponent) {
    const CustomComponent = field.component;
    return (
      <CustomComponent customProps={{ ...field.customProps, ...field.input }} />
    );
  }
  if (field.input.type === FieldType.FileUpload) {
    return <FileUpload {...field.input} />;
  }
  if (field.input.type === FieldType.Checkbox) {
    return (
      <Checkbox
        {...field.input}
        style={{ width: '100%' }}
        className={`input-field ${field.input.type} ${field.item.name}`}>
        {field.item.showLabelInControl && field.item.label
          ? t(field.item.label)
          : null}
      </Checkbox>
    );
  }
  if (field.input.type === FieldType.RadioButton) {
    const options = field.input.options || [];
    return (
      <RadioGroup
        {...field.input}
        value={field.input.value}
        style={{
          display: 'flex',
          flexDirection:
            (field.input.layout === 'horizontal' && 'row') || 'column',
        }}>
        {options.map((option: any) => {
          return (
            <Radio key={option.value} value={option.value}>
              {t(option.label)}
            </Radio>
          );
        })}
      </RadioGroup>
    );
  }
  let Control: any = null;
  let additionalProps: any = {};
  let cssClass = '';
  switch (field.input.type) {
    case FieldType.Text:
      Control = Input;
      break;
    case FieldType.Number:
      Control = InputNumber;
      break;
    case FieldType.Select:
      Control = Select;
      break;
    case FieldType.SearchableSelect:
      Control = Select;
      cssClass = 'select';
      additionalProps = {
        showSearch: true,
        filterOption: (input: string, option: Record<string, any>) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        ...additionalProps,
      };
      break;
    case FieldType.Multiselect:
      Control = Select;
      cssClass = 'select';
      additionalProps = {
        mode: 'multiple',
        showSearch: !!field.input.hasMultiselectSearch,
        filterOption: (input: string, option: Record<string, any>) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        style: { width: '100%' },
        maxTagCount: 'responsive',
        maxTagPlaceholder: (omittedValues: Record<string, any>[]) => (
          <span
            onMouseEnter={(e) => showDrawer(e, omittedValues)}
            style={{ display: 'inline-block', cursor: 'pointer' }}>
            {`+ ${omittedValues.length} more`}
          </span>
        ),
        customDrawerProps: {
          visible,
          omittedValues,
          onClose: closeDrawer,
        },
        ...additionalProps,
      };
      break;
    case FieldType.GroupedSelect:
      Control = GroupedSelect;
      additionalProps = {
        mode: 'multiple',
        options: field.input.options || [],
        style: { width: '100%' },
        maxTagCount: 'responsive',
        maxTagPlaceholder: (omittedValues: Record<string, any>[]) => (
          <span
            onMouseEnter={(e) => showDrawer(e, omittedValues)}
            style={{ display: 'inline-block', cursor: 'pointer' }}>
            {`+ ${omittedValues.length} more`}
          </span>
        ),
        customDrawerProps: {
          visible,
          omittedValues,
          onClose: closeDrawer,
        },
        ...additionalProps,
      };
      break;
    case FieldType.Date:
      Control = DatePicker;
      break;
    case FieldType.TextArea:
      Control = TextArea;
      break;
  }

  return (
    <Control
      {...field.input}
      style={{ width: '100%' }}
      className={`input-field ${field.input.type} ${field.item.name} ${cssClass}`}
      placeholder={t(field.input.placeholder)}
      {...additionalProps}
    />
  );
}
