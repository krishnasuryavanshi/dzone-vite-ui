import { IPaginationProps } from '@/lib/types/prop-types';
import { SimplePagination } from '@/uicomponents';
import React, { FC } from 'react';

interface ITemplateListPaginationProps extends IPaginationProps {
  handlePaginationChange: (page: number, pageSize: number) => void;
}

export const TemplateListPagination: FC<ITemplateListPaginationProps> = ({
  currentPage,
  totalRecords,
  pageSize,
  handlePaginationChange,
}) => {
  return (
    <SimplePagination
      current={currentPage}
      total={totalRecords}
      pageSize={pageSize}
      onChange={handlePaginationChange}
    />
  );
};
