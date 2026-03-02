import React, { FC, ReactNode } from 'react';
import { ReportType } from '../../lib/enums';
import { IUseFilterDropdowns } from '../../lib/hooks';
import { FilterDropdowns } from './filter-dropdowns';
import { ExecutiveFilterDropdowns } from './executive-filter-dropdowns';

interface ITabBasedFilterManager extends IUseFilterDropdowns {
  allDurations?: { key: string; label: ReactNode }[];
  allUnits?: { key: string; label: ReactNode }[];
  allTimeFrame?: { key: string; label: ReactNode }[];
  activeTab: string;
}

export const TabBasedFilterManager: FC<ITabBasedFilterManager> = ({
  activeTab,
  allCampaigns,
  allClients,
  allLineItems,
  allDurations,
  allTimeFrame,
  allUnits,
  handleSelection,
  reset,
  submit,
}) => {
  return (
    <>
      {activeTab === ReportType.Executive ? (
        <ExecutiveFilterDropdowns
          reset={reset}
          submit={submit}
          handleSelection={handleSelection}
          allUnits={allUnits}
          allTimeFrame={allTimeFrame}
          activeTab={activeTab}
        />
      ) : (
        <FilterDropdowns
          allLineItems={allLineItems}
          allClients={allClients}
          allCampaigns={allCampaigns}
          allDurations={allDurations}
          handleSelection={handleSelection}
          reset={reset}
          submit={submit}
          activeTab={activeTab}
        />
      )}
    </>
  );
};
