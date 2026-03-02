import { FC } from 'react';
import { BasicTable } from '@/components/table';
import { createColumn } from '@/lib/utils/table';
import { TableProps } from 'antd';
import { IPacingChartType } from '../../../lib/types';
import { useScrollableTableHeight } from '@/lib/hooks';

interface IPacingListsProps {
  pacingData: IPacingChartType[];
}

const StaticContentHeight = 100;

export const PacingLists: FC<IPacingListsProps> = ({ pacingData }) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);
  const column = createColumn();
  const columns: TableProps<IPacingChartType>['columns'] = [
    column('pages.lineItems.pacingChart.serial', 'serialNo', {
      ellipsis: true,
      width: 100,
      render: (_: any, __: any, index: number) => index + 1,
    }),
    column('pages.lineItems.pacingChart.date', 'date', {
      ellipsis: true,
      width: 100,
    }),
    column('pages.lineItems.pacingChart.dayOfAWeek', 'dayOfAWeek', {
      ellipsis: true,
      width: 100,
    }),
    column('pages.lineItems.pacingChart.leadsRequired', 'leadsRequired', {
      ellipsis: true,
      width: 100,
    }),
  ];
  return (
    <BasicTable
      className='row-hover-highlight'
      scrollableHeight={scrollableTableHeight}
      columns={columns}
      data={pacingData || []}
      hasPagination={false}
      onClick={() => null}
    />
  );
};
