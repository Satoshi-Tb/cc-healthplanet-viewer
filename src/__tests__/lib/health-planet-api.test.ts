import { HealthPlanetAPI } from '@/lib/health-planet-api';
import { HealthData } from '@/types';

global.fetch = jest.fn();

describe('HealthPlanetAPI クラス', () => {
  let api: HealthPlanetAPI;

  beforeEach(() => {
    api = new HealthPlanetAPI();
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchHealthData メソッド', () => {
    it('正しいパラメータでPOSTリクエストを実行する', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await api.fetchHealthData('20240301', '20240315', '6021');

      const expectedParams = new URLSearchParams({
        from: '20240301',
        to: '20240315',
        tag: '6021',
      });
      
      expect(fetch).toHaveBeenCalledWith('/api/health-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expectedParams,
      });
    });

    it('tagパラメータが提供されない場合、tagなしでリクエストする', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: [] }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await api.fetchHealthData('20240301', '20240315');

      const expectedParams = new URLSearchParams({
        from: '20240301',
        to: '20240315',
      });

      expect(fetch).toHaveBeenCalledWith('/api/health-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expectedParams,
      });
    });

    it('成功時にヘルスデータを返す', async () => {
      const mockData = [
        { date: '20240301', tag: '6021', keydata: '70.5' },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockData }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await api.fetchHealthData('20240301', '20240315');

      expect(result).toEqual(mockData);
    });

    it('レスポンスがOKでない場合エラーをスローする', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Bad Request' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(api.fetchHealthData('20240301', '20240315'))
        .rejects.toThrow('Bad Request');
    });

    it('レスポンスJSONパースに失敗した場合一般的なエラーをスローする', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(api.fetchHealthData('20240301', '20240315'))
        .rejects.toThrow('API error: 500');
    });
  });

  describe('parseHealthData メソッド', () => {
    it('体重と体脂肪率データを正しくパースする', () => {
      const rawData: HealthData[] = [
        { date: '20240301', tag: '6021', keydata: '70.5', model: 'test' },
        { date: '20240301', tag: '6022', keydata: '15.2', model: 'test' },
        { date: '20240302', tag: '6021', keydata: '70.3', model: 'test' },
      ];

      const result = api.parseHealthData(rawData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: new Date(2024, 2, 1),
        weight: 70.5,
        bodyFat: 15.2,
      });
      expect(result[1]).toEqual({
        date: new Date(2024, 2, 2),
        weight: 70.3,
      });
    });

    it('データを日付の昇順でソートする', () => {
      const rawData: HealthData[] = [
        { date: '20240303', tag: '6021', keydata: '69.8', model: 'test' },
        { date: '20240301', tag: '6021', keydata: '70.5', model: 'test' },
        { date: '20240302', tag: '6021', keydata: '70.3', model: 'test' },
      ];

      const result = api.parseHealthData(rawData);

      expect(result[0].date).toEqual(new Date(2024, 2, 1));
      expect(result[1].date).toEqual(new Date(2024, 2, 2));
      expect(result[2].date).toEqual(new Date(2024, 2, 3));
    });

    it('同じ日付の複数の測定値をグループ化する', () => {
      const rawData: HealthData[] = [
        { date: '2024030108', tag: '6021', keydata: '70.5', model: 'test' },
        { date: '2024030112', tag: '6022', keydata: '15.2', model: 'test' },
        { date: '2024030118', tag: '6021', keydata: '70.3', model: 'test' },
      ];

      const result = api.parseHealthData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        date: new Date(2024, 2, 1),
        weight: 70.3,
        bodyFat: 15.2,
      });
    });

    it('未知のtagを無視して処理する', () => {
      const rawData: HealthData[] = [
        { date: '20240301', tag: '6021', keydata: '70.5', model: 'test' },
        { date: '20240301', tag: '9999', keydata: '100', model: 'test' },
      ];

      const result = api.parseHealthData(rawData);

      expect(result[0]).toEqual({
        date: new Date(2024, 2, 1),
        weight: 70.5,
      });
    });

    it('空の入力に対して空の配列を返す', () => {
      const result = api.parseHealthData([]);
      expect(result).toEqual([]);
    });
  });

  describe('formatDateForAPI メソッド', () => {
    it('日付をYYYYMMDD文字列にフォーマットする', () => {
      const date = new Date(2024, 2, 15);
      const result = api.formatDateForAPI(date);
      expect(result).toBe('20240315');
    });

    it('一桁の月と日をゼロ埋めする', () => {
      const date = new Date(2024, 0, 5);
      const result = api.formatDateForAPI(date);
      expect(result).toBe('20240105');
    });

    it('年の境界を正しく処理する', () => {
      const date = new Date(2023, 11, 31);
      const result = api.formatDateForAPI(date);
      expect(result).toBe('20231231');
    });
  });
});