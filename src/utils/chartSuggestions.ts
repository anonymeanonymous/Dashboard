import { Dataset, ChartType, ChartConfig } from '../types/dashboard';
import { analyzeDataset } from './dataAnalyzer';

export const suggestCharts = (dataset: Dataset): ChartConfig[] => {
  const suggestions: ChartConfig[] = [];

  // Get advanced analysis
  const analysis = analyzeDataset(dataset.columns, dataset.rows);

  const numericCols = analysis.filter(col => col.isNumeric).sort((a, b) => {
    const aVariance = getVariance(a.values);
    const bVariance = getVariance(b.values);
    return bVariance - aVariance;
  });

  const categoricalCols = analysis.filter(col => col.isCategorical);
  const dateCols = analysis.filter(col => col.isDate);
  const stringCols = analysis.filter(col => col.isString && !col.isCategorical);

  const timestamp = Date.now();
  let chartIndex = 1;

  // Metric chart - best numeric column
  if (numericCols.length > 0) {
    const bestNumeric = numericCols[0];
    suggestions.push({
      id: `chart-${timestamp}-${chartIndex++}`,
      type: 'metric',
      title: `Total ${bestNumeric.name}`,
      datasetId: dataset.id,
      yAxis: [bestNumeric.name],
      aggregation: 'sum',
      filters: [],
      colors: ['#3b82f6']
    });
  }

  // Bar chart - categorical vs numeric
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    // Pick categorical with reasonable cardinality
    const bestCategorical = categoricalCols
      .filter(col => col.cardinality <= 25)
      .sort((a, b) => b.cardinality - a.cardinality)[0];

    if (bestCategorical) {
      const chartType = bestCategorical.cardinality <= 8 ? 'pie' : 'bar';
      suggestions.push({
        id: `chart-${timestamp}-${chartIndex++}`,
        type: chartType,
        title: `${numericCols[0].name} by ${bestCategorical.name}`,
        datasetId: dataset.id,
        xAxis: bestCategorical.name,
        yAxis: [numericCols[0].name],
        aggregation: 'sum',
        filters: [],
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6366f1']
      });
    }
  }

  // Time series - date vs numeric
  if (dateCols.length > 0 && numericCols.length > 0) {
    const bestDate = dateCols[0];
    const timePeriod = bestDate.maxDate && bestDate.minDate
      ? Math.ceil((bestDate.maxDate.getTime() - bestDate.minDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    suggestions.push({
      id: `chart-${timestamp}-${chartIndex++}`,
      type: timePeriod > 90 ? 'area' : 'line',
      title: `${numericCols[0].name} over Time`,
      datasetId: dataset.id,
      xAxis: bestDate.name,
      yAxis: [numericCols[0].name],
      aggregation: 'sum',
      filters: [],
      colors: ['#3b82f6']
    });
  }

  // Multi-metric comparison
  if (numericCols.length >= 2) {
    const bestCategorical = categoricalCols
      .filter(col => col.cardinality <= 12)
      .sort((a, b) => b.cardinality - a.cardinality)[0];

    if (bestCategorical) {
      suggestions.push({
        id: `chart-${timestamp}-${chartIndex++}`,
        type: 'bar',
        title: `${numericCols[0].name} vs ${numericCols[1].name}`,
        datasetId: dataset.id,
        xAxis: bestCategorical.name,
        yAxis: [numericCols[0].name, numericCols[1].name],
        aggregation: 'sum',
        filters: [],
        colors: ['#3b82f6', '#8b5cf6']
      });
    }
  }

  // Additional multi-series trends
  if (numericCols.length >= 2 && (dateCols.length > 0 || categoricalCols.length > 0)) {
    const xAxisCol = dateCols.length > 0
      ? dateCols[0].name
      : categoricalCols.length > 0 && categoricalCols[0].cardinality <= 20
      ? categoricalCols[0].name
      : undefined;

    if (xAxisCol) {
      suggestions.push({
        id: `chart-${timestamp}-${chartIndex++}`,
        type: 'area',
        title: `Multi-Metric Trend`,
        datasetId: dataset.id,
        xAxis: xAxisCol,
        yAxis: numericCols.slice(0, 3).map(col => col.name),
        aggregation: 'sum',
        filters: [],
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
    }
  }

  // Data table
  suggestions.push({
    id: `chart-${timestamp}-${chartIndex++}`,
    type: 'table',
    title: 'Full Data Table',
    datasetId: dataset.id,
    filters: [],
    colors: []
  });

  return suggestions;
};

const getVariance = (values: any[]): number => {
  const numericValues = values
    .map(v => {
      const num = parseFloat(String(v).replace(/[$€£¥\s,]/g, ''));
      return isNaN(num) ? null : num;
    })
    .filter(v => v !== null) as number[];

  if (numericValues.length === 0) return 0;

  const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
  const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
  return variance;
};
