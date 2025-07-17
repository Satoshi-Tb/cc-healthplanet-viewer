import { renderHook, act } from '@testing-library/react';
import { useDateRange } from '@/hooks/useDateRange';

describe('useDateRange フック', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('デフォルトで月次範囲で初期化される', () => {
    const { result } = renderHook(() => useDateRange());

    expect(result.current.selectedRange).toBe('month');
    expect(result.current.dateRangeFilter.type).toBe('month');
  });

  it('カスタム範囲で初期化される', () => {
    const { result } = renderHook(() => useDateRange('week'));

    expect(result.current.selectedRange).toBe('week');
    expect(result.current.dateRangeFilter.type).toBe('week');
  });

  it('週次の正しい日付範囲を計算する', () => {
    const { result } = renderHook(() => useDateRange('week'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-03-08T12:00:00Z');
    const expectedEndDate = new Date('2024-03-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
    expect(dateRangeFilter.endDate).toEqual(expectedEndDate);
  });

  it('月次の正しい日付範囲を計算する', () => {
    const { result } = renderHook(() => useDateRange('month'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-02-15T12:00:00Z');
    const expectedEndDate = new Date('2024-03-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
    expect(dateRangeFilter.endDate).toEqual(expectedEndDate);
  });

  it('年次の正しい日付範囲を計算する', () => {
    const { result } = renderHook(() => useDateRange('year'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2023-03-15T12:00:00Z');
    const expectedEndDate = new Date('2024-03-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
    expect(dateRangeFilter.endDate).toEqual(expectedEndDate);
  });

  it('setSelectedRangeが呼ばれたときに選択範囲が更新される', () => {
    const { result } = renderHook(() => useDateRange('month'));

    act(() => {
      result.current.setSelectedRange('week');
    });

    expect(result.current.selectedRange).toBe('week');
    expect(result.current.dateRangeFilter.type).toBe('week');
  });

  it('範囲が変更されたときに日付範囲が再計算される', () => {
    const { result } = renderHook(() => useDateRange('month'));

    act(() => {
      result.current.setSelectedRange('week');
    });

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-03-08T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
  });

  it('無効な入力に対してデフォルトで月次範囲になる', () => {
    const { result } = renderHook(() => useDateRange('invalid' as 'week' | 'month' | 'year'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-02-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
  });
});