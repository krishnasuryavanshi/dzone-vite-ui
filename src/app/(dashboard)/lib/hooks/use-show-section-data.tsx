import { FieldType } from '@/lib/enums';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { LineItemFields } from '../../campaign-management/line-items/lib/enums';
import { usePermissionsStore } from '@/stores/permissions-store';
import { checkPermission } from '@/lib/utils';

export const useShowSectionData = (
  data: any,
  completedStepId: number,
  formConfig: any,
  stepKeysList: any,
) => {
  const { accesses, attributes } = usePermissionsStore();
  const [sectionList, setSectionList] = useState<any[]>();
  useEffect(() => {
    if (data && formConfig) {
      const { translation, steps } = formConfig;
      const showData: any[] = [];
      Object.keys(steps).forEach((key) => {
        if (Number(key) >= Number(completedStepId)) {
          return;
        }
        const fields = steps[key].map((subsection: any) => {
          return subsection.fields
            .filter((field: any) => {
              const hasPermission = checkPermission(
                field.permissions?.view,
                field.field === 'actions' ? accesses : attributes,
              );
              const isVisible = field.viewOrder && hasPermission;
              return isVisible;
            })
            .map((field: any) => {
              const dataProperty = field.viewField || field.field;
              const value = getFieldValue(
                data,
                dataProperty,
                (field.fieldType === FieldType.Checkbox ||
                  field.fieldType === FieldType.RadioButton) &&
                  +key < data.stepId,
              );

              if (
                !value &&
                field.field !== LineItemFields.IsCompanySizeEmployeeCountCustom &&
                field.field !== LineItemFields.IsCompanySizeRevenueCustom
              ) {
                return null;
              }

              const fieldObject: any = {
                field: field.field,
                label: `${field.viewTranslationKey || translation}.${field.field}.label`,
                viewOrder: field.viewOrder,
                viewType: field.fieldType,
                value,
              };
              if (field.fieldType === FieldType.CustomComponent) {
                fieldObject.viewComponent = field.viewComponent;
              }
              return fieldObject;
            })
            .filter((item: any) => item);
        });
        showData.push({
          title: `${translation}.${stepKeysList[key]}`,
          fields: fields.flat().sort((a: any, b: any) => a.viewOrder - b.viewOrder),
        });
      });
      setSectionList(showData.filter((item) => item.fields.length > 0));
    }
  }, [data, formConfig]);
  return { sectionList };
};

const getFieldValue = (data: any, field: string, isCheckbox?: boolean) => {
  const value = get(data, field.split('.'));
  if (
    field === LineItemFields.IsCompanySizeEmployeeCountCustom ||
    field === LineItemFields.IsCompanySizeRevenueCustom
  ) {
    return value === undefined || value === null ? false : value;
  }
  if (isCheckbox) {
    return value ? 'Yes' : 'No';
  }
  return value;
};
