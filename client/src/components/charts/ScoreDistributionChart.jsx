import { useMemo } from 'react';
import clsx from 'clsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const CRITERIA_COLORS = {
  innovation: '#6366f1', // indigo-500
  technical: '#14b8a6',  // teal-500
  uiux: '#f59e0b',       // amber-500
  presentation: '#f43f5e', // rose-500
};

const CRITERIA_LABELS = {
  innovation: 'Innovation',
  technical: 'Technical',
  uiux: 'UI/UX',
  presentation: 'Presentation',
};

/**
 * Custom tooltip for score distribution.
 */
function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        'rounded-lg border px-4 py-3 shadow-lg',
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
      )}
    >
      <p className="text-xs font-semibold mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-semibold tabular-nums">
              {entry.value?.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Custom legend renderer.
 */
function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      {payload?.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Recharts BarChart showing score distribution across teams with grouped bars for each criterion.
 *
 * @param {object} props
 * @param {Array} props.data - Array of { name, innovation, technical, uiux, presentation }
 * @param {number} [props.height] - Chart height (default 350)
 * @param {string} [props.title] - Optional chart title
 * @param {string} [props.className]
 */
export default function ScoreDistributionChart({
  data = [],
  height = 350,
  title,
  className,
}) {
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    return data.map((d) => ({
      name: d.name || d.team || '',
      innovation: d.innovation ?? 0,
      technical: d.technical ?? 0,
      uiux: d.uiux ?? 0,
      presentation: d.presentation ?? 0,
    }));
  }, [data]);

  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';

  if (!chartData.length) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center rounded-xl border',
          'bg-white dark:bg-gray-800 dark:border-gray-700',
          className
        )}
        style={{ height }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No score data available
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm',
        className
      )}
    >
      {title && (
        <div className="px-5 pt-5 pb-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
      )}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barCategoryGap="20%"
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              interval={0}
              angle={chartData.length > 6 ? -30 : 0}
              textAnchor={chartData.length > 6 ? 'end' : 'middle'}
              height={chartData.length > 6 ? 60 : 30}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{ fill: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)' }}
            />
            <Legend content={<CustomLegend />} />
            {Object.entries(CRITERIA_COLORS).map(([key, color]) => (
              <Bar
                key={key}
                dataKey={key}
                name={CRITERIA_LABELS[key]}
                fill={color}
                radius={[3, 3, 0, 0]}
                maxBarSize={24}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
