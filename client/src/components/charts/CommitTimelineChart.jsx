import { useMemo } from 'react';
import clsx from 'clsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

/**
 * Custom tooltip for the timeline chart.
 */
function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        'rounded-lg border px-3 py-2 shadow-lg',
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
      )}
    >
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-semibold">
            {entry.value} commit{entry.value !== 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Recharts LineChart showing commits per hour during the hackathon.
 * Smooth curve, gradient stroke, tooltip, and dark mode colors.
 *
 * @param {object} props
 * @param {Array<{time: string, commits: number}>} props.data - Timeline data points
 * @param {number} [props.height] - Chart height (default 300)
 * @param {string} [props.title] - Optional chart title
 * @param {string} [props.className]
 */
export default function CommitTimelineChart({
  data = [],
  height = 300,
  title,
  className,
}) {
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: d.time || d.hour || d.label || '',
      commits: d.commits || d.count || d.value || 0,
    }));
  }, [data]);

  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const lineColor = '#6366f1'; // indigo-500
  const dotColor = isDark ? '#1f2937' : '#ffffff';

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
          No timeline data available
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
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="timelineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              dx={-4}
              label={{
                value: 'Commits',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: axisColor },
                offset: 10,
              }}
            />
            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{
                stroke: isDark ? '#4b5563' : '#d1d5db',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="url(#timelineGradient)"
              strokeWidth={2.5}
              dot={{
                fill: lineColor,
                stroke: dotColor,
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: lineColor,
                stroke: dotColor,
                strokeWidth: 2,
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
