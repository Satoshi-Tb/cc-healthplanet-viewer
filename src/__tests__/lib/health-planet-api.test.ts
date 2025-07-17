import { HealthPlanetAPI } from '@/lib/health-planet-api';
import { HealthData } from '@/types';

global.fetch = jest.fn();

describe('HealthPlanetAPI', () => {
  let api: HealthPlanetAPI;

  beforeEach(() => {
    api = new HealthPlanetAPI();
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchHealthData', () => {
    it('makes POST request with correct parameters', async () => {
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

    it('makes request without tag parameter when not provided', async () => {
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

    it('returns health data on success', async () => {
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

    it('throws error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Bad Request' }),
      };
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(api.fetchHealthData('20240301', '20240315'))
        .rejects.toThrow('Bad Request');
    });

    it('throws generic error when response json fails', async () => {
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

  describe('parseHealthData', () => {
    it('parses weight and body fat data correctly', () => {
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

    it('sorts data by date in ascending order', () => {
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

    it('groups multiple measurements for the same date', () => {
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

    it('handles unknown tags by ignoring them', () => {
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

    it('returns empty array for empty input', () => {
      const result = api.parseHealthData([]);
      expect(result).toEqual([]);
    });
  });

  describe('formatDateForAPI', () => {
    it('formats date to YYYYMMDD string', () => {
      const date = new Date(2024, 2, 15);
      const result = api.formatDateForAPI(date);
      expect(result).toBe('20240315');
    });

    it('pads single digit months and days with zero', () => {
      const date = new Date(2024, 0, 5);
      const result = api.formatDateForAPI(date);
      expect(result).toBe('20240105');
    });

    it('handles year boundaries correctly', () => {
      const date = new Date(2023, 11, 31);
      const result = api.formatDateForAPI(date);
      expect(result).toBe('20231231');
    });
  });
});