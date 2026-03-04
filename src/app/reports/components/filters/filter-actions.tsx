import React from 'react';
import { Button } from 'antd';
import { useReportFilterStore } from '../../store/use-report-filter-store';

export const FilterActions: React.FC = () => {
  const commitFilters = useReportFilterStore((s) => s.commitFilters);
  const clearAll = useReportFilterStore((s) => s.clearAll);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', paddingBottom: 1 }}>
      <Button type="primary" onClick={commitFilters}>
        Apply
      </Button>
      <Button onClick={clearAll}>Clear All</Button>
    </div>
  );
};
