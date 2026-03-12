import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as formService from '../../services/form.service';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function FormDetail() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [formData, respData] = await Promise.allSettled([
          formService.getFormById(formId),
          formService.getResponses(formId),
        ]);
        if (formData.status === 'fulfilled') {
          setForm(formData.value.data?.form || formData.value.form || formData.value.data || formData.value);
        }
        if (respData.status === 'fulfilled') {
          setResponses(respData.value.data?.responses || respData.value.responses || respData.value.data || []);
        }
      } catch {
        toast.error('Failed to load form');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Form not found</p>
          <Link to="/forms" className="mt-4 btn-primary inline-block">Back to Forms</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/forms" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{form.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {responses.length} responses &middot; {form.fields?.length || 0} fields
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Form Info */}
          <div className="card p-6 animate-fade-in">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-primary-500" />
              Form Details
            </h2>
            {form.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{form.description}</p>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(form.createdAt)}</p>
              </div>
              {form.deadline && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Deadline</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(form.deadline)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="card p-6 animate-slide-up">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Form Fields</h2>
            <div className="space-y-3">
              {form.fields?.map((field, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{field.label}</p>
                    <span className="badge-primary text-xs">{field.type}</span>
                  </div>
                  {field.required && (
                    <span className="text-xs text-red-500">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Responses */}
          <div className="card p-6 animate-slide-up">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5 text-green-500" />
              Responses ({responses.length})
            </h2>
            {responses.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No responses submitted yet</p>
            ) : (
              <div className="space-y-4">
                {responses.map((resp) => (
                  <div key={resp._id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {resp.user?.name || resp.userId || 'Anonymous'}
                      </p>
                      <span className="text-xs text-gray-400">{formatDate(resp.createdAt)}</span>
                    </div>
                    <div className="space-y-1">
                      {resp.answers?.map((answer, i) => (
                        <p key={i} className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{answer.fieldLabel || `Q${i + 1}`}: </span>
                          {String(answer.value)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
