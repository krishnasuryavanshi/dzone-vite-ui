import { useContext, useEffect, useState } from 'react';
import { DashboardReportContext } from '../../contexts';
import { fetchReportChartsData, fetchReportCountsData } from '../../services';
import { ExecutiveReportType } from '../enums';

export function useFetchReportData<T>(
  initialValue: T | T[],
  type: string,
  category: 'chart' | 'count' = 'chart',
): [T | T[], boolean] {
  const [reportData, setReportData] = useState<T | T[]>(initialValue);
  const { filters, progress, updateProgress } = useContext(
    DashboardReportContext,
  );

  useEffect(() => {
    updateProgress({ [type]: 'loading' });
    if (filters && Object.keys(filters).length > 0) {
      fetchReportCharts();
    }
  }, [filters]);

  function createFilteredData(filters: any, type: string) {
    switch (type) {
      case ExecutiveReportType.Bookings:
      case ExecutiveReportType.WaitingToGoLive:
        return {
          unit: filters.unit || '',
          timeframe: filters.timeframe || '',
        };
      default:
        return {
          campaigns: filters.campaigns,
          range: {
            startDate: filters.range.startDate,
            endDate: filters.range.endDate,
          },
        };
    }
  }

  const fetchReportCharts = async () => {
    try {
      const filteredData = createFilteredData(filters, type);
      if (category === 'chart' && filters && Object.keys(filters).length > 0) {
        let data;

        data = await fetchReportChartsData(filteredData, type);

        setReportData(data);
      } else if (
        category === 'count' &&
        filters &&
        Object.keys(filters).length > 0
      ) {
        let data;
        if (
          type === ExecutiveReportType.Bookings ||
          type === ExecutiveReportType.WaitingToGoLive
        ) {
          data = await fetchReportCountsData(filteredData, type);
        } else {
          data = await fetchReportCountsData(filteredData, type);
        }

        setReportData(data);
      }

      updateProgress({ [type]: 'loaded' });
    } catch (error) {
      updateProgress({ [type]: 'loaded' });
    }
  };

  return [reportData, progress[type] === 'loaded'];
}
