import { TableProps } from '@/lib/types/uicomponents';
import { Filters, createColumn } from '@/lib/utils/table';
import { pick } from 'lodash';
import { useEffect, useState } from 'react';
import { checkPermission } from '@/lib/utils';
import { usePermissionsStore } from '@/stores/permissions-store';
import { useSession } from '@/lib/hooks/use-session';
import { LineItemFields } from '../../line-items/lib/enums';
import { CampaignField } from '../../campaigns/lib/enums';
import {
  assignedToNamesRenderer,
  completionProgressIndicator,
  dateRenderer,
  statusRenderer,
} from '../utils/renderers';
import { actionsRenderer } from '../../campaigns/lib/utils/renderers';
import {
  lineItemActionsRenderer,
  supplierAssignmentRenderer,
} from '../../line-items/lib/utils/renderers';
import {
  campaignNameIdRenderer,
  campaignNameIdRendererNoBadge,
  lineItemNameIdRenderer,
  marketerNameIdRenderer,
} from '../utils/column-merger';

const ListColumns = [
  'columnTranslationKey',
  'label',
  'field',
  'dataIndex',
  'columnMetadata',
  'renderer',
];
type RendererType<T> = (value: any, record: T, index: number) => React.ReactNode;

type RendererFunction = (value: any, record: any, index: number) => React.ReactNode;

export function useListColumns<T>(
  config: any, //TODO: fix type
  hasFilters?: boolean,
  filteredInfo?: Filters<T>,
  options?: Record<string, any>,
) {
  const { accesses, attributes } = usePermissionsStore();
  const { data } = useSession();
  const [listColumns, setListColumns] = useState<TableProps<T>['columns']>([]);

  useEffect(() => {
    if (config?.length && options?.isReady) {
      prepareColumns();
    }
  }, [config?.length, filteredInfo, options]);

  const getRenderer = (rendererKey: string | undefined) => {
    const renderersMap: Record<string, RendererFunction> = {
      statusRenderer,
      actionsRenderer,
      lineItemActionsRenderer,
      completionProgressIndicator,
      assignedToNamesRenderer,
      dateRenderer,
      supplierAssignmentRenderer,
      campaignNameIdRenderer,
      campaignNameIdRendererNoBadge,
      lineItemNameIdRenderer,
      marketerNameIdRenderer,
    };
    return rendererKey && renderersMap[rendererKey] ? renderersMap[rendererKey] : undefined;
  };

  const prepareColumns = () => {
    const createColumnItem = createColumn<T>(hasFilters, filteredInfo);
    const specialFields = [
      LineItemFields.LeadsDeliveryPercentage,
      CampaignField.TotalLineItems,
      CampaignField.LineItemsDeliveryPercentage,
      CampaignField.Actions,
      LineItemFields.Actions,
    ];
    // Check if user has only one tenant code
    const tenantCodes = data?.tenantCode || [];
    const hasSingleTenant = tenantCodes.length === 1;
    const marketerFields = [
      CampaignField.Marketer,
      LineItemFields.Marketer,
      CampaignField.MarketerCode,
      CampaignField.TenantCode,
      LineItemFields.MarketerCode,
      LineItemFields.TenantCode,
    ];

    let listFields = config
      .filter(
        (field: {
          permissions: { view: string | string[] };
          field: LineItemFields | CampaignField | string;
          columnOrder: any;
        }) => {
          // Hide marketer/tenant fields if single tenant
          if (hasSingleTenant && marketerFields.includes(field.field as any)) {
            return false;
          }
          const hasPermission = checkPermission(
            field.permissions?.view,
            specialFields.includes(field.field as any) ? accesses : attributes,
          );
          const isVisible =
            !options?.hiddenColumns?.includes(field.field) && field.columnOrder && hasPermission;
          return isVisible || field.field === LineItemFields.SupplierName;
        },
      )
      .sort(
        (a: { columnOrder: number }, b: { columnOrder: number }) => a.columnOrder - b.columnOrder,
      )
      .map((field: any) => {
        const col = pick(field, ListColumns);
        const renderer = getRenderer(col.renderer);
        // Only pass renderer if it's a function, not a string
        return createColumnItem(
          col.columnTranslationKey,
          col.dataIndex || col.field,
          col.columnMetadata,
          renderer as RendererType<T>,
          options,
        );
      });
    setListColumns(listFields);
  };

  return listColumns;
}
