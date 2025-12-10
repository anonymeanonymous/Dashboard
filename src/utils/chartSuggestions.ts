import { Dataset, ChartType, ChartConfig } from '../types/dashboard';

export const suggestCharts = (dataset: Dataset): ChartConfig[] => {
  const suggestions: ChartConfig[] = [];
  const numericColumns = dataset.columns.filter(col => col.type === 'number');
  const stringColumns = dataset.columns.filter(col => col.type === 'string');
  const dateColumns = dataset.columns.filter(col => col.type === 'date');

  const timestamp = Date.now();
  let chartIndex = 1;

  if (numericColumns.length > 0) {
    suggestions.push({
      id: `chart-${timestamp}-${chartIndex++}`,
      type: 'metric',
      title: `Total ${numericColumns[0].name}`,
      datasetId: dataset.id,
      yAxis: [numericColumns[0].name],
      aggregation: 'sum',
      filters: [],
      colors: ['#3b82f6']
    });
  }

  if (stringColumns.length > 0 && numericColumns.length > 0) {
    for (let i = 0; i < Math.min(stringColumns.length, 2); i++) {
      const categoryCol = stringColumns[i];
      const uniqueValues = new Set(categoryCol.values).size;

      if (uniqueValues <= 20) {
        suggestions.push({
          id: `chart-${timestamp}-${chartIndex++}`,
          type: uniqueValues <= 6 ? 'pie' : 'bar',
          title: `${numericColumns[0].name} by ${categoryCol.name}`,
          datasetId: dataset.id,
          xAxis: categoryCol.name,
          yAxis: [numericColumns[0].name],
          aggregation: 'sum',
          filters: [],
          colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
        });
      }
    }
  }

  if (dateColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      id: `chart-${timestamp}-${chartIndex++}`,
      type: 'line',
      title: `${numericColumns[0].name} over Time`,
      datasetId: dataset.id,
      xAxis: dateColumns[0].name,
      yAxis: [numericColumns[0].name],
      aggregation: 'sum',
      filters: [],
      colors: ['#3b82f6']
    });
  }

  if (numericColumns.length >= 2 && stringColumns.length > 0) {
    const uniqueValues = new Set(stringColumns[0].values).size;
    if (uniqueValues <= 12) {
      suggestions.push({
        id: `chart-${timestamp}-${chartIndex++}`,
        type: 'bar',
        title: `Comparison: ${numericColumns[0].name} vs ${numericColumns[1].name}`,
        datasetId: dataset.id,
        xAxis: stringColumns[0].name,
        yAxis: [numericColumns[0].name, numericColumns[1].name],
        aggregation: 'sum',
        filters: [],
        colors: ['#3b82f6', '#8b5cf6']
      });
    }
  }

  if (numericColumns.length >= 2) {
    suggestions.push({
      id: `chart-${timestamp}-${chartIndex++}`,
      type: 'area',
      title: `Trend Analysis`,
      datasetId: dataset.id,
      xAxis: dateColumns.length > 0 ? dateColumns[0].name : stringColumns.length > 0 ? stringColumns[0].name : undefined,
      yAxis: numericColumns.slice(0, 2).map(col => col.name),
      aggregation: 'sum',
      filters: [],
      colors: ['#3b82f6', '#8b5cf6']
    });
  }

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
