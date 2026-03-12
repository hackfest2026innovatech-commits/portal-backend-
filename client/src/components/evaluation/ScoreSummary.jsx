import { useMemo } from 'react';
import clsx from 'clsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import Avatar from '../common/Avatar';

const criteriaConfig = [
  { key: 'innovation', label: 'Innovation', color: '#6366f1' },
  { key: 'technical', label: 'Technical', color: '#14b8a6' },
  { key: 'uiux', label: 'UI/UX', color: '#f59e0b' },
  { key: 'presentation', label: 'Presentation', color: '#f43f5e' },
];

/**
 * Custom tooltip for the bar chart.
 */
function CustomTooltip({ active, payload, isDark }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;

  return (
    <div
      className={clsx(
        'rounded-lg border px-3 py-2 shadow-lg',
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900'
      )}
    >
      <p className="text-xs font-semibold mb-1">{data?.label}</p>
      <p className="text-sm">
        Avg: <strong>{data?.avg?.toFixed(1)}</strong> / 10
      </p>
    </div>
  );
}

/**
 * Aggregated score summary for a team.
 * Shows a bar chart of avg score per criterion, overall average, and individual judge scores.
 *
 * @param {object} props
 * @param {Array} props.evaluations - Array of evaluation objects with scores and judge info
 * @param {string} [props.teamName] - Team name for the header
 * @param {string} [props.className]
 */
export default function ScoreSummary({ evaluations = [], teamName, className }) {
  const { isDark } = useTheme();

  const { chartData, overallAvg, judgeScores } = useMemo(() => {
    if (!evaluations.length) {
      return { chartData: [], overallAvg: 0, judgeScores: [] };
    }

    // Calculate averages per criterion
    const avgData = criteriaConfig.map((c) => {
      const values = evaluations
        .map((e) => e.scores?.[c.key])
        .filter((v) => v !== undefined && v !== null);
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

      return {
        label: c.label,
        key: c.key,
        avg: Math.round(avg * 10) / 10,
        color: c.color,
      };
    });

    // Overall average across all criteria
    const allAvg = avgData.reduce((sum, d) => sum + d.avg, 0) / avgData.length;

    // Individual judge scores
    const judges = evaluations.map((e) => {
      const total = Object.values(e.scores || {}).reduce((a, b) => a + (b || 0), 0);
      return {
        judge: e.judge,
        scores: e.scores,
        total,
        avg: total / criteriaConfig.length,
      };
    });

    return {
      chartData: avgData,
      overallAvg: Math.round(allAvg * 10) / 10,
      judgeScores: judges,
    };
  }, [evaluations]);

  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';

  if (!evaluations.length) {
    return (
      <div
        className={clsx(
          'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
          'p-6 text-center',
          className
        )}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No evaluations available yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Score Summary
            </h3>
            {teamName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {teamName}
              </p>
            )}
          </div>

          {/* Overall average badge */}
          <div
            className={clsx(
              'flex flex-col items-center px-4 py-2 rounded-xl',
              'border-2',
              overallAvg >= 8
                ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : overallAvg >= 5
                  ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
            )}
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {overallAvg}
            </span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">
              Avg Score
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Bar chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Average Scores by Criterion
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: axisColor }}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 12, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: isDark ? '#374151' : '#f3f4f6' }} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Individual judge scores */}
        {judgeScores.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Individual Judge Scores
            </h4>
            <div className="space-y-3">
              {judgeScores.map((js, idx) => (
                <div
                  key={js.judge?._id || idx}
                  className={clsx(
                    'flex items-center gap-4 p-3 rounded-lg',
                    'bg-gray-50 dark:bg-gray-800/50',
                    'border border-gray-100 dark:border-gray-700/50'
                  )}
                >
                  <Avatar
                    src={js.judge?.avatarUrl}
                    name={js.judge?.name || 'Judge'}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {js.judge?.name || `Judge ${idx + 1}`}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {criteriaConfig.map((c) => (
                        <span key={c.key} className="text-[11px] text-gray-500 dark:text-gray-400">
                          <span style={{ color: c.color }} className="font-semibold">
                            {js.scores?.[c.key] || 0}
                          </span>
                          {' '}{c.label.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                      {js.total}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      /{criteriaConfig.length * 10}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
