'use client';

import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import { DateRange } from '@/types';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export function DateRangeSelector({ selectedRange, onRangeChange }: DateRangeSelectorProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, value: DateRange | null) => {
    if (value !== null) {
      onRangeChange(value);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        表示期間
      </Typography>
      <ToggleButtonGroup
        value={selectedRange}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{ gap: 1 }}
      >
        <ToggleButton value="week" sx={{ px: 2 }}>
          週次
        </ToggleButton>
        <ToggleButton value="month" sx={{ px: 2 }}>
          月次
        </ToggleButton>
        <ToggleButton value="year" sx={{ px: 2 }}>
          3ヵ月
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}