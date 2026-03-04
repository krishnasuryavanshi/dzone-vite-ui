import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { useDashboardReportStore } from '../store/use-dashboard-report-store';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';
import { ReportingFiltersManager } from './filters-manager';
import { ReportingTabs } from './reporting-tabs';
import { useQueryState } from '@/lib/hooks';
import { ReportType } from '../lib/enums';

interface IReportingDashboardContainerProps {}

export const ReportingDashboardContainer: FC<IReportingDashboardContainerProps> = ({}) => {
  const { updateFilters, resetFilters } = useDashboardReportStore();

  const { queryState, setQueryState } = useQueryState();
  const initialTab = queryState.report || ReportType.Executive;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    let activeTabName = queryState.report || ReportType.Executive;
    setActiveTab(activeTabName);
  }, [queryState]);

  const handleTabChange = (key: string) => {
    resetFilters();
    setQueryState([{ name: 'report', value: key }]);
  };
  const handleSubmit = (filterData: IFilterDataPayload | IExecutiveFilterDataPayload) => {
    updateFilters(filterData);
  };

  return (
    <Flex vertical gap='1rem' className='dz-page-content'>
      <ReportingFiltersManager activeTab={activeTab} onSubmit={handleSubmit} />
      <ReportingTabs activeTab={activeTab} handleTabChange={handleTabChange} />
    </Flex>
  );
};
