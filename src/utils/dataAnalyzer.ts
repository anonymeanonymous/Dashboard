import { DataColumn } from '../types/dashboard';

export interface ColumnAnalysis extends DataColumn {
  cardinality: number;
  nullCount: number;
  emptyCount: number;
  uniqueValues: any[];
  minValue?: number;
  maxValue?: number;
  avgValue?: number;
  medianValue?: number;
  minDate?: Date;
  maxDate?: Date;
  isCategorical: boolean;
  isNumeric: boolean;
  isDate: boolean;
  isString: boolean;
  confidence: number;
}

const COMMON_DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
  /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
  /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, // Flexible date
  /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{1,2},?\s*\d{4}$/i, // Named month
  /^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-\d{4}$/i, // DD-Mon-YYYY
];

const CURRENCY_PATTERN = /^[$€£¥]?\s*[\d,]+\.?\d{0,2}$|^[\d,]+\.?\d{0,2}\s*[$€£¥]?$/;
const PERCENTAGE_PATTERN = /^[\d,]+\.?\d*\s*%?$/;
const BOOLEAN_PATTERN = /^(true|false|yes|no|y|n|1|0|on|off)$/i;

export const analyzeColumn = (column: DataColumn, allRows: any[]): ColumnAnalysis => {
  const values = column.values.filter(v => v !== undefined && v !== null && v !== '');
  const rawValues = column.values;

  const nullCount = rawValues.filter(v => v === null || v === undefined).length;
  const emptyCount = rawValues.filter(v => v === '').length;
  const uniqueValues = [...new Set(values)];
  const cardinality = uniqueValues.length;

  // Advanced type detection
  const typeAnalysis = analyzeType(values, uniqueValues, cardinality);

  // Statistical analysis
  const numericAnalysis = extractNumericStats(values);
  const dateAnalysis = extractDateStats(values);

  // Determine if categorical
  const isCategorical = determineCategorical(cardinality, values.length, typeAnalysis.isString);

  return {
    ...column,
    cardinality,
    nullCount,
    emptyCount,
    uniqueValues,
    minValue: numericAnalysis.min,
    maxValue: numericAnalysis.max,
    avgValue: numericAnalysis.avg,
    medianValue: numericAnalysis.median,
    minDate: dateAnalysis.min,
    maxDate: dateAnalysis.max,
    isCategorical,
    isNumeric: typeAnalysis.isNumeric,
    isDate: typeAnalysis.isDate,
    isString: typeAnalysis.isString,
    confidence: typeAnalysis.confidence,
    type: typeAnalysis.type
  };
};

const analyzeType = (
  values: any[],
  uniqueValues: any[],
  cardinality: number
): { type: 'string' | 'number' | 'date'; isNumeric: boolean; isString: boolean; isDate: boolean; confidence: number } => {
  if (values.length === 0) {
    return { type: 'string', isNumeric: false, isString: true, isDate: false, confidence: 0 };
  }

  const sampleSize = Math.min(values.length, 100);
  const samples = values.slice(0, sampleSize);

  let numberCount = 0;
  let dateCount = 0;
  let currencyCount = 0;
  let percentageCount = 0;

  samples.forEach(value => {
    const strValue = String(value).trim();

    // Boolean check (don't count as type)
    if (BOOLEAN_PATTERN.test(strValue)) {
      return;
    }

    // Currency check
    if (CURRENCY_PATTERN.test(strValue)) {
      currencyCount++;
      const numericPart = parseFloat(strValue.replace(/[$€£¥\s,]/g, ''));
      if (!isNaN(numericPart)) {
        numberCount++;
        return;
      }
    }

    // Percentage check
    if (PERCENTAGE_PATTERN.test(strValue)) {
      percentageCount++;
      const numericPart = parseFloat(strValue.replace(/[%,\s]/g, ''));
      if (!isNaN(numericPart)) {
        numberCount++;
        return;
      }
    }

    // Number check (strict)
    if (!isNaN(Number(strValue)) && strValue !== '') {
      numberCount++;
      return;
    }

    // Date check with pattern matching
    if (isValidDate(strValue)) {
      dateCount++;
      return;
    }
  });

  const numberConfidence = numberCount / sampleSize;
  const dateConfidence = dateCount / sampleSize;

  // Determine primary type
  if (numberConfidence > 0.8) {
    return { type: 'number', isNumeric: true, isString: false, isDate: false, confidence: numberConfidence };
  }

  if (dateConfidence > 0.8) {
    return { type: 'date', isNumeric: false, isString: false, isDate: true, confidence: dateConfidence };
  }

  return { type: 'string', isNumeric: false, isString: true, isDate: false, confidence: 1 - Math.max(numberConfidence, dateConfidence) };
};

const isValidDate = (value: string): boolean => {
  // First check pattern matching
  if (COMMON_DATE_PATTERNS.some(pattern => pattern.test(value))) {
    return true;
  }

  // Then check if Date.parse can handle it properly
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    return false;
  }

  // Avoid false positives: exclude pure numbers that Date.parse accepts
  if (/^\d+$/.test(value.trim())) {
    return false;
  }

  // Verify it's a reasonable date (not far in past/future)
  const year = new Date(timestamp).getFullYear();
  return year >= 1900 && year <= 2100;
};

const extractNumericStats = (values: any[]): { min?: number; max?: number; avg?: number; median?: number } => {
  const numericValues = values
    .map(v => {
      const cleaned = String(v).replace(/[$€£¥\s,]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    })
    .filter(v => v !== null)
    .sort((a, b) => (a as number) - (b as number)) as number[];

  if (numericValues.length === 0) {
    return {};
  }

  const median = numericValues.length % 2 === 0
    ? (numericValues[numericValues.length / 2 - 1] + numericValues[numericValues.length / 2]) / 2
    : numericValues[Math.floor(numericValues.length / 2)];

  return {
    min: numericValues[0],
    max: numericValues[numericValues.length - 1],
    avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
    median
  };
};

const extractDateStats = (values: any[]): { min?: Date; max?: Date } => {
  const dateValues = values
    .map(v => {
      if (isValidDate(String(v))) {
        return new Date(String(v));
      }
      return null;
    })
    .filter(v => v !== null && !isNaN(v.getTime())) as Date[];

  if (dateValues.length === 0) {
    return {};
  }

  return {
    min: new Date(Math.min(...dateValues.map(d => d.getTime()))),
    max: new Date(Math.max(...dateValues.map(d => d.getTime())))
  };
};

const determineCategorical = (cardinality: number, totalValues: number, isString: boolean): boolean => {
  if (!isString) {
    return false;
  }

  const cardinalityRatio = cardinality / totalValues;

  // Low cardinality string = categorical
  if (cardinality <= 20) {
    return true;
  }

  // Medium cardinality but small dataset
  if (cardinalityRatio < 0.3 && cardinality <= 100) {
    return true;
  }

  return false;
};

export const analyzeDataset = (columns: DataColumn[], rows: any[]): ColumnAnalysis[] => {
  return columns.map(col => analyzeColumn(col, rows));
};
