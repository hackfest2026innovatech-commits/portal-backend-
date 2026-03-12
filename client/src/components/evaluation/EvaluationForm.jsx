import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { StarIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import * as evaluationService from '../../services/evaluation.service';
import toast from 'react-hot-toast';

const CRITERIA = [
  {
    key: 'innovation',
    label: 'Innovation',
    description: 'Originality and creativity of the idea',
    color: 'indigo',
  },
  {
    key: 'technical',
    label: 'Technical Implementation',
    description: 'Code quality, architecture, and technical complexity',
    color: 'teal',
  },
  {
    key: 'uiux',
    label: 'UI/UX',
    description: 'Design, user experience, and accessibility',
    color: 'amber',
  },
  {
    key: 'presentation',
    label: 'Presentation',
    description: 'Demo quality, communication, and clarity',
    color: 'rose',
  },
];

const colorMap = {
  indigo: {
    track: 'bg-indigo-100 dark:bg-indigo-900/30',
    fill: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'focus:ring-indigo-500',
  },
  teal: {
    track: 'bg-teal-100 dark:bg-teal-900/30',
    fill: 'bg-teal-500',
    text: 'text-teal-600 dark:text-teal-400',
    ring: 'focus:ring-teal-500',
  },
  amber: {
    track: 'bg-amber-100 dark:bg-amber-900/30',
    fill: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'focus:ring-amber-500',
  },
  rose: {
    track: 'bg-rose-100 dark:bg-rose-900/30',
    fill: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'focus:ring-rose-500',
  },
};

/**
 * Score slider for a single criterion.
 */
function ScoreSlider({ criterion, value, onChange }) {
  const colors = colorMap[criterion.color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className={clsx('text-sm font-semibold', colors.text)}>
            {criterion.label}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {criterion.description}
          </p>
        </div>
        <div
          className={clsx(
            'flex items-center justify-center',
            'w-12 h-12 rounded-xl',
            'border-2',
            value >= 8
              ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
              : value >= 5
                ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          )}
        >
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {value}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative pt-1">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className={clsx(
            'w-full h-2 rounded-full appearance-none cursor-pointer',
            colors.track,
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-current',
            '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-current',
            '[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer',
            colors.text,
            'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            colors.ring
          )}
          style={{
            background: `linear-gradient(to right, currentColor 0%, currentColor ${value * 10}%, transparent ${value * 10}%, transparent 100%)`,
          }}
        />
        {/* Scale markers */}
        <div className="flex justify-between mt-1 px-0.5">
          {Array.from({ length: 11 }, (_, i) => (
            <span
              key={i}
              className={clsx(
                'text-[10px] tabular-nums',
                i === value
                  ? 'font-semibold text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-600'
              )}
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Judge evaluation form with 4 criteria (Innovation, Technical, UI/UX, Presentation).
 * Each criterion has a 0-10 slider. Total score auto-calculated. Comments textarea.
 *
 * @param {object} props
 * @param {string} props.teamId - Team being evaluated
 * @param {string} [props.teamName] - Team name for display
 * @param {object} [props.existingEvaluation] - Existing evaluation data for editing
 * @param {Function} [props.onSubmitted] - Callback after successful submission
 * @param {string} [props.className]
 */
export default function EvaluationForm({
  teamId,
  teamName,
  existingEvaluation,
  onSubmitted,
  className,
}) {
  const [scores, setScores] = useState(() => {
    if (existingEvaluation?.scores) {
      return {
        innovation: existingEvaluation.scores.innovation ?? 5,
        technical: existingEvaluation.scores.technical ?? 5,
        uiux: existingEvaluation.scores.uiux ?? 5,
        presentation: existingEvaluation.scores.presentation ?? 5,
      };
    }
    return { innovation: 5, technical: 5, uiux: 5, presentation: 5 };
  });

  const [comments, setComments] = useState(existingEvaluation?.comments || '');
  const [submitting, setSubmitting] = useState(false);

  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, v) => sum + v, 0);
  }, [scores]);

  const maxScore = CRITERIA.length * 10;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleScoreChange = (key, value) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        teamId,
        scores,
        comments: comments.trim(),
      };

      if (existingEvaluation?._id) {
        await evaluationService.updateEvaluation(existingEvaluation._id, data);
        toast.success('Evaluation updated!');
      } else {
        await evaluationService.submitEvaluation(data);
        toast.success('Evaluation submitted!');
      }
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {existingEvaluation ? 'Edit Evaluation' : 'Evaluate Team'}
            </h2>
            {teamName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {teamName}
              </p>
            )}
          </div>

          {/* Total score badge */}
          <div
            className={clsx(
              'flex flex-col items-center px-4 py-2 rounded-xl',
              'border-2',
              percentage >= 80
                ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : percentage >= 50
                  ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
            )}
          >
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                {totalScore}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                /{maxScore}
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">
              Total
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Criteria sliders */}
        {CRITERIA.map((criterion) => (
          <ScoreSlider
            key={criterion.key}
            criterion={criterion}
            value={scores[criterion.key]}
            onChange={(val) => handleScoreChange(criterion.key, val)}
          />
        ))}

        {/* Score summary bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Overall Score
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {percentage}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-500 ease-out',
                percentage >= 80
                  ? 'bg-emerald-500'
                  : percentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Comments */}
        <Textarea
          label="Comments & Feedback"
          placeholder="Provide detailed feedback for the team..."
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          showCount
          maxLength={1000}
        />

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="submit" loading={submitting} variant="primary" icon={StarIcon}>
            {existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}
          </Button>
        </div>
      </div>
    </form>
  );
}
