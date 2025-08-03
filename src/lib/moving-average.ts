import { ParsedHealthData } from '@/types';

export interface MovingAverageOptions {
  days: 5 | 15 | 30;
  dataKey: 'weight' | 'bodyFat';
}

export interface MovingAverageData extends ParsedHealthData {
  movingAverage5?: number;
  movingAverage15?: number;
  movingAverage30?: number;
}

export function calculateMovingAverage(
  data: ParsedHealthData[],
  options: MovingAverageOptions
): MovingAverageData[] {
  const { days, dataKey } = options;
  
  if (!data || data.length === 0) {
    return [];
  }

  const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return sortedData.map((item, index) => {
    const result: MovingAverageData = { ...item };
    
    if (index < days - 1) {
      return result;
    }
    
    const windowData = sortedData.slice(index - days + 1, index + 1);
    const validValues = windowData
      .map(d => d[dataKey])
      .filter((value): value is number => value !== undefined && !isNaN(value));
    
    if (validValues.length === 0) {
      return result;
    }
    
    const average = validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
    
    switch (days) {
      case 5:
        result.movingAverage5 = Math.round(average * 100) / 100;
        break;
      case 15:
        result.movingAverage15 = Math.round(average * 100) / 100;
        break;
      case 30:
        result.movingAverage30 = Math.round(average * 100) / 100;
        break;
    }
    
    return result;
  });
}

export function calculateAllMovingAverages(
  data: ParsedHealthData[],
  dataKey: 'weight' | 'bodyFat'
): MovingAverageData[] {
  if (!data || data.length === 0) {
    return [];
  }

  let result = [...data] as MovingAverageData[];
  
  [5, 15, 30].forEach(days => {
    const averageData = calculateMovingAverage(data, { 
      days: days as 5 | 15 | 30, 
      dataKey 
    });
    
    result = result.map((item, index) => ({
      ...item,
      ...(days === 5 && { movingAverage5: averageData[index]?.movingAverage5 }),
      ...(days === 15 && { movingAverage15: averageData[index]?.movingAverage15 }),
      ...(days === 30 && { movingAverage30: averageData[index]?.movingAverage30 }),
    }));
  });
  
  return result;
}

export const MOVING_AVERAGE_OPTIONS = [
  { label: '5日移動平均', value: 5 as const, color: '#ff9800' },
  { label: '15日移動平均', value: 15 as const, color: '#9c27b0' },
  { label: '30日移動平均', value: 30 as const, color: '#2e7d32' },
] as const;

export type MovingAverageDays = typeof MOVING_AVERAGE_OPTIONS[number]['value'];