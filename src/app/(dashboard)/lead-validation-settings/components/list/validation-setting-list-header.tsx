import { HasPermission } from '@/components/auth';
import { LeadValidationSettingsActionsEnum } from '@/lib/enums/permissions';
import { IPaginationProps } from '@/lib/types/prop-types';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { CreateNewValidationSettingAction } from './create-new-validation-setting-action';
import { ValidationSettingListPagination } from './validation-setting-list-pagination';

interface IValidationSettingListHeaderProps extends IPaginationProps {
  handlePaginationChange: (page: number, pageSize: number) => void;
}

export const ValidationSettingListHeader: FC<
  IValidationSettingListHeaderProps
> = ({ currentPage, totalRecords, pageSize, handlePaginationChange }) => {
  return (
    <Flex
      justify={'space-between'}
      gap='0.5rem'
      style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
      <HasPermission permissions={LeadValidationSettingsActionsEnum.Create}>
        <CreateNewValidationSettingAction />
      </HasPermission>
      <ValidationSettingListPagination
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={pageSize}
        handlePaginationChange={handlePaginationChange}
      />
    </Flex>
  );
};
