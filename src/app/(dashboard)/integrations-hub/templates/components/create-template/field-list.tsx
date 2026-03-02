import { TableLoader } from '@/components/shared/loader/table';
import { BasicTable } from '@/components/table';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck, useScrollableTableHeight } from '@/lib/hooks';
import { TableProps } from '@/lib/types/uicomponents';
import { createColumn } from '@/lib/utils/table';
import { showNotification } from '@/services/notification';
import { filter } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { ITemplateFieldResponse } from '../../lib/types/template-response';
import {
  getLastVisibleFieldIndex,
  isOrderChangeAllowed,
} from '../../lib/utils';
import { useTemplateStore } from '../../stores';
import {
  ActionCell,
  DestinationNameCell,
  OrderCell,
  SourceNameCell,
  VisibilityCell,
} from './field-row-components';
import { AiConfidenceCell } from './field-row-components/ai-confidence-cell';
import { DeliveryType } from '../../lib/enums';
import { ZapierType } from '../../../integrations/lib/constants/zapier-types';
import './field-list.scss';

const StaticContentHeight = 390;

interface IFieldListProps {
  templateId?: string;
}

export const FieldList: FC<IFieldListProps> = ({ templateId }) => {
  const {
    fields,
    updateErrorStatus,
    updateFields,
    deliveryType,
    updatedTemplateData,
  } = useTemplateStore();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);
  const sourceType = updatedTemplateData?.type || '';

  const editPermission = usePermissionCheck(DeliveryTemplateActionsEnum.Edit);
  const createPermission = usePermissionCheck(
    DeliveryTemplateActionsEnum.Create,
  );
  const isEditTemplateAllowed = templateId ? editPermission : createPermission;
  const [disabledArrowIndexes, setDisabledArrowIndexes] = useState({
    up: -1,
    down: -1,
  });
  const [list, setList] = useState([] as ITemplateFieldResponse[]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (fields?.length) {
      setList([...fields]);
    }
  }, [fields]);

  useEffect(() => {
    if (list.length) {
      updateFields(
        list.map((field, index) => ({ ...field, order: index + 1 })),
      );
    }
  }, [list]);

  useEffect(() => {
    calculateDisabledArrowIndexes();
  }, [list]);

  const calculateDisabledArrowIndexes = () => {
    const visibleFieldLastIndex = getLastVisibleFieldIndex(list);

    let hiddenFieldFirstIndex = -1;

    if (visibleFieldLastIndex >= 0) {
      hiddenFieldFirstIndex = visibleFieldLastIndex + 1;
    }

    setDisabledArrowIndexes({
      up: hiddenFieldFirstIndex,
      down: visibleFieldLastIndex,
    });
  };

  const actionRenderer = (
    _val: string,
    record: ITemplateFieldResponse,
    index: number,
  ) => {
    return <ActionCell isDisabled={!record.visible} index={index} />;
  };

  const handleOrderChange = (
    newOrder: number,
    record: ITemplateFieldResponse,
  ) => {
    const currentIndex = list.findIndex((field) => field.name === record.name);
    const currentOrder = currentIndex + 1;

    if (currentOrder === newOrder) {
      return;
    }

    const allowOrderChange = isOrderChangeAllowed(
      currentOrder,
      newOrder,
      record,
      disabledArrowIndexes,
    );
    if (!allowOrderChange) {
      showNotification({
        message: 'Operation not allowed',
        type: 'error',
      });

      return;
    }

    const fieldList = filter(
      list,
      (currentObject) => currentObject.name !== record.name,
    );

    fieldList.splice(newOrder - 1, 0, record);
    setList(fieldList);
  };

  const orderCellRenderer = (
    _val: number,
    record: ITemplateFieldResponse,
    index: number,
  ) => {
    return (
      <OrderCell
        handleOrderChange={handleOrderChange}
        disabledArrowIndexes={disabledArrowIndexes}
        templateField={record}
        id={index + 1}
        isFirst={index === 0}
        isLast={index === list.length - 1}
        isEditTemplateAllowed={isEditTemplateAllowed}
      />
    );
  };

  const handleVisibilityChange = (
    isVisible: boolean,
    record: ITemplateFieldResponse,
  ) => {
    record.visible = isVisible;

    const fieldList = filter(
      list,
      (currentObject) => currentObject.name !== record.name,
    );

    let newOrder = fieldList.length;

    if (isVisible) {
      newOrder = getLastVisibleFieldIndex(fieldList);
      newOrder += 1;
    }

    fieldList.splice(newOrder, 0, record);
    setList(fieldList);
  };

  const visibilityCellRenderer = (
    _val: boolean,
    record: ITemplateFieldResponse,
  ) => {
    return (
      <VisibilityCell
        templateField={record}
        handleVisibilityChange={handleVisibilityChange}
        isEditTemplateAllowed={isEditTemplateAllowed}
      />
    );
  };

  const handleDestinationNameChange = (
    val: string,
    record: ITemplateFieldResponse,
    index: number,
  ) => {
    record.destination = val;

    const fieldList = filter(
      list,
      (currentObject) => currentObject.name !== record.name,
    );

    fieldList.splice(index, 0, record);
    setList(fieldList);
  };

  const destinationNameCellRenderer = (
    val: string,
    record: ITemplateFieldResponse,
    index: number,
  ) => {
    return (
      <DestinationNameCell
        name={val}
        templateField={record}
        index={index}
        handleChange={handleDestinationNameChange}
        updateErros={updateErros}
        isEditTemplateAllowed={isEditTemplateAllowed}
      />
    );
  };

  const aiConfidenceCellRenderer = (
    _val: any,
    record: ITemplateFieldResponse,
  ) => {
    // Don't show confidence if field is not visible
    if (!record.visible) {
      return null;
    }

    // record.confidence is a decimal (0.8 = 80%, 1 = 100%), convert to percentage
    const confidenceDecimal = Number(record.confidence) || 0;
    // If value is <= 1, treat as decimal and convert to percentage
    const confidenceValue =
      confidenceDecimal <= 1
        ? Math.round(confidenceDecimal * 100)
        : Math.round(confidenceDecimal);
    return <AiConfidenceCell confidence={confidenceValue} />;
  };

  const updateErros = (name: string, hasError: boolean) => {
    const errorList = { ...fieldErrors, [name]: hasError };
    setFieldErrors(errorList);
    const hasFieldErros = Object.values(errorList).some((val) => val);
    if (hasFieldErros) {
      updateErrorStatus({ fieldsError: true });
    } else {
      updateErrorStatus({ fieldsError: false });
    }
  };

  const column = createColumn(false);
  const columns: TableProps<ITemplateFieldResponse>['columns'] = [
    column('pages.templates.label.order', 'order', {
      width: 100,
      disabled: true,
      render: orderCellRenderer,
    }),

    column('pages.templates.label.visibility', 'visible', {
      width: 100,
      render: visibilityCellRenderer,
    }),
    column('pages.templates.label.sourceNameColumn', 'source', {
      width: 250,
      render: (val: string) => <SourceNameCell name={val} />,
    }),
    column('pages.templates.label.destinationNameColumn', 'destination', {
      width: 250,
      render: destinationNameCellRenderer,
    }),
    // Only show AI Confidence column for non-FlatFile delivery types
    ...(deliveryType !== DeliveryType.FLAT_FILE &&
    deliveryType !== DeliveryType.FTP &&
    deliveryType !== DeliveryType.ZAPIER &&
    sourceType !== ZapierType.ZAPS
      ? [
          column('AI Confidence', 'confidence', {
            render: aiConfidenceCellRenderer,
          }),
        ]
      : []),
    column('pages.templates.label.actions', 'action', {
      width: 100,
      render: actionRenderer,
    }),
  ];

  if (list.length === 0) {
    return <TableLoader />;
  }

  return (
    <BasicTable<ITemplateFieldResponse>
      columns={columns}
      data={list}
      virtual={false}
      scrollableHeight={scrollableTableHeight}
      rowClassName={(record: ITemplateFieldResponse) =>
        !record.isStandardField ? 'gradient-row-background' : ''
      }
    />
  );
};
