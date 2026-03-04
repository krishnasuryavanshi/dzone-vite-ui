import React, { useState } from 'react';
import { Button, DatePicker, InputNumber, Popover, Select, Tabs } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DateRangeFilterConfig, DateFilterValue } from '../../lib/types';
import { useReportFilterStore } from '../../store/use-report-filter-store';

interface DateRangeFilterProps {
  config: DateRangeFilterConfig;
  dependentIds: string[];
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ config, dependentIds }) => {
  const stagedFilters = useReportFilterStore((s) => s.stagedFilters);
  const setStagedFilter = useReportFilterStore((s) => s.setStagedFilter);
  const [open, setOpen] = useState(false);

  const value = stagedFilters[config.id] as DateFilterValue | undefined;

  const setVal = (v: DateFilterValue) => {
    setStagedFilter(config.id, v, dependentIds);
    setOpen(false);
  };

  const displayLabel = getDisplayLabel(value, config);

  const content = (
    <div style={{ width: 360 }}>
      <Tabs
        size="small"
        items={[
          {
            key: 'quick',
            label: 'Quick',
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 240, overflowY: 'auto' }}>
                {config.presets.map((preset) => (
                  <Button
                    key={preset.key}
                    type={value?.type === 'preset' && value.presetKey === preset.key ? 'primary' : 'text'}
                    size="small"
                    block
                    style={{ textAlign: 'left' }}
                    onClick={() => setVal({ type: 'preset', presetKey: preset.key })}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            ),
          },
          {
            key: 'relative',
            label: 'Relative',
            children: <RelativeTab value={value} onChange={setVal} />,
          },
          {
            key: 'absolute',
            label: 'Absolute',
            children: <AbsoluteTab value={value} onChange={setVal} />,
          },
        ]}
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>{config.label}</label>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottomLeft"
      >
        <Button icon={<CalendarOutlined />} style={{ minWidth: 180, textAlign: 'left' }}>
          {displayLabel}
        </Button>
      </Popover>
    </div>
  );
};

function RelativeTab({
  value,
  onChange,
}: {
  value: DateFilterValue | undefined;
  onChange: (v: DateFilterValue) => void;
}) {
  const [amount, setAmount] = useState<number>(
    value?.type === 'relative' ? value.amount : 15,
  );
  const [unit, setUnit] = useState<string>(
    value?.type === 'relative' ? value.unit : 'minutes',
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <InputNumber
          min={1}
          value={amount}
          onChange={(v) => setAmount(v ?? 1)}
          style={{ flex: 1 }}
        />
        <Select
          value={unit}
          onChange={setUnit}
          style={{ width: 120 }}
          options={[
            { label: 'Minutes', value: 'minutes' },
            { label: 'Hours', value: 'hours' },
            { label: 'Days', value: 'days' },
            { label: 'Weeks', value: 'weeks' },
            { label: 'Months', value: 'months' },
            { label: 'Years', value: 'years' },
          ]}
        />
      </div>
      <Button type="primary" size="small" onClick={() => onChange({ type: 'relative', amount, unit })}>
        Apply
      </Button>
    </div>
  );
}

function AbsoluteTab({
  value,
  onChange,
}: {
  value: DateFilterValue | undefined;
  onChange: (v: DateFilterValue) => void;
}) {
  const [from, setFrom] = useState<dayjs.Dayjs | null>(
    value?.type === 'absolute' ? dayjs(value.from) : null,
  );
  const [to, setTo] = useState<dayjs.Dayjs | null>(
    value?.type === 'absolute' ? dayjs(value.to) : null,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <DatePicker
          placeholder="From"
          value={from}
          onChange={setFrom}
          style={{ width: '100%' }}
        />
        <DatePicker
          placeholder="To"
          value={to}
          onChange={setTo}
          style={{ width: '100%' }}
        />
      </div>
      <Button
        type="primary"
        size="small"
        disabled={!from || !to}
        onClick={() => {
          if (from && to) {
            onChange({
              type: 'absolute',
              from: from.toISOString(),
              to: to.toISOString(),
            });
          }
        }}
      >
        Apply
      </Button>
    </div>
  );
}

function getDisplayLabel(value: DateFilterValue | undefined, config: DateRangeFilterConfig): string {
  if (!value) return 'No filter';
  if (value.type === 'preset') {
    const preset = config.presets.find((p) => p.key === value.presetKey);
    return preset?.label ?? value.presetKey;
  }
  if (value.type === 'relative') {
    return `Last ${value.amount} ${value.unit}`;
  }
  if (value.type === 'absolute') {
    const from = dayjs(value.from).format('MMM D, YYYY');
    const to = dayjs(value.to).format('MMM D, YYYY');
    return `${from} → ${to}`;
  }
  return 'No filter';
}
