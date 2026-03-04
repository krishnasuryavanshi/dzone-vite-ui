import { FC } from 'react';
import { BasicTable } from '@/components/table';
import { TableProps } from '@/lib/types/uicomponents';
import { createColumn } from '@/lib/utils/table';
import { ITemplateFieldDataType } from '../../../lib/types';

interface IDictionaryModalBodyProps {
  dataDictionaryList: ITemplateFieldDataType[];
}

export const DictionaryModalBody: FC<IDictionaryModalBodyProps> = ({ dataDictionaryList }) => {
  const column = createColumn();
  const columns: TableProps<ITemplateFieldDataType>['columns'] = [
    column('pages.templates.label.dataType', 'value', { width: 50 }),
    column('pages.templates.label.description', 'description'),
  ];

  return (
    <BasicTable
      columns={columns}
      style={{
        background: '#EAF1FF',
        padding: '0.75rem 0.5rem',
        borderRadius: '0.5rem',
      }}
      data={dataDictionaryList!}
      hasPagination={false}
    />
  );
};
