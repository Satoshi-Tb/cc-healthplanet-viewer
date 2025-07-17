import { convertToCSV, downloadCSV, exportHealthDataToCSV } from '@/lib/export-utils';
import { ParsedHealthData } from '@/types';

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
  {
    date: new Date('2024-03-03'),
    weight: undefined,
    bodyFat: 15.0,
  },
];

const mockClick = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
  writable: true,
  value: mockClick,
});

Object.defineProperty(HTMLAnchorElement.prototype, 'download', {
  writable: true,
  value: '',
});

Object.defineProperty(HTMLAnchorElement.prototype, 'href', {
  writable: true,
  value: '',
});

Object.defineProperty(HTMLAnchorElement.prototype, 'setAttribute', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLAnchorElement.prototype, 'getAttribute', {
  writable: true,
  value: jest.fn(),
});

describe('export-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('convertToCSV', () => {
    it('returns empty string for empty data', () => {
      const result = convertToCSV([]);
      expect(result).toBe('');
    });

    it('converts health data to CSV format with headers', () => {
      const result = convertToCSV(mockHealthData);
      const lines = result.split('\n');

      expect(lines[0]).toBe('日付,体重(kg),体脂肪率(%)');
      expect(lines[1]).toBe('2024/3/1,70.5,15.2');
      expect(lines[2]).toBe('2024/3/2,70.3,15.1');
      expect(lines[3]).toBe('2024/3/3,,15.0');
    });

    it('handles missing values correctly', () => {
      const dataWithMissingValues: ParsedHealthData[] = [
        {
          date: new Date('2024-03-01'),
          weight: undefined,
          bodyFat: undefined,
        },
      ];

      const result = convertToCSV(dataWithMissingValues);
      const lines = result.split('\n');

      expect(lines[1]).toBe('2024/3/1,,');
    });

    it('formats numbers to one decimal place', () => {
      const dataWithDecimals: ParsedHealthData[] = [
        {
          date: new Date('2024-03-01'),
          weight: 70.123456,
          bodyFat: 15.987654,
        },
      ];

      const result = convertToCSV(dataWithDecimals);
      const lines = result.split('\n');

      expect(lines[1]).toBe('2024/3/1,70.1,16.0');
    });
  });

  describe('downloadCSV', () => {
    it('creates and clicks download link with BOM', () => {
      const csvContent = 'test,data\n1,2';
      const filename = 'test.csv';

      downloadCSV(csvContent, filename);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
      expect(blob.type).toBe('text/csv;charset=utf-8;');
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('uses default filename when not provided', () => {
      downloadCSV('test,data');
      expect(mockClick).toHaveBeenCalled();
    });

    it('adds BOM to CSV content', () => {
      const csvContent = 'test,data';
      downloadCSV(csvContent);

      const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
      expect(blob.toString()).toContain('Blob');
    });
  });

  describe('exportHealthDataToCSV', () => {
    beforeEach(() => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-03-15T12:00:00.000Z');
    });

    afterEach(() => {
      (Date.prototype.toISOString as jest.Mock).mockRestore();
    });

    it('exports health data with timestamp in filename', () => {
      exportHealthDataToCSV(mockHealthData);
      expect(mockClick).toHaveBeenCalled();
    });

    it('converts data to CSV and triggers download', () => {
      exportHealthDataToCSV(mockHealthData);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('handles empty data array', () => {
      exportHealthDataToCSV([]);
      expect(mockClick).toHaveBeenCalled();
    });
  });
});