'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
} from '@mui/material';
import { MOVING_AVERAGE_OPTIONS, MovingAverageDays } from '@/lib/moving-average';

interface MovingAverageSelectorProps {
  selectedDays: MovingAverageDays[];
  onChange: (selectedDays: MovingAverageDays[]) => void;
  testId?: string;
}

export function MovingAverageSelector({
  selectedDays,
  onChange,
  testId = 'moving-average-selector',
}: MovingAverageSelectorProps) {
  const handleChange = (days: MovingAverageDays) => {
    const newSelectedDays = selectedDays.includes(days)
      ? selectedDays.filter(d => d !== days)
      : [...selectedDays, days];
    
    onChange(newSelectedDays);
  };

  return (
    <Box data-testid={testId}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
          移動平均線
        </FormLabel>
        <FormGroup row>
          {MOVING_AVERAGE_OPTIONS.map(({ label, value, color }) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  checked={selectedDays.includes(value)}
                  onChange={() => handleChange(value)}
                  name={`moving-average-${value}`}
                  data-testid={`${testId}-${value}`}
                  sx={{
                    color: color,
                    '&.Mui-checked': {
                      color: color,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{label}</span>
                  <Chip
                    size="small"
                    sx={{
                      backgroundColor: color,
                      color: 'white',
                      height: 16,
                      fontSize: '0.625rem',
                      '& .MuiChip-label': {
                        px: 0.5,
                      },
                    }}
                    label="━"
                  />
                </Box>
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}