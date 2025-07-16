export interface HealthData {
  date: string;
  keydata: string;
  model: string;
  tag: string;
}

export interface WeightData extends HealthData {
  keydata: '6021';
}

export interface BodyFatData extends HealthData {
  keydata: '6022';
}


export type HealthDataType = WeightData | BodyFatData;

export interface HealthPlanetResponse {
  birth_date: string;
  height: string;
  sex: string;
  data: HealthData[];
}

export interface ParsedHealthData {
  date: Date;
  weight?: number;
  bodyFat?: number;
}

export type DateRange = 'week' | 'month' | 'year';

export interface DateRangeFilter {
  type: DateRange;
  startDate: Date;
  endDate: Date;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

export interface ExportData {
  date: string;
  weight: string;
  bodyFat: string;
}