import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { TextInputFilterConfig } from '../../lib/types';
import { useReportFilterStore } from '../../store/use-report-filter-store';

interface TextInputFilterProps {
  config: TextInputFilterConfig;
  dependentIds: string[];
}

export const TextInputFilter: React.FC<TextInputFilterProps> = ({ config, dependentIds }) => {
  const stagedFilters = useReportFilterStore((s) => s.stagedFilters);
  const setStagedFilter = useReportFilterStore((s) => s.setStagedFilter);
  const value = (stagedFilters[config.id] as string) ?? '';
  const [localValue, setLocalValue] = useState(value);

  const debounceMs = config.debounceMs ?? 300;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        setStagedFilter(config.id, localValue || undefined, dependentIds);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, config.id, dependentIds, setStagedFilter, value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{config.label}</label>
      <Input
        prefix={<SearchOutlined />}
        placeholder={config.placeholder ?? `Search ${config.label}`}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        style={{ minWidth: 180 }}
        allowClear
      />
    </div>
  );
};
