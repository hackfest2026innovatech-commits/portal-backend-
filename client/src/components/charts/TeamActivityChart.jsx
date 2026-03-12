import { useMemo } from 'react';
import clsx from 'clsx';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

/**
 * Custom tooltip for the activity chart.
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
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
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
              {entry.value}
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
 * Recharts AreaChart showing combined team activity (commits + submissions over time).
 *
 * @param {object} props
 * @param {Array<{time: string, commits: number, submissions: number}>} props.data - Activity data points
 * @param {number} [props.height] - Chart height (default 300)
 * @param {string} [props.title] - Optional chart title
 * @param {string} [props.className]
 */
export default function TeamActivityChart({
  data = [],
  height = 300,
  title,
  className,
}) {
  const { isDark } = useTheme();

  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: d.time || d.label || d.date || '',
      commits: d.commits || d.commitCount || 0,
      submissions: d.submissions || d.submissionCount || 0,
    }));
  }, [data]);

  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const commitColor = '#6366f1';     // indigo-500
  const submissionColor = '#14b8a6'; // teal-500

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
          No activity data available
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
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="activityCommitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={commitColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={commitColor} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="activitySubmissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={submissionColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={submissionColor} stopOpacity={0.02} />
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
            />
            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{
                stroke: isDark ? '#4b5563' : '#d1d5db',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke={commitColor}
              strokeWidth={2}
              fill="url(#activityCommitGradient)"
              dot={false}
              activeDot={{
                fill: commitColor,
                stroke: isDark ? '#1f2937' : '#ffffff',
                strokeWidth: 2,
                r: 5,
              }}
            />
            <Area
              type="monotone"
              dataKey="submissions"
              name="Submissions"
              stroke={submissionColor}
              strokeWidth={2}
              fill="url(#activitySubmissionGradient)"
              dot={false}
              activeDot={{
                fill: submissionColor,
                stroke: isDark ? '#1f2937' : '#ffffff',
                strokeWidth: 2,
                r: 5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
