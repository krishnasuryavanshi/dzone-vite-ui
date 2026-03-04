import React from 'react';
import { InputNumber } from 'antd';
import { NumberRangeFilterConfig } from '../../lib/types';
import { useReportFilterStore } from '../../store/use-report-filter-store';

interface NumberRangeFilterProps {
  config: NumberRangeFilterConfig;
  dependentIds: string[];
}

export const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({ config, dependentIds }) => {
  const stagedFilters = useReportFilterStore((s) => s.stagedFilters);
  const setStagedFilter = useReportFilterStore((s) => s.setStagedFilter);
  const value = (stagedFilters[config.id] as { min?: number; max?: number }) ?? {};

  const update = (field: 'min' | 'max', v: number | null) => {
    const next = { ...value, [field]: v ?? undefined };
    if (next.min == null && next.max == null) {
      setStagedFilter(config.id, undefined, dependentIds);
    } else {
      setStagedFilter(config.id, next, dependentIds);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{config.label}</label>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <InputNumber
          placeholder={config.placeholderMin ?? 'Min'}
          value={value.min}
          min={config.min}
          max={config.max}
          step={config.step}
          onChange={(v) => update('min', v)}
          style={{ width: 90 }}
        />
        <span style={{ color: 'rgba(0,0,0,0.25)' }}>–</span>
        <InputNumber
          placeholder={config.placeholderMax ?? 'Max'}
          value={value.max}
          min={config.min}
          max={config.max}
          step={config.step}
          onChange={(v) => update('max', v)}
          style={{ width: 90 }}
        />
      </div>
    </div>
  );
};
