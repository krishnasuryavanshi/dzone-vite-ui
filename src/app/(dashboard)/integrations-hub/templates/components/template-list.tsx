
import React, { FC } from 'react';
import { ITemplateRow } from '../lib/types';
import { FormatDate } from '@/components/util';
import { useScrollableTableHeight } from '@/lib/hooks';
import { createColumn } from '@/lib/utils/table';
import { TableProps } from '@/lib/types/uicomponents';
import { BasicTable } from '@/components/table';
import { TemplateRecordAction } from './template-record-action';

interface ITemplateListProps {
  templates: ITemplateRow[];
  handleRowClick?: (record: ITemplateRow) => void;
  rowHref?: (record: ITemplateRow) => string | undefined;
}

const updatedOnRenderer = (updatedOn: string) => {
  return <FormatDate date={updatedOn} outputFormat='DD MMM YYYY' />;
};

const StaticContentHeight = 216;

export const TemplateList: FC<ITemplateListProps> = ({
  templates,
  handleRowClick,
  rowHref,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const actionsRenderer = (_val: any, record: any) => (
    <TemplateRecordAction template={record} />
  );

  const column = createColumn(false);
  const columns: TableProps<ITemplateRow>['columns'] = [
    column('pages.templates.label.templateId', 'templateId', {
      ellipsis: true,
      width: 120,
    }),
    column('pages.templates.label.templateName', 'name', {
      ellipsis: true,
      width: 200,
    }),
    column('pages.templates.label.deliveryType', 'deliveryType', {
      ellipsis: true,
      width: 150,
    }),
    column('pages.templates.label.integrationName', 'integrationName', {
      ellipsis: true,
      width: 200,
    }),
    //Temporary fix: Marketer Code field commented out - these changes not required now but might be needed later on
    // column('pages.templates.label.marketer', 'count.marketers'),
    // column('pages.templates.label.campaign', 'count.campaigns'),
    column('pages.templates.label.lineItem', 'lineItem.name', {
      ellipsis: true,
      width: 200,
    }),
    column(
      'pages.templates.label.lastUsed',
      'lastUsed',
      {
        ellipsis: true,
        width: 120,
      },
      updatedOnRenderer,
    ),
    column(
      'pages.templates.label.lastEdited',
      'updatedAt',
      {
        ellipsis: true,
        width: 120,
      },
      updatedOnRenderer,
    ),
    column('pages.templates.label.createdBy', 'createdBy', {
      ellipsis: true,
      width: 250,
    }),
    column(
      'pages.templates.label.actions',
      'actions',
      { fixed: 'right', width: 100 },
      actionsRenderer,
    ),
  ];

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={templates}
      hasPagination={false}
      onClick={(record: ITemplateRow) =>
        handleRowClick && handleRowClick(record)
      }
      rowHref={rowHref}
      scrollableHeight={scrollableTableHeight}
    />
  );
};
