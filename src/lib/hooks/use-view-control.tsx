import { ReactNode } from 'react';
import { FieldType } from '../enums';
import { DrawerListView, FileView, TextView } from '@/components/shared/text';
import { FormatDate } from '@/components/util';
import { t } from 'i18next';
import { LineItemFields } from '@/app/(dashboard)/campaign-management/line-items/lib/enums';

export const useViewControl = (
  data: Record<string, any>,
  handleDownloadFiles: () => Promise<void>,
) => {
  let ViewControl: ReactNode = null;
  switch (data.viewType) {
    case FieldType.CustomComponent: {
      const CustomComponent = data.viewComponent;
      ViewControl = <CustomComponent value={data.value} label={data.label} />;
      break;
    }
    case FieldType.FileUpload: {
      ViewControl = (
        <FileView handleDownloadFiles={handleDownloadFiles} value={data.value} label={data.label} />
      );
      break;
    }
    case FieldType.GroupedSelect:
    case FieldType.Multiselect: {
      ViewControl = <DrawerListView value={data.value} label={data.label} />;
      break;
    }
    case FieldType.Date: {
      ViewControl = <FormatDate date={data.value} outputFormat='DD MMM YYYY' />;
      break;
    }

    default:
      if (
        data.field === LineItemFields.IsCompanySizeEmployeeCountCustom ||
        data.field === LineItemFields.IsCompanySizeRevenueCustom
      ) {
        ViewControl = (
          <TextView
            value={data.value === false ? t('Predefined range') : t('Custom range')}
            label={data.label}
          />
        );
      } else {
        ViewControl = <TextView value={data.value} label={data.label} />;
      }
      break;
  }
  return ViewControl;
};
