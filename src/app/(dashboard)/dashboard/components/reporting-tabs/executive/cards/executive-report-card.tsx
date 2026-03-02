import { useFetchReportData } from '@/app/(dashboard)/dashboard/lib/hooks';
import { FC } from 'react';
import { ExecutiveCard } from './executive-card';

interface CurrentPreviousData {
  name: string;
  value: string;
}

interface ExecutiveReportData {
  title: string;
  current: CurrentPreviousData;
  previous: CurrentPreviousData;
  percent: string;
  isPositive: boolean | null;
}

interface IExecutiveReportCardProps {
  type: string;
}

export const ExecutiveReportCard: FC<IExecutiveReportCardProps> = ({
  type,
}) => {
  const [reportData] = useFetchReportData<
    ExecutiveReportData | CurrentPreviousData
  >(
    {
      name: '',
      title: '',
      current: { name: '', value: '' },
      previous: { name: '', value: '' },
      percent: '',
      isPositive: false,
    },
    type, 'count'
  );

  return (
    <ExecutiveCard
      waitingToGoLiveData={reportData as CurrentPreviousData}
      title={(reportData as ExecutiveReportData)?.title}
      current={(reportData as ExecutiveReportData)?.current}
      previous={(reportData as ExecutiveReportData)?.previous}
      isPositive={(reportData as ExecutiveReportData)?.isPositive}
      percent={(reportData as ExecutiveReportData)?.percent}
    />
  );
};
