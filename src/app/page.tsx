"use client";

import { Box, Alert, CircularProgress } from "@mui/material";
import {
  Layout,
  DateRangeSelector,
  BaseDateSelector,
  ExportButton,
} from "@/components/common";
import { HealthChartGrid } from "@/components/charts";
import { HealthDataTable } from "@/components/data";
import { useHealthData, useDateRange } from "@/hooks";

export default function Home() {
  const {
    selectedRange,
    setSelectedRange,
    baseDate,
    setBaseDate,
    dateRangeFilter,
  } = useDateRange();
  const { data, error, isLoading } = useHealthData(dateRangeFilter);

  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <BaseDateSelector
              baseDate={baseDate}
              onDateChange={(date) => date && setBaseDate(date)}
            />
            <DateRangeSelector
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
          </Box>
          <ExportButton 
            data={data} 
            disabled={isLoading}
            startDate={dateRangeFilter.startDate}
            endDate={dateRangeFilter.endDate}
          />
        </Box>

        {error && (
          <Alert severity="error">
            データの取得に失敗しました: {error.message}
          </Alert>
        )}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && !error && (
          <>
            <HealthChartGrid data={data} />
            <HealthDataTable data={data} />
          </>
        )}
      </Box>
    </Layout>
  );
}
