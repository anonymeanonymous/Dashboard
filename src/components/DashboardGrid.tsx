import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { ChartRenderer } from './ChartRenderer';
import { ChartConfig, Dataset, LayoutItem } from '../types/dashboard';
import { Settings, Trash2 } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  charts: ChartConfig[];
  datasets: Dataset[];
  layout: LayoutItem[];
  onLayoutChange: (layout: LayoutItem[]) => void;
  onChartRemove: (chartId: string) => void;
  onChartEdit: (chart: ChartConfig) => void;
}

export const DashboardGrid = ({
  charts,
  datasets,
  layout,
  onLayoutChange,
  onChartRemove,
  onChartEdit
}: DashboardGridProps) => {
  const handleLayoutChange = (newLayout: Layout[]) => {
    const updatedLayout: LayoutItem[] = newLayout.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h
    }));
    onLayoutChange(updatedLayout);
  };

  const defaultLayout = layout.length === 0
    ? charts.map((chart, index) => {
        const row = Math.floor(index / 2);
        const col = (index % 2) * 6;
        return {
          i: chart.id,
          x: col,
          y: row * 4,
          w: 6,
          h: 4
        };
      })
    : layout;

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: defaultLayout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={80}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".drag-handle"
      isResizable
      isDraggable
    >
      {charts.map(chart => {
        const dataset = datasets.find(d => d.id === chart.datasetId);
        if (!dataset) return null;

        return (
          <div key={chart.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="drag-handle bg-gray-50 px-4 py-2 flex items-center justify-between border-b cursor-move flex-shrink-0">
              <span className="text-sm font-medium text-gray-700 truncate">{chart.title}</span>
              <div className="flex gap-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => onChartEdit(chart)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Edit chart"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onChartRemove(chart.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Remove chart"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <ChartRenderer config={chart} dataset={dataset} />
            </div>
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
};
