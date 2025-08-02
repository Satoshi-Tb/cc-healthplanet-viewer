'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { HealthChart } from './HealthChart';
import { MovingAverageSelector } from './MovingAverageSelector';
import { ParsedHealthData } from '@/types';
import { MovingAverageDays } from '@/lib/moving-average';

interface HealthChartGridProps {
  data: ParsedHealthData[];
}

export function HealthChartGrid({ data }: HealthChartGridProps) {
  const [selectedMovingAverages, setSelectedMovingAverages] = useState<MovingAverageDays[]>([]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          チャート設定
        </Typography>
        <MovingAverageSelector
          selectedDays={selectedMovingAverages}
          onChange={setSelectedMovingAverages}
        />
      </Paper>
      
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
          testId="weight-chart"
          showMovingAverages={selectedMovingAverages}
        />
        <HealthChart
          data={data}
          dataKey="bodyFat"
          title="体脂肪率"
          unit="%"
          color="#dc004e"
          testId="body-fat-chart"
          showMovingAverages={selectedMovingAverages}
        />
      </Box>
    </Box>
  );
}