import React, { useEffect, useMemo, useState } from 'react';
import { Button, Popover } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { FilterConfig } from '../../lib/types';
import { useFilterDependents } from '../../hooks';
import { useReportFilterStore } from '../../store/use-report-filter-store';
import { DropdownFilter } from './dropdown-filter';
import { DateRangeFilter } from './date-range-filter';
import { TextInputFilter } from './text-input-filter';
import { NumberRangeFilter } from './number-range-filter';
import { FilterActions } from './filter-actions';
import './report-filter-bar.scss';

interface ReportFilterBarProps {
  filters: FilterConfig[];
}

export const ReportFilterBar: React.FC<ReportFilterBarProps> = ({ filters }) => {
  const { activeFilterIds, initializeActiveFilters, addFilter } = useReportFilterStore();
  const [addFilterOpen, setAddFilterOpen] = useState(false);

  useEffect(() => {
    initializeActiveFilters(filters);
  }, [filters, initializeActiveFilters]);

  const activeFilters = useMemo(
    () => filters.filter((f) => activeFilterIds.includes(f.id)),
    [filters, activeFilterIds],
  );

  const inactiveOptionalFilters = useMemo(
    () => filters.filter((f) => !f.mandatory && !activeFilterIds.includes(f.id)),
    [filters, activeFilterIds],
  );

  const handleAddFilter = (id: string) => {
    addFilter(id);
    setAddFilterOpen(false);
  };

  const addFilterContent = (
    <div className="add-filter-popover">
      {inactiveOptionalFilters.map((f) => (
        <div
          key={f.id}
          className="add-filter-popover__item"
          onClick={() => handleAddFilter(f.id)}
        >
          {f.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className="report-filter-bar">
      {activeFilters.map((filter) => (
        <FilterItem key={filter.id} config={filter} allFilters={filters} />
      ))}
      {inactiveOptionalFilters.length > 0 && (
        <Popover
          content={addFilterContent}
          trigger="click"
          open={addFilterOpen}
          onOpenChange={setAddFilterOpen}
          placement="bottomLeft"
        >
          <Button icon={<PlusOutlined />} type="dashed" className="add-filter-btn">
            Add Filter
          </Button>
        </Popover>
      )}
      <FilterActions />
    </div>
  );
};

function FilterItem({ config, allFilters }: { config: FilterConfig; allFilters: FilterConfig[] }) {
  const dependentIds = useFilterDependents(config.id, allFilters);
  const removeFilter = useReportFilterStore((s) => s.removeFilter);

  const isMandatory = config.mandatory;

  const filterElement = (() => {
    switch (config.type) {
      case 'date-range':
        return <DateRangeFilter config={config} dependentIds={dependentIds} />;
      case 'single-select':
      case 'multi-select':
        return <DropdownFilter config={config} dependentIds={dependentIds} />;
      case 'text-input':
        return <TextInputFilter config={config} dependentIds={dependentIds} />;
      case 'number-range':
        return <NumberRangeFilter config={config} dependentIds={dependentIds} />;
      default:
        return null;
    }
  })();

  if (isMandatory) {
    return filterElement;
  }

  return (
    <div className="report-filter-item">
      {filterElement}
      <button
        className="report-filter-item__close"
        onClick={() => removeFilter(config.id, dependentIds)}
        aria-label={`Remove ${config.label} filter`}
      >
        <CloseOutlined />
      </button>
    </div>
  );
}
