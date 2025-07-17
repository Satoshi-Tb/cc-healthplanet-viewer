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

describe('export-utils ユーティリティ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('convertToCSV 関数', () => {
    it('空のデータに対して空文字列を返す', () => {
      const result = convertToCSV([]);
      expect(result).toBe('');
    });

    it('ヘルスデータをヘッダー付きCSV形式に変換する', () => {
      const result = convertToCSV(mockHealthData);
      const lines = result.split('\n');

      expect(lines[0]).toBe('日付,体重(kg),体脂肪率(%)');
      expect(lines[1]).toBe('2024/3/1,70.5,15.2');
      expect(lines[2]).toBe('2024/3/2,70.3,15.1');
      expect(lines[3]).toBe('2024/3/3,,15.0');
    });

    it('欠損値を正しく処理する', () => {
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

    it('数値を小数点以下1桁でフォーマットする', () => {
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

  describe('downloadCSV 関数', () => {
    it('BOM付きダウンロードリンクを作成しクリックする', () => {
      const csvContent = 'test,data\n1,2';
      const filename = 'test.csv';

      downloadCSV(csvContent, filename);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
      expect(blob.type).toBe('text/csv;charset=utf-8;');
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('ファイル名が提供されない場合デフォルトファイル名を使用する', () => {
      downloadCSV('test,data');
      expect(mockClick).toHaveBeenCalled();
    });

    it('CSVコンテンツにBOMを追加する', () => {
      const csvContent = 'test,data';
      downloadCSV(csvContent);

      const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
      expect(blob.toString()).toContain('Blob');
    });
  });

  describe('exportHealthDataToCSV 関数', () => {
    beforeEach(() => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-03-15T12:00:00.000Z');
    });

    afterEach(() => {
      (Date.prototype.toISOString as jest.Mock).mockRestore();
    });

    it('ファイル名にタイムスタンプを含めてヘルスデータをエクスポートする', () => {
      exportHealthDataToCSV(mockHealthData);
      expect(mockClick).toHaveBeenCalled();
    });

    it('データをCSVに変換しダウンロードをトリガーする', () => {
      exportHealthDataToCSV(mockHealthData);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('空のデータ配列を処理する', () => {
      exportHealthDataToCSV([]);
      expect(mockClick).toHaveBeenCalled();
    });
  });
});