import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartConfig, Dataset } from '../types/dashboard';
import { processChartData } from '../utils/dataProcessor';

interface ChartRendererProps {
  config: ChartConfig;
  dataset: Dataset;
}

export const ChartRenderer = ({ config, dataset }: ChartRendererProps) => {
  const data = processChartData(dataset, config);
  const colors = config.colors || ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No data available for this chart</p>
      </div>
    );
  }

  if (config.type === 'metric') {
    return <MetricCard data={data} config={config} />;
  }

  if (config.type === 'table') {
    return <DataTable data={data} dataset={dataset} />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height="80%">
        {renderChart(config, data)}
      </ResponsiveContainer>
      {config.type !== 'pie' && config.yAxis && config.yAxis.length > 0 && (
        <DataLegend config={config} colors={colors} />
      )}
    </div>
  );
};

const renderChart = (config: ChartConfig, data: any[]) => {
  const colors = config.colors || ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  switch (config.type) {
    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.yAxis?.map((yCol, index) => (
            <Bar key={yCol} dataKey={yCol} fill={colors[index % colors.length]} />
          ))}
        </BarChart>
      );

    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.yAxis?.map((yCol, index) => (
            <Line
              key={yCol}
              type="monotone"
              dataKey={yCol}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      );

    case 'area':
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.yAxis?.map((yCol, index) => (
            <Area
              key={yCol}
              type="monotone"
              dataKey={yCol}
              fill={colors[index % colors.length]}
              stroke={colors[index % colors.length]}
            />
          ))}
        </AreaChart>
      );

    case 'pie':
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={config.yAxis?.[0]}
            nameKey={config.xAxis}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );

    default:
      return null;
  }
};

const MetricCard = ({ data, config }: { data: any[]; config: ChartConfig }) => {
  const value = data.reduce((sum, row) => {
    const val = config.yAxis?.[0] ? Number(row[config.yAxis[0]]) || 0 : 0;
    return sum + val;
  }, 0);

  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2
  }).format(value);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{config.title}</h3>
      <div className="text-4xl font-bold text-blue-600">{formatted}</div>
    </div>
  );
};

const DataTable = ({ data, dataset }: { data: any[]; dataset: Dataset }) => {
  const columns = dataset.columns.map(col => col.name);
  const displayData = data.slice(0, 50);

  return (
    <div className="w-full h-full overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {columns.map(col => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DataLegend = ({ config, colors }: { config: ChartConfig; colors: string[] }) => {
  return (
    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="flex flex-wrap gap-4">
        {config.yAxis?.map((column, index) => (
          <div key={column} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm font-medium text-gray-700">{column}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
