'use client';

import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { exportHealthDataToCSV } from '@/lib/export-utils';
import { ParsedHealthData } from '@/types';

interface ExportButtonProps {
  data: ParsedHealthData[];
  disabled?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export function ExportButton({ data, disabled = false, startDate, endDate }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;
    exportHealthDataToCSV(data, startDate, endDate);
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Download />}
      onClick={handleExport}
      disabled={disabled || data.length === 0}
      size="small"
    >
      CSVエクスポート
    </Button>
  );
}