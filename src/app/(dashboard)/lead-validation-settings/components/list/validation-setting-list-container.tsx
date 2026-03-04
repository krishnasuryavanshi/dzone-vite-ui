import { TableWithPaginationLayout } from '@/components/shared';
import { HasPermission } from '@/components/auth';
import { LeadValidationSettingsActionsEnum } from '@/lib/enums/permissions';
import { useQueryState } from '@/lib/hooks';
import { useRouter } from '@/lib/hooks/use-router';
import { useEffect, useState } from 'react';
import { IValidationSettingRow } from '../../lib/types';
import { useValidationSettingsQuery } from '../../hooks';
import { ValidationSettingList } from './validation-setting-list';
import { ValidationSettingListPagination } from './validation-setting-list-pagination';
import { CreateNewValidationSettingAction } from './create-new-validation-setting-action';

export const ValidationSettingListContainer = () => {
  const router = useRouter();
  const { queryState, setQueryState } = useQueryState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const hasValidPagination = currentPage > 0 && pageSize > 0;
  const { data } = useValidationSettingsQuery(currentPage - 1, pageSize, hasValidPagination);

  const validationSettingsList = data?.data ?? [];
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

  const getSettingHref = (setting: IValidationSettingRow) =>
    `/lead-validation-settings/organizations/${setting.tenant.code}/settings/${setting.id}`;

  const handleRowClick = (leadValidationSeting: IValidationSettingRow) => {
    router.push(getSettingHref(leadValidationSeting));
  };

  return (
    <TableWithPaginationLayout
      header={
        <HasPermission permissions={LeadValidationSettingsActionsEnum.Create}>
          <CreateNewValidationSettingAction />
        </HasPermission>
      }
      table={
        <ValidationSettingList
          validationSettings={validationSettingsList}
          handleRowClick={handleRowClick}
          rowHref={getSettingHref}
        />
      }
      pagination={
        <ValidationSettingListPagination
          currentPage={currentPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          handlePaginationChange={handlePaginationChange}
        />
      }
    />
  );
};
