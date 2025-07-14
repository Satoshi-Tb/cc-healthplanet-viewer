'use client';

import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { exportHealthDataToCSV } from '@/lib/export-utils';
import { ParsedHealthData } from '@/types';

interface ExportButtonProps {
  data: ParsedHealthData[];
  disabled?: boolean;
}

export function ExportButton({ data, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;
    exportHealthDataToCSV(data);
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