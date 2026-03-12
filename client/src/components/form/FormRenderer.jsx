import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { DocumentTextIcon, PaperClipIcon, LinkIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import * as formService from '../../services/form.service';
import toast from 'react-hot-toast';

/**
 * File input with drag-and-drop styling.
 */
function FileInput({ field, register, error }) {
  return (
    <div className="w-full">
      <label
        className={clsx(
          'flex flex-col items-center justify-center',
          'w-full h-32 rounded-lg border-2 border-dashed',
          'cursor-pointer transition-colors duration-200',
          error
            ? 'border-red-300 dark:border-red-500/50 hover:border-red-400'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500',
          'bg-gray-50/50 dark:bg-gray-800/30',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        )}
      >
        <div className="flex flex-col items-center gap-2 py-4">
          <PaperClipIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          {...register(field._id || field.text, {
            required: field.required ? 'This file is required' : false,
          })}
        />
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/**
 * Renders a form definition using react-hook-form.
 * Supports text, textarea, file, and link input types.
 *
 * @param {object} props
 * @param {object} props.form - Form definition { _id, title, description, fields: [...] }
 * @param {Function} [props.onSubmitted] - Callback after successful submission
 * @param {string} [props.className]
 */
export default function FormRenderer({ form, onSubmitted, className }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  if (!form || !form.fields?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This form has no questions.
        </p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Transform data into answers array
      const answers = form.fields.map((field) => {
        const key = field._id || field.text;
        let value = data[key];

        // Handle file inputs
        if (field.type === 'file' && value instanceof FileList) {
          value = value[0] || null;
        }

        return {
          fieldId: field._id,
          question: field.text,
          type: field.type,
          value,
        };
      });

      await formService.submitResponse(form._id, { answers });
      toast.success('Response submitted successfully!');
      reset();
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldKey = (field) => field._id || field.text;

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {form.title}
          </h2>
        </div>
        {form.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {form.description}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {form.fields.map((field, idx) => {
          const key = getFieldKey(field);
          const error = errors[key]?.message;
          const registerOpts = {
            required: field.required ? 'This field is required' : false,
          };

          return (
            <div key={key || idx} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.text}
                {field.required && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>

              {field.type === 'text' && (
                <Input
                  placeholder="Your answer..."
                  error={error}
                  {...register(key, registerOpts)}
                />
              )}

              {field.type === 'textarea' && (
                <Textarea
                  placeholder="Your answer..."
                  rows={4}
                  error={error}
                  {...register(key, registerOpts)}
                />
              )}

              {field.type === 'link' && (
                <Input
                  type="url"
                  placeholder="https://..."
                  icon={LinkIcon}
                  error={error}
                  {...register(key, {
                    ...registerOpts,
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL starting with http:// or https://',
                    },
                  })}
                />
              )}

              {field.type === 'file' && (
                <FileInput
                  field={field}
                  register={register}
                  error={error}
                />
              )}
            </div>
          );
        })}

        {/* Submit */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="submit" loading={submitting} variant="primary">
            Submit Response
          </Button>
        </div>
      </form>
    </div>
  );
}
