import { IPaginationProps } from '@/lib/types/prop-types';
import { SimplePagination } from '@/uicomponents';
import React, { FC } from 'react';

interface IValidationSettingListPaginationProps extends IPaginationProps {
  handlePaginationChange: (page: number, pageSize: number) => void;
}

export const ValidationSettingListPagination: FC<IValidationSettingListPaginationProps> = ({
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
