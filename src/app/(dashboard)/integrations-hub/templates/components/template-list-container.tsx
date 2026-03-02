'use client';
import React, { FC, useEffect, useState } from 'react';
import { TemplateList } from './template-list';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { TemplateListHeader } from './template-list-header';
import { ITemplateRow } from '../lib/types';
import { useQueryState } from '@/lib/hooks';
import { fetchTemplates } from '../services';
import { useRouter } from 'next/navigation';
interface ITemplateListContainerProps {}

export const TemplateListContainer: FC<ITemplateListContainerProps> = ({}) => {
  const router = useRouter();
  const [templateList, setTemplateList] = useState<ITemplateRow[]>([]);
  const { queryState, setQueryState } = useQueryState();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchTemplateList();
  }, [pageSize, currentPage]);

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

  const fetchTemplateList = async () => {
    const data = await fetchTemplates(currentPage - 1, pageSize);
    if (data) {
      setTotalRecords(data?.total);
      setTemplateList(data.data);
    }
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
