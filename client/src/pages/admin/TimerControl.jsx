import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from '../../hooks/useTimer';
import * as timerService from '../../services/timer.service';
import { formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function TimerControl() {
  const { hours, minutes, seconds, isRunning, totalSeconds, loading } = useTimer();
  const [durationHours, setDurationHours] = useState(2);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleStart() {
    const totalSecs = durationHours * 3600 + durationMinutes * 60;
    if (totalSecs <= 0) {
      toast.error('Please set a valid duration');
      return;
    }
    setActionLoading(true);
    try {
      await timerService.startTimer(totalSecs);
      toast.success('Timer started!');
    } catch (error) {
      toast.error('Failed to start timer');
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePause() {
    setActionLoading(true);
    try {
      await timerService.pauseTimer();
      toast.success('Timer paused');
    } catch {
      toast.error('Failed to pause timer');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResume() {
    setActionLoading(true);
    try {
      await timerService.resumeTimer();
      toast.success('Timer resumed');
    } catch {
      toast.error('Failed to resume timer');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReset() {
    if (!window.confirm('Are you sure you want to reset the timer?')) return;
    setActionLoading(true);
    try {
      await timerService.resetTimer();
      toast.success('Timer reset');
    } catch {
      toast.error('Failed to reset timer');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timer Control</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage the hackathon countdown</p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="card p-10 text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ClockIcon className="w-6 h-6 text-primary-500" />
            {isRunning && (
              <span className="badge-success text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse inline-block" />
                Running
              </span>
            )}
            {!isRunning && totalSeconds > 0 && (
              <span className="badge-warning text-sm">Paused</span>
            )}
            {!isRunning && totalSeconds === 0 && (
              <span className="badge text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Not started
              </span>
            )}
          </div>

          <div className="font-mono text-7xl font-bold tracking-wider text-gray-900 dark:text-white mb-2">
            {loading ? '--:--:--' : formatDuration(totalSeconds)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDuration(totalSeconds)} remaining
          </p>
        </div>

        {/* Set Duration */}
        {!isRunning && totalSeconds === 0 && (
          <div className="card p-6 mb-6 animate-slide-up">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Set Duration</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="48"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value) || 0)}
                  className="input-field text-center text-lg font-mono"
                />
              </div>
              <span className="text-2xl font-bold text-gray-400 mt-6">:</span>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                  className="input-field text-center text-lg font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3 animate-slide-up">
          {!isRunning && totalSeconds === 0 && (
            <button
              onClick={handleStart}
              disabled={actionLoading}
              className="flex-1 btn-primary py-3 text-lg gap-2"
            >
              <PlayIcon className="w-6 h-6" />
              Start Timer
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              disabled={actionLoading}
              className="flex-1 btn-secondary py-3 text-lg gap-2"
            >
              <PauseIcon className="w-6 h-6" />
              Pause
            </button>
          )}

          {!isRunning && totalSeconds > 0 && (
            <button
              onClick={handleResume}
              disabled={actionLoading}
              className="flex-1 btn-primary py-3 text-lg gap-2"
            >
              <PlayIcon className="w-6 h-6" />
              Resume
            </button>
          )}

          {totalSeconds > 0 && (
            <button
              onClick={handleReset}
              disabled={actionLoading}
              className="btn-danger py-3 px-6 text-lg gap-2"
            >
              <ArrowPathIcon className="w-6 h-6" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
