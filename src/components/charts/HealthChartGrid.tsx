'use client';

import { Box } from '@mui/material';
import { HealthChart } from './HealthChart';
import { ParsedHealthData } from '@/types';

interface HealthChartGridProps {
  data: ParsedHealthData[];
}

export function HealthChartGrid({ data }: HealthChartGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
      }}
    >
      <HealthChart
        data={data}
        dataKey="weight"
        title="体重"
        unit="kg"
        color="#1976d2"
      />
      <HealthChart
        data={data}
        dataKey="bodyFat"
        title="体脂肪率"
        unit="%"
        color="#dc004e"
      />
    </Box>
  );
}