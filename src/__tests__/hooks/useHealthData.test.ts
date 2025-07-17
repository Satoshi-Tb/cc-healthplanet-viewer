import { renderHook } from '@testing-library/react';
import { useHealthData } from '@/hooks/useHealthData';
import { ParsedHealthData, DateRangeFilter } from '@/types';


const mockDateRangeFilter: DateRangeFilter = {
  type: 'month',
  startDate: new Date('2024-02-15'),
  endDate: new Date('2024-03-15'),
};

const mockHealthData: ParsedHealthData[] = [
  {
    date: new Date('2024-03-01'),
    weight: 70.5,
    bodyFat: 15.2,
  },
  {
    date: new Date('2024-03-02'),
    weight: 70.3,
    bodyFat: 15.1,
  },
];


describe('useHealthData', () => {
  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useHealthData(mockDateRangeFilter));

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.mutate).toBeDefined();
  });

  it('handles different date range types', () => {
    const weekRange: DateRangeFilter = {
      type: 'week',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-08'),
    };

    const { result } = renderHook(() => useHealthData(weekRange));
    expect(result.current).toBeDefined();
    expect(result.current.data).toEqual([]);
  });

  it('provides mutate function for cache revalidation', () => {
    const { result } = renderHook(() => useHealthData(mockDateRangeFilter));
    
    expect(typeof result.current.mutate).toBe('function');
  });
});