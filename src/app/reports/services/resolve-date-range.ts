import { DateFilterValue, DatePreset } from '../lib/types';

interface AbsoluteRange {
  from: string;
  to: string;
}

export function resolveDateRange(
  value: DateFilterValue,
  presets?: DatePreset[],
): AbsoluteRange | null {
  if (!value) return null;

  const now = new Date();

  if (value.type === 'absolute') {
    return { from: value.from, to: value.to };
  }

  if (value.type === 'relative') {
    return resolveRelative(now, value.amount, value.unit);
  }

  if (value.type === 'preset' && presets) {
    const preset = presets.find((p) => p.key === value.presetKey);
    if (preset?.relativeValue) {
      return resolveRelative(now, preset.relativeValue.amount, preset.relativeValue.unit);
    }
  }

  return null;
}

function resolveRelative(now: Date, amount: number, unit: string): AbsoluteRange {
  const from = new Date(now);

  switch (unit) {
    case 'minutes':
      from.setMinutes(from.getMinutes() - amount);
      break;
    case 'hours':
      from.setHours(from.getHours() - amount);
      break;
    case 'days':
      from.setDate(from.getDate() - amount);
      break;
    case 'weeks':
      from.setDate(from.getDate() - amount * 7);
      break;
    case 'months':
      from.setMonth(from.getMonth() - amount);
      break;
    case 'years':
      from.setFullYear(from.getFullYear() - amount);
      break;
  }

  return {
    from: from.toISOString(),
    to: now.toISOString(),
  };
}
