import { renderHook, act } from '@testing-library/react';
import { useDateRange } from '@/hooks/useDateRange';

describe('useDateRange', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with month range by default', () => {
    const { result } = renderHook(() => useDateRange());

    expect(result.current.selectedRange).toBe('month');
    expect(result.current.dateRangeFilter.type).toBe('month');
  });

  it('initializes with custom range', () => {
    const { result } = renderHook(() => useDateRange('week'));

    expect(result.current.selectedRange).toBe('week');
    expect(result.current.dateRangeFilter.type).toBe('week');
  });

  it('calculates correct date range for week', () => {
    const { result } = renderHook(() => useDateRange('week'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-03-08T12:00:00Z');
    const expectedEndDate = new Date('2024-03-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
    expect(dateRangeFilter.endDate).toEqual(expectedEndDate);
  });

  it('calculates correct date range for month', () => {
    const { result } = renderHook(() => useDateRange('month'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-02-15T12:00:00Z');
    const expectedEndDate = new Date('2024-03-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
    expect(dateRangeFilter.endDate).toEqual(expectedEndDate);
  });

  it('calculates correct date range for year', () => {
    const { result } = renderHook(() => useDateRange('year'));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2023-03-15T12:00:00Z');
    const expectedEndDate = new Date('2024-03-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
    expect(dateRangeFilter.endDate).toEqual(expectedEndDate);
  });

  it('updates selected range when setSelectedRange is called', () => {
    const { result } = renderHook(() => useDateRange('month'));

    act(() => {
      result.current.setSelectedRange('week');
    });

    expect(result.current.selectedRange).toBe('week');
    expect(result.current.dateRangeFilter.type).toBe('week');
  });

  it('recalculates date range when range changes', () => {
    const { result } = renderHook(() => useDateRange('month'));

    act(() => {
      result.current.setSelectedRange('week');
    });

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-03-08T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
  });

  it('defaults to month range for invalid input', () => {
    const { result } = renderHook(() => useDateRange('invalid' as any));

    const { dateRangeFilter } = result.current;
    const expectedStartDate = new Date('2024-02-15T12:00:00Z');

    expect(dateRangeFilter.startDate).toEqual(expectedStartDate);
  });
});