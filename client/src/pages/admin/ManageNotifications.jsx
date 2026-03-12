import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as notificationService from '../../services/notification.service';
import { NOTIFICATION_TYPES, ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

export default function ManageNotifications() {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      message: '',
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      targetRole: '',
    },
  });

  async function onSubmit(data) {
    setIsSending(true);
    try {
      const payload = { ...data };
      if (!payload.targetRole) delete payload.targetRole;
      await notificationService.createNotification(payload);
      toast.success('Notification sent!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setIsSending(false);
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Send Notification</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Broadcast announcements to participants</p>
          </div>
        </div>

        <div className="card p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <MegaphoneIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">New Announcement</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">This will be sent to all or targeted users</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="input-field"
                placeholder="Notification title..."
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="input-field resize-none"
                placeholder="Write your announcement..."
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Type
                </label>
                <select id="type" className="input-field" {...register('type')}>
                  <option value={NOTIFICATION_TYPES.ANNOUNCEMENT}>Announcement</option>
                  <option value={NOTIFICATION_TYPES.INFO}>Info</option>
                  <option value={NOTIFICATION_TYPES.WARNING}>Warning</option>
                  <option value={NOTIFICATION_TYPES.SUCCESS}>Success</option>
                  <option value={NOTIFICATION_TYPES.ERROR}>Error</option>
                </select>
              </div>

              <div>
                <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Target Audience
                </label>
                <select id="targetRole" className="input-field" {...register('targetRole')}>
                  <option value="">Everyone</option>
                  <option value={ROLES.STUDENT}>Students only</option>
                  <option value={ROLES.JUDGE}>Judges only</option>
                  <option value={ROLES.SUPERADMIN}>Admins only</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full btn-primary py-2.5 gap-2"
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Send Notification
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
