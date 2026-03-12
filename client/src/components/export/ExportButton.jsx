import { useState } from 'react';
import clsx from 'clsx';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import toast from 'react-hot-toast';

/**
 * Trigger a browser download from a Blob response.
 */
function downloadBlob(response, filename) {
  const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Try to get filename from Content-Disposition header
  const contentDisposition = response.headers?.['content-disposition'];
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    if (match) {
      filename = match[1];
    }
  }

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Button that triggers a CSV/file download. Shows loading spinner during download.
 *
 * @param {object} props
 * @param {Function} props.exportFn - Async function that returns an Axios response with blob data
 * @param {string} [props.filename] - Default filename for the download
 * @param {string} [props.label] - Button text (default: "Export CSV")
 * @param {string} [props.variant] - Button variant
 * @param {string} [props.size] - Button size
 * @param {string} [props.className]
 */
export default function ExportButton({
  exportFn,
  filename = 'export.csv',
  label = 'Export CSV',
  variant = 'secondary',
  size = 'md',
  className,
}) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!exportFn) {
      toast.error('Export function not configured');
      return;
    }

    setLoading(true);
    try {
      const response = await exportFn();
      downloadBlob(response, filename);
      toast.success('Download started!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(err.response?.data?.message || 'Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={ArrowDownTrayIcon}
      loading={loading}
      onClick={handleExport}
      className={className}
    >
      {label}
    </Button>
  );
}
