import React, { FC, useEffect, useState } from 'react';
import { TemplateList } from './template-list';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { TemplateListHeader } from './template-list-header';
import { ITemplateRow } from '../lib/types';
import { useQueryState } from '@/lib/hooks';
import { useRouter } from '@/lib/hooks/use-router';
import { useTemplatesListQuery } from '../hooks';

interface ITemplateListContainerProps {}

export const TemplateListContainer: FC<ITemplateListContainerProps> = ({}) => {
  const router = useRouter();
  const { queryState, setQueryState } = useQueryState();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const hasValidPagination = currentPage > 0 && pageSize > 0;
  const { data } = useTemplatesListQuery(
    currentPage - 1,
    pageSize,
    hasValidPagination,
  );

  const templateList = data?.data ?? [];
  const totalRecords = data?.total ?? 0;

  useEffect(() => {
    if (queryState) {
      let { page, pageSize } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);
      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: pageSize },
    ]);
  };

  const getTemplateHref = (template: ITemplateRow) =>
    `/integrations-hub/templates/${template.id}/update?id=${template.templateId}`;

  const handleRowClick = (template: ITemplateRow) => {
    router.push(getTemplateHref(template));
  };

  return (
    <TableWithPaginationLayout
      header={<TemplateListHeader />}
      table={
        <TemplateList
          templates={templateList}
          handleRowClick={handleRowClick}
          rowHref={getTemplateHref}
        />
      }
      pagination={
        <Hideable show={totalRecords > 0}>
          <SimplePagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            onChange={handlePaginationChange}
          />
        </Hideable>
      }
    />
  );
};
