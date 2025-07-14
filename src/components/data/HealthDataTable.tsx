'use client';

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
} from '@mui/material';
import { ParsedHealthData } from '@/types';

interface HealthDataTableProps {
  data: ParsedHealthData[];
}

export function HealthDataTable({ data }: HealthDataTableProps) {
  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return '-';
    return `${value.toFixed(1)} ${unit}`;
  };

  const sortedData = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          データ一覧
        </Typography>
        
        {data.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 4,
            color: 'text.secondary'
          }}>
            <Typography variant="body2">データがありません</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>日付</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>体重</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>体脂肪率</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>筋肉量</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>BMI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.date.toLocaleDateString('ja-JP')}
                        {index === 0 && (
                          <Chip label="最新" size="small" color="primary" variant="outlined" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {formatValue(item.weight, 'kg')}
                    </TableCell>
                    <TableCell align="center">
                      {formatValue(item.bodyFat, '%')}
                    </TableCell>
                    <TableCell align="center">
                      {formatValue(item.muscle, 'kg')}
                    </TableCell>
                    <TableCell align="center">
                      {formatValue(item.bmi, '')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}