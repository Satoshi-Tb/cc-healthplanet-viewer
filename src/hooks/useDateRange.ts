import { useState, useMemo } from 'react';
import { DateRange, DateRangeFilter } from '@/types';

export function useDateRange(initialRange: DateRange = 'month') {
  const [selectedRange, setSelectedRange] = useState<DateRange>(initialRange);
  const [baseDate, setBaseDate] = useState<Date>(new Date());

  const dateRangeFilter = useMemo((): DateRangeFilter => {
    let startDate: Date;
    const endDate = new Date(baseDate);

    switch (selectedRange) {
      case 'week':
        startDate = new Date(baseDate);
        startDate.setDate(baseDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(baseDate);
        startDate.setMonth(baseDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(baseDate);
        startDate.setFullYear(baseDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(baseDate);
        startDate.setMonth(baseDate.getMonth() - 1);
    }

    return {
      type: selectedRange,
      startDate,
      endDate,
    };
  }, [selectedRange, baseDate]);

  return {
    selectedRange,
    setSelectedRange,
    baseDate,
    setBaseDate,
    dateRangeFilter,
  };
}