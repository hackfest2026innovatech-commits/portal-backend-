import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm as useHookForm } from 'react-hook-form';
import * as formService from '../../services/form.service';
import { formatDate } from '../../utils/formatters';
import { FORM_FIELD_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function MyForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useHookForm();

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    setLoading(true);
    try {
      const data = await formService.getForms();
      const raw = data.data?.data || data.data?.forms || data.data || []; setForms(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data) {
    if (!activeForm) return;
    setSubmitting(true);
    try {
      const answers = activeForm.fields.map((field, idx) => ({
        fieldId: field._id || field.id || `field_${idx}`,
        fieldLabel: field.label,
        value: data[`field_${idx}`] || '',
      }));
      await formService.submitResponse(activeForm._id, { answers });
      toast.success('Form submitted successfully!');
      setActiveForm(null);
      reset();
      fetchForms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  }

  function renderField(field, idx) {
    const fieldName = `field_${idx}`;
    const commonProps = {
      ...register(fieldName, { required: field.required }),
      className: 'input-field',
    };

    switch (field.type) {
      case FORM_FIELD_TYPES.TEXTAREA:
        return <textarea {...commonProps} rows={4} className="input-field resize-none" placeholder={field.placeholder || ''} />;
      case FORM_FIELD_TYPES.NUMBER:
        return <input type="number" {...commonProps} placeholder={field.placeholder || ''} />;
      case FORM_FIELD_TYPES.URL:
        return <input type="url" {...commonProps} placeholder={field.placeholder || 'https://'} />;
      case FORM_FIELD_TYPES.EMAIL:
        return <input type="email" {...commonProps} placeholder={field.placeholder || 'email@example.com'} />;
      case FORM_FIELD_TYPES.SELECT:
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={typeof opt === 'string' ? opt : opt.value}>
                {typeof opt === 'string' ? opt : opt.label}
              </option>
            ))}
          </select>
        );
      case FORM_FIELD_TYPES.CHECKBOX:
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register(fieldName)} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{field.checkboxLabel || 'Yes'}</span>
          </label>
        );
      default:
        return <input type="text" {...commonProps} placeholder={field.placeholder || ''} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Forms</h1>
        </div>

        {activeForm ? (
          /* Form filling view */
          <div className="animate-fade-in">
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeForm.title}</h2>
              {activeForm.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{activeForm.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {activeForm.fields?.map((field, idx) => (
                <div key={idx} className="card p-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{field.description}</p>
                  )}
                  {renderField(field, idx)}
                </div>
              ))}

              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary gap-2">
                  {submitting ? 'Submitting...' : 'Submit Form'}
                </button>
                <button type="button" onClick={() => { setActiveForm(null); reset(); }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Forms list */
          <>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : forms.length === 0 ? (
              <div className="card p-12 text-center">
                <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No forms available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => (
                  <div key={form._id} className="card-hover p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{form.title}</h3>
                          {form.submitted && (
                            <span className="badge-success text-xs gap-1">
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                              Submitted
                            </span>
                          )}
                        </div>
                        {form.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{form.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                          {form.deadline && (
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3.5 h-3.5" />
                              Due {formatDate(form.deadline)}
                            </span>
                          )}
                          <span>{form.fields?.length || 0} questions</span>
                        </div>
                      </div>
                      {!form.submitted && (
                        <button
                          onClick={() => setActiveForm(form)}
                          className="btn-primary text-sm py-1.5 ml-4"
                        >
                          Fill Out
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
