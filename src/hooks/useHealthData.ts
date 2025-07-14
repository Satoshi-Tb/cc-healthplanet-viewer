import useSWR from 'swr';
import { HealthPlanetAPI } from '@/lib/health-planet-api';
import { ParsedHealthData, DateRangeFilter } from '@/types';

const api = new HealthPlanetAPI();

async function fetchHealthData(dateRange: DateRangeFilter): Promise<ParsedHealthData[]> {
  const fromDate = api.formatDateForAPI(dateRange.startDate);
  const toDate = api.formatDateForAPI(dateRange.endDate);
  
  const rawData = await api.fetchHealthData(fromDate, toDate);
  return api.parseHealthData(rawData);
}

export function useHealthData(dateRange: DateRangeFilter) {
  const key = `health-data-${dateRange.type}-${dateRange.startDate.toISOString()}-${dateRange.endDate.toISOString()}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => fetchHealthData(dateRange),
    {
      refreshInterval: 300000,
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data || [],
    error,
    isLoading,
    mutate,
  };
}