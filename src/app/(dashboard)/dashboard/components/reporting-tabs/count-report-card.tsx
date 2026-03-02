import { FC } from 'react';
import { useFetchReportData } from '../../lib/hooks';
import { CountCard } from './count-card';

type StringRecord = Record<string, string>;

interface ICountReportCardProps {
  type: string;
}

export const CountReportCard: FC<ICountReportCardProps> = ({ type }) => {
  const [countdata] = useFetchReportData<StringRecord>({}, type, 'count');
  return (
    <CountCard
      title={(countdata as StringRecord)?.name}
      value={(countdata as StringRecord)?.value}
    />
  );
};
