import { formatCustomFieldsPayload } from '@/app/(dashboard)/campaign-management/line-items/lib/utils/custom-fields';
import { Hideable, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { FormItem, useForm } from '@/uicomponents/form';
import { Flex } from '@/uicomponents/layout';
import { useEffect, useState } from 'react';
import { NoFormActionTypes } from '../../../lib/const';
import { SystemMessageActionsEnum } from '../../../lib/enums';
import { useDzentStore } from '../../../store';
import {
  ActionButtonsWrapper,
  ActionsForm,
  CheckboxGroupOptions,
  CustomFieldsAction,
  CustomQuestionsAction,
  DatepickerAction,
  DaterangePickerAction,
  DropdownAction,
  FileUploadAction,
  RadioButtonGroup,
} from '../actions';

import { Text } from '@/uicomponents/text';
import { HtmlContent } from '../instructions';
import './system-message-actions.scss';

type SystemMessageActionsProps = {
  actions: DzRecord[];
};

export const SystemMessageActions = ({ actions }: SystemMessageActionsProps) => {
  const [hasFormActions, setHasFormActions] = useState(false);
  const [hasCancelAction, setHasCancelAction] = useState(false);

  const [form] = useForm();
  const actionsMap = actions.reduce((acc, action) => {
    if (!action.field) return acc;
    acc[action.field.name] = action?.field;
    return acc;
  }, {} as DzRecord);

  useEffect(() => {
    // Reset form to initial state when actions change
    form.resetFields();

    if (
      actions.every(
        ({ field }: DzRecord) => !field || (field && NoFormActionTypes.includes(field.type)),
      )
    ) {
      setHasFormActions(false);
    } else {
      setHasFormActions(!!actions?.length);
    }

    if (actions?.length) {
      const hasMultiFileUpload = actions.some(
        (action) => action.type === SystemMessageActionsEnum.MultiFileUpload,
      );
      setHasCancelAction(hasMultiFileUpload);
    }
  }, [actions, form]);

  const { handleUserMessage } = useDzentStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const userMessageData: DzRecord[] = [];
      const processedKeys = new Set<string>();

      Object.keys(values).forEach((key) => {
        // Skip if already processed (e.g., customFieldInstructions handled with customFields)
        if (processedKeys.has(key)) return;

        const action = actionsMap[key];
        if (!action) return;

        // Special handling for CustomFields - combine customFields and customFieldInstructions
        if (action.type === SystemMessageActionsEnum.CustomFields) {
          // Use the existing formatCustomFieldsPayload utility to format with name, position, format fields
          const formattedPayload = formatCustomFieldsPayload({
            customFields: values.customFields || [],
            customFieldInstructions: values.customFieldInstructions || '',
          });

          processedKeys.add('customFields');
          processedKeys.add('customFieldInstructions');

          userMessageData.push({
            type: action.type,
            name: action.name,
            label: action.label,
            value: formattedPayload,
            skip: !values.customFields?.length,
          });
          return;
        }

        userMessageData.push({
          type: action.type,
          name: action.name,
          label: action.label,
          value: values[key] || null,
          skip: !values[key],
        });
      });

      await handleUserMessage({ userMessage: null, fields: userMessageData });
    } catch (error) {}
  };

  const handleSkip = async () => {
    const skipAllFields = actions.map(({ field }: DzRecord) => ({
      type: field.type,
      name: field.name,
      label: field.label,
      value: null,
      skip: true,
    }));
    await handleUserMessage({
      userMessage: null,
      fields: skipAllFields,
    });
  };

  const handleCancel = () => {
    form.resetFields();
  };

  const renderActionItem = (systemMessage: DzRecord, index: number) => {
    const MessageComponent = (
      <Hideable show={!!systemMessage.message}>
        <HtmlContent style={{ marginBottom: '0.5rem' }} htmlStr={systemMessage.message} />
      </Hideable>
    );
    if (!systemMessage.field) {
      return <>{MessageComponent}</>;
    }

    const action = systemMessage.field as DzRecord;
    if (action.type === SystemMessageActionsEnum.CustomQuestions) {
      return (
        <>
          <>{MessageComponent}</>
          <CustomQuestionsAction
            key={index}
            name={action.name}
            validation={action.validation}
            form={form}
          />
        </>
      );
    }

    let FormControl = null;
    let props = {};
    switch (action.type) {
      case SystemMessageActionsEnum.Actions:
        FormControl = ActionButtonsWrapper;
        props = {
          handleSubmit,
        };
        break;

      case SystemMessageActionsEnum.Radio:
        FormControl = RadioButtonGroup;
        break;

      case SystemMessageActionsEnum.Checkbox:
        FormControl = CheckboxGroupOptions;
        break;

      case SystemMessageActionsEnum.SinglePicklist:
      case SystemMessageActionsEnum.MultiPicklist:
      case SystemMessageActionsEnum.CustomRangeOptionsPicklist:
        props = {
          searchable: true,
          multiple: action.type !== SystemMessageActionsEnum.SinglePicklist,
          customRangeOptions: action.type === SystemMessageActionsEnum.CustomRangeOptionsPicklist,
        };
        FormControl = DropdownAction;
        break;

      case SystemMessageActionsEnum.Date:
        props = {
          validations: action.validations,
        };
        FormControl = DatepickerAction;
        break;

      case SystemMessageActionsEnum.Daterange:
        props = {
          validations: action.validations,
        };
        FormControl = DaterangePickerAction;
        break;

      case SystemMessageActionsEnum.MultiFileUpload:
        props = {
          config: action.config,
          multiple: true,
        };
        FormControl = FileUploadAction;
        break;

      case SystemMessageActionsEnum.SingleFileUpload:
        props = {
          config: action.config,
          multiple: false,
        };
        FormControl = FileUploadAction;
        break;

      case SystemMessageActionsEnum.CustomFields:
        FormControl = CustomFieldsAction;
        break;

      default:
        return <>{MessageComponent}</>;
    }

    if (!FormControl) return null;

    return (
      <>
        <>{MessageComponent}</>
        <FormItem
          name={action.name}
          key={index}
          label={action.label ? <Text style={{ fontSize: '0.875rem' }}>{action.label}</Text> : null}
        >
          <FormControl options={action.options} name={action.name} form={form} {...props} />
        </FormItem>
      </>
    );
  };

  return (
    <>
      <Hideable show={!!actions?.length}>
        <ActionsForm
          form={form}
          hasFormActions={hasFormActions}
          hasCancelAction={hasCancelAction}
          onSkip={handleSkip}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        >
          <Flex vertical>
            <MapFunction items={actions} renderItem={renderActionItem} />
          </Flex>
        </ActionsForm>
      </Hideable>
    </>
  );
};
