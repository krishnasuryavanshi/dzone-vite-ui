import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

// Extend dayjs with the necessary plugins
dayjs.extend(isToday);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);

interface DateRange {
  startDate: string;
  endDate: string;
}

export interface IDateRange extends DateRange {}

function getCurrentWeek(): DateRange {
  const startDate = dayjs().startOf('isoWeek').format('YYYY-MM-DD');
  const endDate = dayjs().endOf('isoWeek').format('YYYY-MM-DD');
  return { startDate, endDate };
}

function getCurrentMonth(): DateRange {
  const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
  const endDate = dayjs().endOf('month').format('YYYY-MM-DD');
  return { startDate, endDate };
}

function getCurrentQuarter(): DateRange {
  const startDate = dayjs().startOf('quarter').format('YYYY-MM-DD');
  const endDate = dayjs().endOf('quarter').format('YYYY-MM-DD');
  return { startDate, endDate };
}

function getCurrentYear(): DateRange {
  const startDate = dayjs().startOf('year').format('YYYY-MM-DD');
  const endDate = dayjs().endOf('year').format('YYYY-MM-DD');
  return { startDate, endDate };
}

export function calculateDateRanges(range: string) {
  const dateRange: Record<string, () => DateRange> = {
    week: getCurrentWeek,
    month: getCurrentMonth,
    quarter: getCurrentQuarter,
    year: getCurrentYear,
  };
  return dateRange[range]();
}
