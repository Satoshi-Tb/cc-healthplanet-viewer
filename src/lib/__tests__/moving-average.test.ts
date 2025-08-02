import {
  calculateMovingAverage,
  calculateAllMovingAverages,
} from "../moving-average";
import { ParsedHealthData } from "@/types";

const mockData: ParsedHealthData[] = [
  { date: new Date("2024-01-01"), weight: 70.0, bodyFat: 15.0 },
  { date: new Date("2024-01-02"), weight: 70.2, bodyFat: 15.1 },
  { date: new Date("2024-01-03"), weight: 70.1, bodyFat: 15.2 },
  { date: new Date("2024-01-04"), weight: 70.3, bodyFat: 15.0 },
  { date: new Date("2024-01-05"), weight: 70.0, bodyFat: 14.9 },
  { date: new Date("2024-01-06"), weight: 69.9, bodyFat: 15.1 },
  { date: new Date("2024-01-07"), weight: 70.1, bodyFat: 15.0 },
];

describe("moving-average", () => {
  describe("calculateMovingAverage", () => {
    it("should calculate 5-day moving average for weight", () => {
      const result = calculateMovingAverage(mockData, {
        days: 5,
        dataKey: "weight",
      });

      // First 4 items should not have moving average
      expect(result[0].movingAverage5).toBeUndefined();
      expect(result[1].movingAverage5).toBeUndefined();
      expect(result[2].movingAverage5).toBeUndefined();
      expect(result[3].movingAverage5).toBeUndefined();

      // 5th item should have moving average (70.0 + 70.2 + 70.1 + 70.3 + 70.0) / 5 = 70.12
      expect(result[4].movingAverage5).toBe(70.12);

      // 6th item should have moving average (70.2 + 70.1 + 70.3 + 70.0 + 69.9) / 5 = 70.1
      expect(result[5].movingAverage5).toBe(70.1);
    });

    it("should calculate 5-day moving average for bodyFat", () => {
      const result = calculateMovingAverage(mockData, {
        days: 5,
        dataKey: "bodyFat",
      });

      // 5th item should have moving average (15.0 + 15.1 + 15.2 + 15.0 + 14.9) / 5 = 15.04
      expect(result[4].movingAverage5).toBe(15.04);
    });

    it("should handle empty data", () => {
      const result = calculateMovingAverage([], { days: 5, dataKey: "weight" });
      expect(result).toEqual([]);
    });

    it("should handle data with undefined values", () => {
      const dataWithUndefined: ParsedHealthData[] = [
        { date: new Date("2024-01-01"), weight: 70.0 },
        { date: new Date("2024-01-02"), weight: 70.2 },
        { date: new Date("2024-01-03"), weight: undefined },
        { date: new Date("2024-01-04"), weight: 70.3 },
        { date: new Date("2024-01-05"), weight: 70.0 },
      ];

      const result = calculateMovingAverage(dataWithUndefined, {
        days: 5,
        dataKey: "weight",
      });

      // Should calculate average only from valid values: (70.0 + 70.2 + 70.3 + 70.0) / 4 = 70.125
      expect(result[4].movingAverage5).toBe(70.13); // rounded to 2 decimal places
    });

    it("should sort data by date before calculation", () => {
      const unsortedData: ParsedHealthData[] = [
        { date: new Date("2024-01-03"), weight: 70.1 },
        { date: new Date("2024-01-01"), weight: 70.0 },
        { date: new Date("2024-01-02"), weight: 70.2 },
        { date: new Date("2024-01-04"), weight: 70.3 },
        { date: new Date("2024-01-05"), weight: 70.4 },
      ];

      const result = calculateMovingAverage(unsortedData, {
        days: 5,
        dataKey: "weight",
      });

      // Should be sorted: 70.0, 70.2, 70.1, 70.3, 70.4
      // 5th item average: (70.0 + 70.2 + 70.1 + 70.3 + 70.4) / 5 = 70.2
      expect(result[4].movingAverage5).toBe(70.2);
    });
  });

  describe("calculateAllMovingAverages", () => {
    it("should calculate all moving averages (5, 15, 30 days)", () => {
      // Create more data for 30-day average
      const extendedData: ParsedHealthData[] = [];
      for (let i = 0; i < 35; i++) {
        extendedData.push({
          date: new Date(2024, 0, i + 1),
          weight: 70 + Math.sin(i * 0.1) * 2, // Simulate weight fluctuation
          bodyFat: 15 + Math.cos(i * 0.1) * 1,
        });
      }

      const result = calculateAllMovingAverages(extendedData, "weight");

      // Check that all moving averages are calculated for items with enough data
      const item30 = result[29]; // 30th item (0-indexed)
      expect(item30.movingAverage5).toBeDefined();
      expect(item30.movingAverage15).toBeDefined();
      expect(item30.movingAverage30).toBeDefined();

      // Check that values are reasonable
      expect(typeof item30.movingAverage5).toBe("number");
      expect(typeof item30.movingAverage15).toBe("number");
      expect(typeof item30.movingAverage30).toBe("number");
    });

    it("should handle empty data", () => {
      const result = calculateAllMovingAverages([], "weight");
      expect(result).toEqual([]);
    });
  });
});
