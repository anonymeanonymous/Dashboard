import * as XLSX from 'xlsx';
import { Dataset, DataColumn } from '../types/dashboard';

export const parseExcelFile = (file: File): Promise<Dataset[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const datasets: Dataset[] = workbook.SheetNames.map((sheetName, index) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (jsonData.length === 0) {
            return null;
          }

          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);

          const columns: DataColumn[] = headers.map((header, colIndex) => {
            const values = rows.map(row => row[colIndex]).filter(v => v !== undefined && v !== null);
            const type = detectColumnType(values);

            return {
              name: header || `Column ${colIndex + 1}`,
              type,
              values
            };
          });

          const rowObjects = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header || `Column ${index + 1}`] = row[index];
            });
            return obj;
          });

          return {
            id: `dataset-${Date.now()}-${index}`,
            name: `${file.name} - ${sheetName}`,
            sheetName,
            columns,
            rows: rowObjects
          };
        }).filter(Boolean) as Dataset[];

        resolve(datasets);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

const detectColumnType = (values: any[]): 'string' | 'number' | 'date' => {
  const sampleSize = Math.min(values.length, 20);
  const samples = values.slice(0, sampleSize);

  const numberCount = samples.filter(v => typeof v === 'number' || !isNaN(Number(v))).length;
  const dateCount = samples.filter(v => !isNaN(Date.parse(v))).length;

  if (numberCount / sampleSize > 0.8) return 'number';
  if (dateCount / sampleSize > 0.8) return 'date';
  return 'string';
};
