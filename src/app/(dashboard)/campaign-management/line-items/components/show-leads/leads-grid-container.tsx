import { HasPermission } from '@/components/auth';
import { LeadActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { FC, useState } from 'react';
import { LeadsList } from '../../../leads/components/leads-list';
import { ILead } from '../../../leads/lib/types';
import { LeadReviewDrawer } from './review-lead';
import { useLeadsStore } from '../../store';
import { Filters } from '@/lib/utils/table';

const HiddenColumns = ['clientId', 'campaignId', 'lineItemId'];
const StaticContentHeight = 300;

interface ILeadsGridContainerProps {
  lineItemId: string;
  leadStatuses: string[];
  validationStatuses: string[];
  refreshLeadsList: () => void;
  isSelectable?: boolean;
  onSelectionChange?: (selectedIds: number[]) => void;
  tenantCode?: string;

  filteredInfo: Filters<ILead>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const LeadsGridContainer: FC<ILeadsGridContainerProps> = ({
  lineItemId,
  leadStatuses,
  validationStatuses,
  refreshLeadsList,
  isSelectable,
  onSelectionChange,
  tenantCode,
  filteredInfo,
  onFiltersChange,
}) => {
  const leadsList = useLeadsStore((state) => state.leadsList);
  const [isLeadReviewDrawerOpen, setIsLeadReviewDrawerOpen] = useState(false);
  const [currentLeadTrackingId, setCurrentLeadTrackingId] =
    useState<string>('');
  const [currentLeadId, setCurrentLeadId] = useState<number>(0);
  const hasUpdatePermission = usePermissionCheck(LeadActionsEnum.Update);
  const hasValidateLeadsPermission = usePermissionCheck(
    LeadActionsEnum.ValidateLead,
  );

  const onLeadRowClick = (record: ILead) => {
    if (hasUpdatePermission || hasValidateLeadsPermission) {
      setCurrentLeadTrackingId(record.trackingId);
      setCurrentLeadId(record.id);
      setIsLeadReviewDrawerOpen(true);
    } else {
      setIsLeadReviewDrawerOpen(false);
    }
  };

  const onDrawerClose = () => {
    setIsLeadReviewDrawerOpen(false);
    refreshLeadsList();
  };

  return (
    <>
      <LeadsList
        list={leadsList}
        lineItemId={lineItemId}
        hiddenColumns={HiddenColumns}
        fixedContentHeight={StaticContentHeight}
        handleRowClick={onLeadRowClick}
        isSelectable={isSelectable}
        onSelectionChange={onSelectionChange}
        highlightCurrentRow={hasUpdatePermission || hasValidateLeadsPermission}
        filterInfo={filteredInfo}
        onFiltersChange={onFiltersChange}
        hasFilters
      />
      <HasPermission permissions={LeadActionsEnum.ValidateLead}>
        <LeadReviewDrawer
          currentLeadTrackingId={currentLeadTrackingId}
          currentLeadId={currentLeadId}
          lineItemId={lineItemId}
          leadStatuses={leadStatuses}
          validationStatuses={validationStatuses}
          isOpen={isLeadReviewDrawerOpen}
          handleClose={onDrawerClose}
          tenantCode={tenantCode}
        />
      </HasPermission>
    </>
  );
};
