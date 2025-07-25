'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ParsedHealthData } from '@/types';

interface HealthChartProps {
  data: ParsedHealthData[];
  dataKey: 'weight' | 'bodyFat';
  title: string;
  unit: string;
  color?: string;
  testId?: string;
}

export function HealthChart({ data, dataKey, title, unit, color = '#1976d2', testId }: HealthChartProps) {
  const chartData = data
    .filter(item => item[dataKey] !== undefined)
    .map(item => ({
      date: item.date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
      value: item[dataKey],
      fullDate: item.date.toLocaleDateString('ja-JP'),
    }));

  const formatTooltip = (value: number | string, name: string) => {
    if (name === 'value' && typeof value === 'number') {
      return [`${value.toFixed(1)} ${unit}`, title];
    }
    return [value, name];
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        
        {chartData.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            <Typography variant="body2">データがありません</Typography>
          </Box>
        ) : (
          <Box 
            sx={{ flex: 1, width: '100%' }}
            data-testid={testId}
            aria-label={`${title}チャート`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullDate;
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}