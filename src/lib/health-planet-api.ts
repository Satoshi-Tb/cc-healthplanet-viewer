import { HealthPlanetResponse, HealthData, ParsedHealthData } from '@/types';

export class HealthPlanetAPI {
  async fetchHealthData(
    from: string,
    to: string,
    tag?: string
  ): Promise<HealthData[]> {
    const params = new URLSearchParams({
      from,
      to,
      ...(tag && { tag }),
    });

    const response = await fetch('/api/health-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data: HealthPlanetResponse = await response.json();

    return data.data;
  }

  parseHealthData(rawData: HealthData[]): ParsedHealthData[] {
    const dataMap = new Map<string, ParsedHealthData>();

    rawData.forEach((item) => {
      const date = item.date.substring(0, 8);
      const dateObj = this.parseDate(date);
      
      if (!dataMap.has(date)) {
        dataMap.set(date, { date: dateObj });
      }

      const entry = dataMap.get(date)!;
      const value = parseFloat(item.keydata);

      switch (item.tag) {
        case '6021':
          entry.weight = value;
          break;
        case '6022':
          entry.bodyFat = value;
          break;
      }
    });

    return Array.from(dataMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }

  private parseDate(dateString: string): Date {
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1;
    const day = parseInt(dateString.substring(6, 8));
    return new Date(year, month, day);
  }

  formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }
}