import { FC } from 'react';
import { ChartsContainer } from './charts-container';

interface IBillingReportsProps {
  show: boolean;
}

export const BillingReports: FC<IBillingReportsProps> = ({ show }) => {
  if (!show) return null;

  return <ChartsContainer />;
};
