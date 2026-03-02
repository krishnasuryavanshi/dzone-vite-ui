import { ReactNode, createContext, useState } from 'react';
import { IDashboardReportContext } from '../lib/types';
import { IExecutiveFilterDataPayload, IFilterDataPayload } from '../lib/utils';

const initialProgressState: Record<string, 'loading' | 'loaded'> = {};

const DashboardReportContext = createContext({} as IDashboardReportContext);

const DashboardReportContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<
    IFilterDataPayload | IExecutiveFilterDataPayload
  >({} as IFilterDataPayload | IExecutiveFilterDataPayload);

  const [progress, setProgress] =
    useState<Record<string, 'loading' | 'loaded'>>(initialProgressState);

  const updateProgress = (data: Record<string, 'loading' | 'loaded'>) => {
    setProgress((prevProgress) => ({ ...prevProgress, ...data }));
  };

  const resetProgress = () => {
    setProgress(initialProgressState);
  };

  const updateFilters = (
    filterData: IFilterDataPayload | IExecutiveFilterDataPayload
  ) => {
    setFilters(filterData);
  };

  return (
    <DashboardReportContext.Provider
      value={{
        filters,
        updateFilters,
        progress,
        updateProgress,
        resetProgress,
      }}
    >
      {children}
    </DashboardReportContext.Provider>
  );
};

export { DashboardReportContext, DashboardReportContextProvider };
