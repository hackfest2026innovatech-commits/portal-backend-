import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date string or Date object to a readable date format.
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The format string (date-fns format)
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid date';
  return format(parsed, formatStr);
}

/**
 * Format a date string or Date object to a readable time format.
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The format string (date-fns format)
 * @returns {string} Formatted time string
 */
export function formatTime(date, formatStr = 'h:mm a') {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid time';
  return format(parsed, formatStr);
}

/**
 * Format a date string or Date object to a full datetime format.
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(date) {
  return formatDate(date, 'MMM d, yyyy h:mm a');
}

/**
 * Format total seconds to HH:MM:SS display.
 * @param {number} totalSeconds - Total seconds to format
 * @returns {string} Formatted duration string as HH:MM:SS
 */
export function formatDuration(totalSeconds) {
  if (totalSeconds == null || totalSeconds < 0) return '00:00:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

/**
 * Get a human-readable "time ago" string.
 * @param {string|Date} date - The date to compare
 * @returns {string} Relative time string (e.g., "5 minutes ago")
 */
export function timeAgo(date) {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid date';
  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * Truncate text to a specified length with ellipsis.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Format a number with commas for thousands.
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (num == null) return '0';
  return num.toLocaleString();
}

/**
 * Format a score to one decimal place.
 * @param {number} score - The score to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted score string
 */
export function formatScore(score, decimals = 1) {
  if (score == null) return '0.0';
  return Number(score).toFixed(decimals);
}
