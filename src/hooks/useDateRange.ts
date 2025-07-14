import { useState, useMemo } from 'react';
import { DateRange, DateRangeFilter } from '@/types';

export function useDateRange(initialRange: DateRange = 'month') {
  const [selectedRange, setSelectedRange] = useState<DateRange>(initialRange);

  const dateRangeFilter = useMemo((): DateRangeFilter => {
    const now = new Date();
    let startDate: Date;
    const endDate = new Date(now);

    switch (selectedRange) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    return {
      type: selectedRange,
      startDate,
      endDate,
    };
  }, [selectedRange]);

  return {
    selectedRange,
    setSelectedRange,
    dateRangeFilter,
  };
}