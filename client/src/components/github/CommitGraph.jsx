import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import clsx from 'clsx';
import { useTheme } from '../../hooks/useTheme';

/**
 * Custom tooltip for the commit graph.
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
        <p key={idx} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.value} commit{entry.value !== 1 ? 's' : ''}
        </p>
      ))}
    </div>
  );
}

/**
 * Recharts AreaChart showing commit activity over time.
 * Dark mode compatible with gradient fill and auto-updates.
 *
 * @param {object} props
 * @param {Array<{time: string, count: number}>} props.data - Array of time/count data points
 * @param {number} [props.height] - Chart height in pixels (default 300)
 * @param {string} [props.className]
 */
export default function CommitGraph({ data = [], height = 300, className }) {
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    if (!data.length) return [];
    return data.map((d) => ({
      time: d.time || d.label || d.date || '',
      count: d.count || d.commits || d.value || 0,
    }));
  }, [data]);

  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const accentColor = '#6366f1'; // indigo-500

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
          No commit data available
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4',
        className
      )}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: axisColor }}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
            dy={8}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: axisColor }}
            tickLine={false}
            axisLine={false}
            dx={-4}
            label={{
              value: 'Commits',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: axisColor },
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
          <Area
            type="monotone"
            dataKey="count"
            stroke={accentColor}
            strokeWidth={2.5}
            fill="url(#commitGradient)"
            dot={{
              fill: accentColor,
              stroke: isDark ? '#1f2937' : '#ffffff',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              fill: accentColor,
              stroke: isDark ? '#1f2937' : '#ffffff',
              strokeWidth: 2,
              r: 6,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
