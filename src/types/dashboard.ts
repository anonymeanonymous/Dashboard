export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'table' | 'metric';

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date';
  values: any[];
}

export interface Dataset {
  id: string;
  name: string;
  sheetName: string;
  columns: DataColumn[];
  rows: any[];
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  datasetId: string;
  xAxis?: string;
  yAxis?: string[];
  colors?: string[];
  filters?: Filter[];
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface Filter {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Dashboard {
  id: string;
  name: string;
  charts: ChartConfig[];
  layout: LayoutItem[];
  createdAt: Date;
}
