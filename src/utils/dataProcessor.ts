import { Dataset, ChartConfig, Filter } from '../types/dashboard';

export const processChartData = (dataset: Dataset, config: ChartConfig) => {
  let filteredRows = [...dataset.rows];

  if (config.filters && config.filters.length > 0) {
    filteredRows = applyFilters(filteredRows, config.filters);
  }

  if (config.xAxis && config.yAxis && config.yAxis.length > 0) {
    return aggregateData(filteredRows, config);
  }

  return filteredRows;
};

const applyFilters = (rows: any[], filters: Filter[]) => {
  return rows.filter(row => {
    return filters.every(filter => {
      const value = row[filter.column];

      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'greater':
          return Number(value) > Number(filter.value);
        case 'less':
          return Number(value) < Number(filter.value);
        case 'between':
          return Number(value) >= Number(filter.value[0]) && Number(value) <= Number(filter.value[1]);
        default:
          return true;
      }
    });
  });
};

const aggregateData = (rows: any[], config: ChartConfig) => {
  if (!config.xAxis || !config.yAxis || config.yAxis.length === 0) {
    return rows;
  }

  const grouped = rows.reduce((acc, row) => {
    const key = row[config.xAxis!];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(grouped).map(([key, groupRows]) => {
    const result: any = { [config.xAxis!]: key };

    config.yAxis!.forEach(yCol => {
      const values = groupRows.map(r => Number(r[yCol]) || 0);

      switch (config.aggregation) {
        case 'sum':
          result[yCol] = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          result[yCol] = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'count':
          result[yCol] = values.length;
          break;
        case 'min':
          result[yCol] = Math.min(...values);
          break;
        case 'max':
          result[yCol] = Math.max(...values);
          break;
        default:
          result[yCol] = values.reduce((a, b) => a + b, 0);
      }
    });

    return result;
  });
};
