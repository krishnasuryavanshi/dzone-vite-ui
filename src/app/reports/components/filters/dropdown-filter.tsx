import React from 'react';
import { Select } from 'antd';
import { SingleSelectFilterConfig, MultiSelectFilterConfig } from '../../lib/types';
import { useFilterOptions } from '../../hooks';
import { useReportFilterStore } from '../../store/use-report-filter-store';

interface DropdownFilterProps {
  config: SingleSelectFilterConfig | MultiSelectFilterConfig;
  dependentIds: string[];
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({ config, dependentIds }) => {
  const stagedFilters = useReportFilterStore((s) => s.stagedFilters);
  const setStagedFilter = useReportFilterStore((s) => s.setStagedFilter);
  const { data: options, isLoading } = useFilterOptions(config);

  const mode = config.type === 'multi-select' ? 'multiple' : undefined;
  const value = stagedFilters[config.id] as string | string[] | undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{config.label}</label>
      <Select
        mode={mode}
        value={value}
        onChange={(val) => setStagedFilter(config.id, val, dependentIds)}
        placeholder={config.placeholder ?? `Select ${config.label}`}
        loading={isLoading}
        options={options?.map((o) => ({ label: o.label, value: o.value }))}
        style={{ minWidth: 180 }}
        allowClear
        showSearch={config.type === 'multi-select' ? config.searchable : false}
        filterOption={(input, option) =>
          (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false
        }
        maxTagCount={config.type === 'multi-select' && config.showCount ? 'responsive' : undefined}
      />
    </div>
  );
};
