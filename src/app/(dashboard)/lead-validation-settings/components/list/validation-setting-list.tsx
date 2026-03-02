'use client';

import React, { FC } from 'react';
import { IValidationSettingRow } from '../../lib/types';
import { FormatDate } from '@/components/util';
import { useScrollableTableHeight } from '@/lib/hooks';
import { createColumn } from '@/lib/utils/table';
import { TableProps } from '@/lib/types/uicomponents';
import { BasicTable } from '@/components/table';
import { ValidationSettingRecordAction } from './validation-setting-record-action';

interface IValidationSettingListProps {
  validationSettings: IValidationSettingRow[];
  handleRowClick?: (record: IValidationSettingRow) => void;
  rowHref?: (record: IValidationSettingRow) => string | undefined;
}

const createdOnRenderer = (createdAt: string) => {
  return <FormatDate date={createdAt} outputFormat='DD MMM YYYY' />;
};

const StaticContentHeight = 130;

export const ValidationSettingList: FC<IValidationSettingListProps> = ({
  validationSettings,
  handleRowClick,
  rowHref,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const actionsRenderer = (_val: any, record: any) => (
    <ValidationSettingRecordAction validationSetting={record} />
  );

  const column = createColumn(false);
  const columns: TableProps<IValidationSettingRow>['columns'] = [
    column('pages.leadValidationSettings.label.name', 'name', {
      ellipsis: true,
      width: 350,
    }),
    column('pages.leadValidationSettings.label.marketer', 'tenant.name', {
      ellipsis: true,
      width: 350,
    }),
    column(
      'pages.leadValidationSettings.label.updatedAt',
      'createdAt',
      {},
      createdOnRenderer,
    ),
    column(
      'pages.leadValidationSettings.label.actions',
      'actions',
      { fixed: 'right', width: 100 },
      actionsRenderer,
    ),
  ];

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={validationSettings}
      hasPagination={false}
      onClick={(record: IValidationSettingRow) =>
        handleRowClick && handleRowClick(record)
      }
      rowHref={rowHref}
      scrollableHeight={scrollableTableHeight}
    />
  );
};
