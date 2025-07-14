import { ParsedHealthData, ExportData } from '@/types';

export function convertToCSV(data: ParsedHealthData[]): string {
  if (data.length === 0) return '';

  const headers = ['日付', '体重(kg)', '体脂肪率(%)', '筋肉量(kg)', 'BMI'];
  const csvHeaders = headers.join(',');

  const csvRows = data.map(item => {
    const row: ExportData = {
      date: item.date.toLocaleDateString('ja-JP'),
      weight: item.weight?.toFixed(1) || '',
      bodyFat: item.bodyFat?.toFixed(1) || '',
      muscle: item.muscle?.toFixed(1) || '',
      bmi: item.bmi?.toFixed(1) || '',
    };
    
    return Object.values(row).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

export function downloadCSV(csvContent: string, filename: string = 'health-data.csv'): void {
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;
  
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function exportHealthDataToCSV(data: ParsedHealthData[]): void {
  const csvContent = convertToCSV(data);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `health-data-${timestamp}.csv`;
  downloadCSV(csvContent, filename);
}