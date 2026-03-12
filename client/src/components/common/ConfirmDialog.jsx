import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const isDanger = variant === 'danger';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center text-center py-2">
        <div
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-full mb-4',
            isDanger
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-indigo-100 dark:bg-indigo-900/30'
          )}
        >
          {isDanger ? (
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          ) : (
            <InformationCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex w-full gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            fullWidth
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
