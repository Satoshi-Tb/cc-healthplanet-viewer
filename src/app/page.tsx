'use client';

import { Box, Alert, CircularProgress } from '@mui/material';
import { Layout, DateRangeSelector, ExportButton } from '@/components/common';
import { HealthChartGrid } from '@/components/charts';
import { HealthDataTable } from '@/components/data';
import { useHealthData, useDateRange } from '@/hooks';

export default function Home() {
  const { selectedRange, setSelectedRange, dateRangeFilter } = useDateRange();
  const { data, error, isLoading } = useHealthData(dateRangeFilter);

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <DateRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
          <ExportButton data={data} disabled={isLoading} />
        </Box>

        {error && (
          <Alert severity="error">
            データの取得に失敗しました: {error.message}
          </Alert>
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
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
