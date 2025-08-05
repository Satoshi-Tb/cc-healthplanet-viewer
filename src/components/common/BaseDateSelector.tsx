'use client';

import { Box, Typography, TextField } from '@mui/material';

interface BaseDateSelectorProps {
  baseDate: Date;
  onDateChange: (date: Date | null) => void;
}

export function BaseDateSelector({ baseDate, onDateChange }: BaseDateSelectorProps) {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      const date = new Date(value);
      onDateChange(date);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
        基準日
      </Typography>
      <TextField
        type="date"
        value={formatDateForInput(baseDate)}
        onChange={handleDateChange}
        size="small"
        sx={{ maxWidth: 200 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
}