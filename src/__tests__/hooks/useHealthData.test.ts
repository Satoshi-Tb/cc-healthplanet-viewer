import { renderHook } from '@testing-library/react';
import { useHealthData } from '@/hooks/useHealthData';
import { DateRangeFilter } from '@/types';


const mockDateRangeFilter: DateRangeFilter = {
  type: 'month',
  startDate: new Date('2024-02-15'),
  endDate: new Date('2024-03-15'),
};



describe('useHealthData フック', () => {
  it('初期状態を正しく返す', () => {
    const { result } = renderHook(() => useHealthData(mockDateRangeFilter));

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.mutate).toBeDefined();
  });

  it('異なる日付範囲タイプを処理する', () => {
    const weekRange: DateRangeFilter = {
      type: 'week',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-08'),
    };

    const { result } = renderHook(() => useHealthData(weekRange));
    expect(result.current).toBeDefined();
    expect(result.current.data).toEqual([]);
  });

  it('キャッシュ再検証用のmutate関数を提供する', () => {
    const { result } = renderHook(() => useHealthData(mockDateRangeFilter));
    
    expect(typeof result.current.mutate).toBe('function');
  });
});